import bot from '..';
import { ReplyKeyboardMarkup } from 'telegraf/typings/telegram-types';
import Keyboard from '../utils/Keyboard';
import escape from 'html-escape';

bot.context.getUserTag = function(user = null) {
  if (!user) { user = this.from; }

  const name = user.username ? `@${user.username}` : (user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name);
  return `<a href="tg://user?id=${user.id}">${escape(name)}</a>`;
};

bot.context.getKeyboard = async function(params = {}) {
  const kb = Keyboard(
    //[{ text: '🌍 Веб-сайт' }],
    [{ text: '🆘 Мне нужна помощь', request_location: true }]
  );

  (kb.reply_markup as ReplyKeyboardMarkup).resize_keyboard = true;
  Object.assign(kb, params);

  return kb;
};