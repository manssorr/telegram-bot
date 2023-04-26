"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome!"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
//# sourceMappingURL=app.js.map