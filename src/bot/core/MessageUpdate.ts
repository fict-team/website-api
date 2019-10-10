import { ContextMessageUpdate } from 'telegraf';
import { ExtraReplyMessage, User } from 'telegraf/typings/telegram-types';

export default interface MessageUpdate extends ContextMessageUpdate {
  session: any;
  scene: any;

  getKeyboard(params?: Partial<ExtraReplyMessage>): Promise<ExtraReplyMessage>;
  getUserTag(user?: User): string;
};