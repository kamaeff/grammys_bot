import {InlineKeyboard} from 'grammy';

export const backBtn = new InlineKeyboard().text('Back', 'back');

export const startBtns = new InlineKeyboard()
  .text('Login', 'login')
  .text('Register', 'reg');
