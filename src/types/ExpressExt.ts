import User from "../core/User";
import IAuthorization from '../core/base/IAuthorization';

declare global {
  namespace Express {
    export interface Request {
      authorization?: IAuthorization;
      user?: User;
    }
  }
}