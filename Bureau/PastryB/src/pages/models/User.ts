import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: "admin" | "user";
  hashPassword: (arg: string) => Promise<string>;
  findAndValidate: (
    password: string,
    passwordToVerify: string
  ) => Promise<boolean | IUser>;
}

interface IUserModel extends Model<IUser> {
  hashPassword: (arg: string) => Promise<string>;
  findAndValidate: (
    password: string,
    username: string
  ) => Promise<boolean | IUser>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username cannot be blank"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank"],
  },
  email: {
    type: String,
    required: [true, "Email cannot be blank"],
    unique: true,
  },
  role: {
    type: String,
    required: [true, "Role cannot be blank"],
    default: "user",
  },
});

// Middleware that compare passwords
userSchema.statics.findAndValidate = async function (
  password: string,
  email: string
): Promise<boolean | IUser> {
  const foundedUser: IUser = await this.findOne({ email });

  if (!foundedUser) return false;

  const isValid = await bcrypt.compare(password, foundedUser.password);

  return isValid ? foundedUser : false;
};

// Middlewares that hashes the password
userSchema.statics.hashPassword = async function (
  plainTextPassword: string
): Promise<string> {
  return await bcrypt.hash(plainTextPassword, 12);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>("User", userSchema);
