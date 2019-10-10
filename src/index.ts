import Database from './core/db';
import AppConfig from './config';
import logger from './core/Logger';

Database.connect(AppConfig.MONGODB_URI)
  .then((db) => logger.info('Connected to the database:', db.databaseName))
  .catch((err) => logger.error('Failed to connected to the database:', err.toString()));

import './app';
import './bot';