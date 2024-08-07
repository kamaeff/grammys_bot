import {Bot, Context} from 'grammy';
import dotenv from 'dotenv';
import {errHandler} from './shared/utils/errors';
import {commands} from './shared/data/commands';
import {containsBadWords} from './shared/data/regs';
dotenv.config();

const bot: Bot = new Bot(String(process.env.TOKEN));

bot.api.setMyCommands(commands);

// TODO: сделать регу или логинацию по email (::email)
// сделать через bot.hears реакцию на помоги => сделать вызов как в help (массив -> ['помоги','Помоги','help','Help'])
// Сделать фильтрацию ругательств через регулярки
bot.command('start', async ctx => {
  const id: number = ctx.chatId;
  const msg_id: number = ctx.msg?.message_id ?? 0;

  if (!msg_id) return;

  await ctx.api.deleteMessage(id, msg_id);
  await ctx.reply(
    `Welcome ${ctx.message?.from.first_name}!\nWrite your login:`,
  );
});

bot.on('msg:text', async (ctx: Context) => {
  if (!ctx.msg || !ctx.msg.text) return;

  const id: number = ctx.chatId || 0;
  const msg_id: number = ctx.msg?.message_id ?? 0;

  if (containsBadWords(ctx.msg.text)) {
    return ctx.reply('Bad word!');
  }

  try {
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
