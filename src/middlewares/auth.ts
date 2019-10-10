import { Request, Response, NextFunction } from 'express';
import logger from '../core/Logger';
import { sha256, hmac } from 'hash.js';
import AppConfig from '../config';

const hashedToken = sha256().update(AppConfig.BOT_TOKEN).digest();
export default (req: Request, res: Response, next: NextFunction) => {
  const [type, encodedData] = (req.headers.authorization || '').split(' ');

  /*
    encodedData is base64 encoded JSON data that was sent from the Telegram.
    It should be verified by comparing data.hash value with our own computed hash.

    How to compute hash:
      1. Exclude hash field from the data
      2. Create a string in format "$field=$value", separated by \n (these lines must be sorted alphabetically)
      3. hmac_sha256 this string with a sha-256 hashed bot token
  */
  if (type === 'Basic' && encodedData) {
    try {
      const data = JSON.parse(Buffer.from(encodedData, 'base64').toString());
      const sortedKeys = Object.keys(data).filter(v => v != 'hash').sort();
      const checkString = sortedKeys.map(k => `${k}=${data[k]}`).join('\n');
      const hash = hmac(sha256 as any, hashedToken).update(checkString).digest('hex');

      if (hash === data.hash) {
        req.authorization = data;
      } 
      else {
        throw new Error('Signature is not valid');
      }
    }
    catch (err) {
      logger.warn('Failed to verify the authorization', { ip: req.ip, header: req.headers.authorization, error: err.toString() });
      res.status(403).send();
      return;
    }
  } 

  next();
};