import bot from '..';

const message = [
  'Я ничего не умею, а ты?',
].join('\n');

bot.command('/help', (ctx) => {
  ctx.replyWithHTML(message);
});