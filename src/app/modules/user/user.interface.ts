import { Model } from "mongoose";
import { TUserRole } from "../../constants/roles";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isActive: boolean;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;
