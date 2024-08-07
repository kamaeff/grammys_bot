import {HydrateFlavor} from '@grammyjs/hydrate';
import {Context} from 'grammy';

export type MyContext = HydrateFlavor<Context>;

export type Command = {
  command: string;
  description: string;
};
