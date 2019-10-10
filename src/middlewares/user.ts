import { Request, Response, NextFunction } from 'express';
import User from '../core/User';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.authorization) {
    try {
      const id = parseInt(req.authorization.id);
      const user = await User.get(id) || User.default(id); 

      req.user = user;
    }
    catch (err) {
      return next(err);
    }
  }

  next();
};