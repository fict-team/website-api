import { InlineKeyboardButton, ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export default (...buttons: InlineKeyboardButton[][]): ExtraReplyMessage => {
  return {
    reply_markup: {
      inline_keyboard: buttons,
      resize_keyboard: true,
    },
  };
};