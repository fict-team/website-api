import AppConfig from '../../config';
import InlineKeyboard from '../utils/InlineKeyboard';
import bot from '..';
import LostEntry from '../core/LostEntry';
import { ExtraEditMessage, User, Location } from 'telegraf/typings/telegram-types';
import Keyboard from '../utils/Keyboard';

const modKeyboard = InlineKeyboard([{ text: 'Я помогу', callback_data: 'l_will_help' }]) as ExtraEditMessage;
modKeyboard.parse_mode = 'HTML';

bot.command('/lost', (ctx) => {
  if (ctx.chat.type != 'private') { return; }
  
  ctx.replyWithHTML('Ты потерялся или у тебя что-то случилось? Ничего, не бойся.\n\n<b>Отправь мне свою локацию через вложения или нажми на кнопку "Мне нужна помощь", чтобы я смог тебе помочь!</b>')
});

const getMessageContent = (user: User, location: Location | string, phone?: string) => {
  const url = typeof(location) === 'string' ? location : `https://google.com/maps/?q=${location.latitude},${location.longitude}`;
  const entry = LostEntry.get(user.id);
  const onCase = entry ? entry.peopleOnCase : [];

  const modMessage = [
    `${bot.context.getUserTag(user)} <b>нуждается в вашей помощи.</b>\n`,
    phone ? `<b>Номер телефона:</b> <a href="tel:${phone}">${phone}</a>\n` : null,
    onCase.length === 0 ? '<i>Пока никто не вызвался на помощь.</i>\n' : `<b>Вызвались на помощь: </b>` + onCase.map(p => p.name).join(', ') + '\n',
    `<a href="${url}">Открыть отправленную локацию в Google Maps</a>`
  ].filter(v => v != null).join('\n');

  return modMessage;
};

bot.on('location', async (ctx) => {
  if (LostEntry.get(ctx.from.id)) {
    ctx.replyWithHTML('<b>Ты уже отправлял запрос о помощи!</b>\n\nТебе не надо создавать новый запрос, мы про тебя не забыли. Чтобы добавить какую-то новую информацию, можешь просто написать мне её.')
    return;
  }

  const kb = Keyboard([{ text: '☎️ Отправить свой контакт', request_contact: true }], [{ text: '✊ Нет, спасибо' }]);
  const msg = [
    '<b>Помоги нам помочь тебе.</b>',
    'Если ты укажешь номер телефона для связи с тобой, нам будет удобнее и мы сможем быстрее помочь тебе.',
    'Чтобы сделать это, просто нажми "Отправить свой контакт". Если ты не хочешь делиться с нами такой информацией, нажми "Нет, спасибо".',
  ].join('\n\n');

  ctx.scene.enter('lost_contact');
  ctx.session.location = ctx.message.location; 
  
  await ctx.replyWithHTML(msg, kb);
});

bot.on('callback_query', async (ctx) => {
  const query = ctx.callbackQuery;

  if (query.data === 'l_close_entry') {
    const entry = LostEntry.get(query.from.id);
    if (!entry) { return await ctx.answerCbQuery('Это событие уже устарело'); }

    const onCase = entry.peopleOnCase;
    const resolvedMsg = [
      '<b>Проблема решена</b>\n',
      `${ctx.getUserTag(query.from)} сообщил(а) мне, что всё уладилось.\n`,
      (onCase.length === 0 ? '' : `<b>Помогали: </b>` + onCase.map(p => p.name).join(', '))
    ].join('\n');
    
    await bot.telegram.editMessageText(AppConfig.BOT_SUGGESTION_GROUP, entry.modMessageId, null, resolvedMsg, { parse_mode: 'HTML' });
    await bot.telegram.editMessageText(query.from.id, query.message.message_id, null, 'Я очень рад, что мы смогли помочь с твоей проблемой!\nНе бойся обращаться ещё, если что-нибудь случится.');

    entry.delete();
  }
  else if (query.data === 'l_will_help') {
    const ents = query.message.entities;

    const mention = ents[0];
    if (!mention) { return await ctx.answerCbQuery('Неизвестный пользователь'); }

    const { user } = mention;
    const entry = LostEntry.get(user.id);
    if (!entry) { return await ctx.answerCbQuery('Это событие уже устарело'); }

    const isOnCase = entry.toggleCase(query.from.id, ctx.getUserTag(query.from));
    if (!isOnCase) { await ctx.answerCbQuery('Ты отозвал своё предложение о помощи');  }

    const locationUrl = ents[ents.length - 1].url;
    const content = getMessageContent(user, locationUrl, entry.phone);
    await bot.telegram.editMessageText(query.message.chat.id, entry.modMessageId, null, content, modKeyboard);
  }

  await ctx.answerCbQuery();
});

export { 
  getMessageContent,
  modKeyboard,
};