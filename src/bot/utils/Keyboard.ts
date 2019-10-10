import { KeyboardButton, ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export default (...buttons: KeyboardButton[][]): ExtraReplyMessage => {
  return {
    reply_markup: {
      keyboard: buttons,
      resize_keyboard: true,
    },
  };
};