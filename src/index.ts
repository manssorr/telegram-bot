require("dotenv").config();
import axios from "axios";
import * as bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";

const { BOT_TOKEN, SERVER_URL } = process.env;

const TELEGRAM_API: string = `https://api.telegram.org/bot${BOT_TOKEN}`;
const URI: string = `/webhook/${BOT_TOKEN}`;
const WEBHOOK_URL: string = SERVER_URL + URI;

const app: Express = express();
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post(URI, async (req: Request, res: Response) => {
  console.log(req.body);

  const chatId = req.body.message.chat.id;
  const text = req.body.message.text;

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: text,
  });
  return res.send();
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("🚀 app running on port", process.env.PORT || 5000);
  await init();
});
