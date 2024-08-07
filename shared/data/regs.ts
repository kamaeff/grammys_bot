import {Context} from 'grammy';
import {backBtn} from '../utils/buttons';

const badWordsRegex = new RegExp(
  '(?<![а-яё])(?:(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\\S(?=[а-яё]))+?[оаеи-])-?)?(?:[её](?:б(?!о[рй]|рач)|п[уа](?:ц|тс))|и[пб][ае][тцд][ьъ]).*?|(?:(?:н[иеа]|ра[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч)-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|\\S*?(?:п(?:[иеё]зд|ид[аое]?р|ед(?:р(?!о)|[аое]р|ик)|охую)|бля(?:[дбц]|тс)|[ое]ху[яйиеё]|хуйн).*?|(?:о[тб]?|про|на|вы)?м(?:анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеи])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й))|елд[ауые].*?|ля[тд]ь|(?:[нз]а|по)х)(?![а-яё])',
  'i',
);

export const detectBadWords = async ({
  ctx,
  msg_id,
}: {
  ctx: Context;
  msg_id: number;
}) => {
  if (!ctx.msg || !ctx.msg.text || !ctx.chat?.id) return false;

  if (badWordsRegex.test(ctx.msg?.text)) {
    await ctx.api.deleteMessage(ctx.chat.id, msg_id - 1);
    await ctx.api.deleteMessage(ctx.chat.id, msg_id);
    return ctx.reply('👹 <b>Oi-Oi! Bad word!</b>', {
      parse_mode: 'HTML',
      reply_markup: backBtn,
    });
  }
};
