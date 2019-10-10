import MessageUpdate from '../core/MessageUpdate';
import AppConfig from '../../config';
import InlineKeyboard from '../utils/InlineKeyboard';

const message = [
  `<b>Авторизация на сайте</b> https://${AppConfig.HOST}/\n`,
  'Для того, чтобы авторизоваться на сайте, необходимо нажать на кнопку ниже и разрешить передачу своих данных.',
].join('\n');

export default (ctx: MessageUpdate) => {
  const kb = InlineKeyboard(
    [
      {
        text: 'Авторизироваться',
        login_url: {  
          url: `https://${AppConfig.HOST}/api/auth`,
          request_write_access: true,
        }
      } as any
    ]
  );

  ctx.replyWithHTML(message, kb);
};