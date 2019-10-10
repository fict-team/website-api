import bot from '..';
import escape from 'html-escape';

const MASTER_ID = 311015902;

bot.command('/debug', (ctx) => {
  if (ctx.from.id != MASTER_ID) { return; }

  const from = JSON.stringify(ctx.from, null, 2);
  const chat = JSON.stringify(ctx.chat, null, 2);
  ctx.replyWithHTML(`<pre>From:\n${escape(from)}\n\nChat:\n${escape(chat)}</pre>`);
});
