import {Bot, Context, InlineKeyboard} from 'grammy';
import {hydrate, HydrateFlavor} from '@grammyjs/hydrate';

import dotenv from 'dotenv';
import {errHandler} from './shared/utils/errors';
import {commands} from './shared/data/commands';
import {detectBadWords} from './shared/data/regs';
import {backBtn, startBtns} from './shared/utils/buttons';
import {MyContext} from './shared/types/common.types';

dotenv.config();

const bot = new Bot<MyContext>(String(process.env.TOKEN));
bot.use(hydrate());

bot.api.setMyCommands(commands);

// TODO: сделать регу или логинацию по email (::email)
// сделать через bot.hears реакцию на помоги => сделать вызов как в help (массив -> ['помоги','Помоги','help','Help'])
bot.command('start', async ctx => {
  const id: number = ctx.chatId;
  const msg_id: number = ctx.msg?.message_id ?? 0;

  if (!msg_id) return;

  try {
    await ctx.api.deleteMessage(id, msg_id);
    await ctx.reply(`Welcome ${ctx.message?.from.first_name}!\n`, {
      reply_markup: startBtns,
    });
  } catch (error) {
    console.error('Error while deleting message:', error);
  }
});

bot.on('callback_query:data', async ctx => {
  if (!ctx.msg || !ctx.msg.text) return;

  const id: number = ctx.chat?.id || 0;
  const msg_id: number = ctx.msg?.message_id ?? 0;

  switch (ctx.callbackQuery.data) {
    case 'login':
      await ctx.callbackQuery.message?.editText(`Now I need your email: `, {
        reply_markup: backBtn,
      });
      break;

    case 'reg':
      await ctx.callbackQuery.message?.editText(`Now I need your email: `, {
        reply_markup: backBtn,
      });
      break;

    case 'back':
      await ctx.callbackQuery.message?.editText(
        `Welcome ${ctx.chat?.first_name}! `,
        {
          reply_markup: startBtns,
        },
      );
  }
});

bot.on('msg:text', async (ctx: Context) => {
  if (!ctx.msg || !ctx.msg.text) return;

  const id: number = ctx.chatId || 0;
  const msg_id: number = ctx.msg?.message_id ?? 0;

  const isBad = await detectBadWords({ctx, msg_id});

  try {
    if (isBad) return;

    await ctx.api.deleteMessage(id, msg_id);
    await ctx.api.editMessageText(
      id,
      msg_id - 1,
      `Nice to meet you, ${ctx.msg?.text}!\nNow I need your password: `,
    );
  } catch (error) {
    console.error('Failed to delete or edit message:', error);
  }
});

bot.command('doctopdf').filter(
  ctx => {
    if (!ctx.msg?.document) return false;

    const fileName = ctx.msg?.document.file_name;
    if (!fileName) return false;

    return fileName.endsWith('.doc') || fileName.endsWith('.docx');
  },
  async ctx => {
    const id: number = ctx.chat.id;
    const msg_id: number = ctx.msg?.message_id ?? 0;

    await ctx.api.deleteMessage(id, msg_id);

    await ctx.reply('Wait...');
  },
);

errHandler(bot);
bot.start();
