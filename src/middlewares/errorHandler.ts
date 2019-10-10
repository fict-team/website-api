import { Request, Response, NextFunction } from 'express';

export default (error: any, req: Request, res: Response, next: NextFunction) => {
  if (typeof(error) != 'object') {
    error = {
      message: 'invalid error object was provided, no details',
    };
  };

  const message = error.message || error.toString();
  const details = error.details || {};

  res.status(500).json({ message, details });
};