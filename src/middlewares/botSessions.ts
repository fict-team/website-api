import { TelegrafMongoSession } from 'telegraf-session-mongodb';
import Database from '../core/db';
import logger from '../core/Logger';

let session;
Database.get().then((db) => {
  session = new TelegrafMongoSession(db, {
    collectionName: 'fict_bot_sessions',
    sessionName: 'session',
  });

  logger.info('Initialized bot sessions');
});

export default (...args) => session.middleware(...args);