import { TUserRole } from "../constants/roles";

export interface IJwtPayload {
  userId: string;
  email: string;
  role: TUserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
