import Scene from 'telegraf/scenes/base';
import bot, { stage } from '../';

import AppConfig from '../../config';
import LostEntry from '../core/LostEntry';
import InlineKeyboard from '../utils/InlineKeyboard';
import { getMessageContent, modKeyboard } from '../actions/lost';

const finishHelpDialog = async (ctx, phone?: string) => {
  if (phone && phone[0] != '+') {
    phone = `+${phone}`;
  }

  const content = getMessageContent(ctx.from, ctx.session.location, phone);
  const msg = await bot.telegram.sendMessage(AppConfig.BOT_SUGGESTION_GROUP, content, modKeyboard);
  
  const { latitude, longitude } = ctx.session.location;
  LostEntry.create({ id: ctx.from.id, phone, latitude, longitude, messageId: ctx.message.message_id, modMessageId: msg.message_id });
  
  const helpKb = InlineKeyboard([{ text: 'Со мной всё хорошо', callback_data: 'l_close_entry' }]);
  const instructions = [
    '<b>Твоя локация была передана в надёжные руки!</b>\n',
    'Оставайся там, где ты оставил(а) метку.',
    'Скоро с тобой свяжутся и помогут с твоей проблемой.\n',
    '<i>Если твоя проблема решилась, пожалуйста, нажми на кнопку "Со мной всё хорошо", чтобы мы не волновались.</i>',
  ].join('\n');

  delete ctx.session.location;

  await ctx.reply('Возвращаемся в главное меню...', await ctx.getKeyboard());
  await ctx.replyWithHTML(instructions, helpKb);
};

const scene = new Scene('lost_contact');

scene.on('contact', (ctx) => {
  const { contact } = ctx.message;
  ctx.scene.leave();
  finishHelpDialog(ctx, contact.phone_number);
});

scene.hears('✊ Нет, спасибо', async (ctx) => {
  ctx.scene.leave();
  finishHelpDialog(ctx);
});

stage.register(scene);
