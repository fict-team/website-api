import bot, { stage } from '..';
import sendAuthMessage from './auth';
//import AppConfig from '../../config';

const helloMessage = [
  '<b>Привет, я дружелюбный FICT robot.</b>\n',
  //'Моя цель существования - помощь студентам.\n',
  'На время таких событий, как День первокурсника и посвящение, я буду помогать с различными проблемами, которые у тебя могут возникнуть.\n',
  'Для более подробной информации напиши /lost',
  //`Наш сайт: https://${AppConfig.HOST}`,
  //'Официальный чат: https://t.me/fict_talk',
  //'Официальный канал: https://t.me/fict_time',
].join('\n');

const handlers = {
  auth: sendAuthMessage,
  join: () => {},
};

bot.start(async (ctx) => {
  const tokens = ctx.message.text.split(' ');
  const action = tokens[1];

  if (action && handlers[action]) {
    return handlers[action](ctx);
  }

  stage.leave();
  ctx.replyWithHTML(helloMessage, await ctx.getKeyboard());
});