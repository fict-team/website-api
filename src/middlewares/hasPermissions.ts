import { Request, Response, NextFunction } from 'express';
import { UserPermissions } from '../core/base';

const defaultCallback = (req: Request, res: Response, next: NextFunction) => {
  res.status(403).send();
};

export default (permissions: UserPermissions, callback = defaultCallback) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.permissions & permissions) !== permissions) {
      return callback(req, res, next);
    }

    next();
  };
};