import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import { USER_ROLE, USER_ROLES_ARRAY } from "../../constants/roles";
import { env } from "../../config/env";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES_ARRAY,
      default: USER_ROLE.EMPLOYEE,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
  next();
});

// Instance method to compare password on login
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never leak password field even if explicitly selected somewhere
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, ...rest } = ret;
    return rest;
  },
});

export const User = model<IUser, UserModel>("User", userSchema);
