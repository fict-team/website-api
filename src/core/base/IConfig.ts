export default interface IConfig {
  BOT_TOKEN: string;
  BOT_LOG_GROUP: number;
  BOT_SUGGESTION_GROUP: number;
  BOT_FORWARD_GROUPS: number[];

  MONGODB_URI: string;

  HOST: string;
  PORT: number;
};