"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
require("dotenv").config();
// Get your bot token from the environment variables.
const BOT_TOKEN = process.env.BOT_TOKEN || "";
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot(BOT_TOKEN); // <-- put your bot token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("help", (ctx) => ctx.reply("Help!"));
// Handle other messages.
bot.on("message", (ctx) => {
    // try {
    const chatId = ctx.message.chat.id;
    const msgId = ctx.message.message_id;
    const text = ctx.message.text;
    let username = ctx.message.from.username;
    // if username is undefined, use first_name
    if (username === undefined) {
        username = ctx.message.from.first_name;
    }
    // use regex to clean username of special characters
    username = username.replace(/[^a-zA-Z0-9]/g, "");
    // templates for sending messages
    const textToSend = `You said: ${text} and your username is ${username}`;
    const markdownToSend = `You said: *${text}* and your username is ${username}`;
    ctx.reply(markdownToSend, {
        reply_to_message_id: msgId,
        parse_mode: "MarkdownV2",
    });
});
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start();
//# sourceMappingURL=index.js.map