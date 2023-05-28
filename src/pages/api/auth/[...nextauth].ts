// we need this catch all route because the next auth package behind the scenes
// will expose multiple routes for user login and for user logout, for example.
import NextAuth, { Awaitable, NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../utils/databaseConnection";
import { User } from "../../models/User";
import { loginSchema } from "../../validation/schemas";
import { validate } from "../../validation/validate";
import { JWT } from "next-auth/jwt";
import { ExtendedSession } from "../../../global/types";

interface MyNextAuthOptions extends NextAuthOptions {
  authorize?: (credentials: {
    username: string;
    password: string;
  }) => Awaitable<{ email: string } | null>;
}

interface ExtendedJWT extends JWT {
  id: string | null | undefined;
  role: string | null | undefined;
}

const options: MyNextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // The signIn method in NextAuth is triggered during the authentication process when a user successfully signs in or logs in
    async signIn({ user }) {
      const { email, name: username } = user;

      try {
        await dbConnect();

        const userExist = await User.findOne({
          username,
          email,
        });

        if (userExist) {
          throw new Error("Utilisateur existe déja!");
        }

        const user = new User({ username, email });

        await user.save();
      } catch {}

      return true; // Return true to allow sign-in
    },
    // The jwt callback is used to customise and manipulate the JSON Web Token (JWT) before it is signed and returned to the client during authentication. It is called each time a user logs in and the JWT token is generated.
    async jwt({ token, user }) {
      try {
        await dbConnect();

        if (!user || !user.email) {
          throw new Error("Utilisateur n'existe pas!");
        }

        const userInfos = await User.findOne({ email: user.email });

        if (!userInfos || !("role" in userInfos)) {
          throw new Error("Utilisateur n'existe pas!");
        }

        token.id = userInfos._id;
        token.role = userInfos.role;
      } catch {}

      token.role = "admin";

      return token;
    },
    // The session callback is used to customise and manipulate the session object associated with the authenticated user.
    async session({ session, token }) {
      if (session.user) {
        (session as ExtendedSession).user.id = (token as ExtendedJWT).id;
        (session as ExtendedSession).user.role = (token as ExtendedJWT).role;
      }

      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID ?? "",
      clientSecret: process.env.CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const isValidated = validate(loginSchema, { email, password });

        if (!isValidated) {
          throw new Error("Invalid input.");
        }

        try {
          await dbConnect();

          const user = await User.findAndValidate(password, email);

          if (!(user instanceof Object) || !("email" in user)) {
            throw new Error("Utilisateur n'existe pas!");
          }

          // The object below will be automatically encoded in a JWT
          return {
            id: user.id, // id is mandatory
            username: user.username,
            email: user.email,
            role: user.role,
          };
        } catch (err) {
          throw new Error("Une erreur est survenue!");
        }
      },
    }),
  ],
};

export default NextAuth(options);
