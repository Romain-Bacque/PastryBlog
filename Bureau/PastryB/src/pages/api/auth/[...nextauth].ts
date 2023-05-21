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
  role: string | null | undefined;
}

const options: MyNextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // try {
      //   await dbConnect();

      //   if (!user || !user.email) {
      //     throw new Error("Utilisateur n'existe pas!");
      //   }

      //   const userInfos = await User.findOne({ email: user.email });

      //   if (!userInfos || !("role" in userInfos)) {
      //     throw new Error("Utilisateur n'existe pas!");
      //   }

      //   token.role = userInfos.role;
      // } catch {}

      token.role = "admin";

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
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
