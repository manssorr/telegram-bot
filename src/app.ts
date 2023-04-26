import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";

const bot: Telegraf<Context<Update>> = new Telegraf(
  process.env.BOT_TOKEN as string
);

bot.start((ctx) => ctx.reply("Welcome!"));

bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.launch();
