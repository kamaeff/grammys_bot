import {Bot} from 'grammy';
import dotenv from 'dotenv';
import {errHandler} from './utils/errors';
dotenv.config();

const bot: Bot = new Bot(String(process.env.TOKEN));

bot.command('start', async ctx => {
  const id: number = ctx.chatId;
  const msg_id: number = ctx.message?.message_id ?? 0;

  if (!msg_id) return;

  await ctx.api.deleteMessage(id, msg_id);
  await ctx.reply(
    `Welcome ${ctx.message?.from.first_name}!\nWrite your login:`,
  );
});

bot.on('message:text', async ctx => {
  const id: number = ctx.chatId;
  const msg_id: number = ctx.message?.message_id ?? 0;

  await ctx.api.deleteMessage(id, msg_id);
  await ctx.api.editMessageText(
    id,
    msg_id - 1,
    `Nice to meet you, ${ctx.message.text}!\nNow I need your password: `,
  );
});

errHandler(bot);
bot.start();
