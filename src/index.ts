import {
  autoChatAction,
  AutoChatActionFlavor,
} from "@grammyjs/auto-chat-action";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { Bot, Context, webhookCallback } from "grammy";
import fetch from "node-fetch";
import translate from "translate";

(globalThis as any).fetch = fetch;

dotenv.config();

// Get your bot token from the environment variables.
const BOT_TOKEN: string = process.env.BOT_TOKEN || "";

// Create an instance of the `Bot` class and pass your bot token to it.
type MyContext = Context & AutoChatActionFlavor;
const bot = new Bot<MyContext>(BOT_TOKEN); // <-- put your bot token between the ""

// get / hello world
bot.command("hello", async (ctx) => {
  await ctx.reply("Hello World");
});

// install plugins

// auto chat action plugin
bot.use(autoChatAction());

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// helper function
function wait(sec: number, callback: Function): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      callback();
    }, sec * 1000);
  });
}

function sleeper(sec: number) {
  return function () {
    return new Promise<void>((resolve) =>
      setTimeout(() => resolve(), sec * 1000)
    );
  };
}

async function getIntoAr(text: string): Promise<string> {
  const translated = await translate(text, {
    from: "en",
    to: "ar",
    engine: "google",
  });

  return translated;
}

function getRandomOfArray(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function optimizeName(
  firstName: string,
  lastName: string | undefined,
  username: string | undefined
): Promise<string> {
  let optimizedName: string =
    firstName.length > 3 ? firstName : username || "unknown";

  console.log(
    `🌹  > file: index.ts:70 > firstName.length < 3`,
    firstName.length < 3
  );
  console.log(`🌹  > file: index.ts:70 > username`, username);

  console.log(`🌹  > file: index.ts:44 > optimizedName`, optimizedName);
  // use regex to clean username of special characters keep only letters and dots
  optimizedName = optimizedName.replace(/[^a-zA-Z.]/g, "");

  // if username has . split it and use the first part
  if (optimizedName.includes(".")) {
    optimizedName = optimizedName.split(".")[0];
  }

  // translate username to arabic
  try {
    let translatedUsername = await getIntoAr(optimizedName);

    if (lastName && lastName.length > 3) {
      translatedUsername += ` بن ${await getIntoAr(lastName)}`;
    }

    return translatedUsername;
  } catch (error) {
    console.log(error);

    return optimizedName;
  }
}

const arabicGreetings: string[] = [
  "مرحبا",
  "السلام عليكم",
  "أهلا وسهلا",
  "صباح الخير",
  "مساء الخير",
  "تحية طيبة",
  "مساء النور",
  "يا هلا",
  "ألو",
  "مرحبتين",
];

const poems: string[] = [
  "قالوا انت الحب والحب مالي وهمومي التي تشغل بالي - أبو فراس الحمداني",
  "إن الذي يحب يُصنع له محبوبٌ وقد يجعل الله في المحبة رزقاً - ابن حزم",
  "ما يُرَاعِي النَّاسُ في الأخِلاقِ إِلاَّ مَصَالِحَهُمْ - الجاحظ",
  "يا عاشقينَ، وَجَدْتُمُ الحَبَّ فَاعْتَنُوا بهِ، فَإِذَا ذَهَبَ طَرَفُ الْوَرَى هَلَكَ الْمُعَنَّى - الشريف الرضي",
  "هَلْ تُرَاهُمْ يَرْعَى الدِّينَ وَهُمْ يَسْتَبِيحُونَ الأَكْبَا - المتنبي",
  "إذا تَعَلَّمْتَ الصَّبرَ جَعَلْتَهُ رَدِيفَ الْفَرَحِ - الجاحظ",
  "لا يَحْزُنْكَ إِنَّكَ فَقِيرٌ فَالدُّنْيَا مَتَاعٌ وَالْمَوْتُ بَابٌ - ابن الفارض",
  "يَا مَنْ يَشْكُو الْفَقْرَ وَالْحَاجَةَ، عِنْدَهُمْ أَعْوَجٌ وَعِنَادُ - الشافعي",
  "مَنْ طَلَبَ الْعِلْمَ بِغَيْرِ طَلَبٍ، فَهُوَ كَمَنْ يُرِيدُ الْحَلَا وَهُوَ فِي ظُلْمَةٍ - الغزالي",
  "أَيُّهَا الْمَوْلاَى يا مَنْ نَادَيْتُهُ، كُنْ مَوْلاَيَ فَإِنَّنِي مَوْلاَكَ - الإمام الشافعي",
  "ويحك يا بابل، أنتِ تعتبرين نفسك ملكةً، وأنتِ للحبِّ رقيقة - المتنبي",
  "فَلَيْسَ لِلعَاشِقِينَ مَكَانٌ سِوَى الْمَعْشَرِ، حَتَّى يُرْفَعَ الْحَظُّ عَنْ كُلِّ اسْتِحْقَاقٍ - ابن حزم",
  "ومن شرفته الدنيا فلا تحملنها، فما أشرف النفس إلا عند الفناء - البوصيري",
  "في الحياةِ أَمْرانِ يُحْزِنُني، أَنَّ النَّاسَ يَبْغِينَ الْمَالَ وَالْمَكَانَ، وَيَتْرُكُونَ الْأَخْلاقَ وَالْوَصْلَ - الجاحظ",
  "إِذَا مَا ضَاقَتِ الْأَرْضُ بِمَا رَحُبَتْ، فَلَيْسَ ذَنْبٌ إِلاَّ الْعَيْنُ الْبَخِيلَة - ابن الفارض",
  "يا أيها الناس، لا تحزنوا على ما فات، ولا تأسوا من غدٍ لم يأتِ بعد - المتنبي",
  "لا تأسَفْنَّ عَلى غَدٍ يَأْتِي بِرَبٍّ كَرِيمٍ، وَلا تَحْزَنْ عَلى مَا فَاتَكَ مِنْ دُنْيَاكَ، فَاللهُ أَحْوَى بِمَا أَخَذَ وَأَعْطَى - مجهول",
  "صَفَوَةُ الأَيَّامِ أَحْسَنُهَا يَوْمُ تَحْتَ الثَّرَى، وَمَا أَحْلَى الدُّنْيَا إِلاَّ سَاعَةً فِيهَا صَلَاحٌ وَتَقَى - البوصيري",
  "مَنْ زَرَعَ الْأَشْوَاقَ لَمْ يَحْصُدِ السَّعَادَةَ، وَمَنْ أَرَادَ الْمَحَبَّةَ لَمْ يَلْقَ الْوَفَاءَ - مجهول",
  "مَنْ لَمْ يَرَ الْمَوْتَ فَلْيَنْظُرْ إِلَى الأَيَّامِ الْمُنْسَدِلَةِ، فَإِنَّ الْأَيَّامَ كُلُّهَا أَمْوَاجٌ تَجْرِي، وَالْحَيَاةُ نَفَحَةٌ وَالْمَوْتُ غَيْمَةٌ تَمُرُّ - مجهول",
  "الدُّنْيَا سَرَابٌ وَمَا عَلَى السَّرَابِ إِلاَّ الإِنْصَاتُ، وَالصَّبْرُ عَلَى الْمَصَائِبِ، وَالتَّوَكُّلُ عَلَى اللهِ - مجهول",
  "تَرْكُ الدُّنْيَا فَاسِحٌ، وَالمَوْتُ قَاصِرٌ، وَالمُحِبُّ إِمَّا شَاكِرٌ أَوْ نَادِمٌ - المعري",
  "لا تسألني عن حالي فحالي يرثي الأحباب - أبو نواس",
  "طوبى لِمَنْ كَانَ لَهُ قَلْبٌ وَعَمَلَ بِهِ - أبو العتاهية",
  "إذا المرء لم يدنس من اللؤم عرضه فكل رداء يرتديه جميل - المتنبي",
  "أنا امرؤٌ لا تهوى له نفسه عيشاً إلا عزيز وإن طال البعد يصل - جرير",
  "الماء ينساب والحجر يحترق والحرية لا تُهْدى ولا تُباع - نزار قباني",
  "ابتسم فحياتك قصيرةٌ، فلا تُخلّفها أشياء تُؤلمك - محمود درويش",
  "قد يُغلقُ البابُ في وجهك، ولكنَّ النوافذَ ما زالتْ مفتوحة - جلال الدين الرومي",
  "اطمئن فإن الله أكبر من همومك وأحزانك، وأشد قوةً من أعدائك - الشافعي",
  "المجد يكتسب بالأفعال، وليس بالأقوال - جابر بن حيان",
  "العقل زينة الرجال، والجهل زينة الأحمق - المتنبي",
  "تعلم فنون الحياة، فالعيشُ على الأرض مُجَازٌ، والقلب بلا فنونٍ كالحجر مكتوف - عمر الخيام",
  "اليد التي تعطي غير مرتبكة، والعين التي تريد تعويضاً صافية - صلاح عبد الصبور",
  "إذا أردتَ أن تعيشَ سعيداً فلا تحاول أن تجعلَ الآخرينَ يشعرون بالسعادةِ، بل اجعل نفسكَ تشعرُ بالسعادةِ واجعل الآخرينَ يشاركونَك فيها - أوسكار وايلد",
  "الحياةُ مثلُ الكاميرا، اضبط الفوكس فيما تريد تصويره، وابحث عن الجمال في الزوايا الصعبة - مجهول",
  "علمتني الحياة أن أحترم الأخرين، وأن أحتويَّ الجروحَ وأن أقدَّر الأشياء الصغيرة - مجهول",
  "السعادة تأتي من الداخل، ولا يمكن لأحد أن يعطيها لك - رالف والدو إيمرسون",
  "الإنسان سيءٌ، لكنَّ الله خيرٌ من يظنون - صلاح الدين الأيوبي",
  "دع الأمسَ يكن وخذ اليومَ في عينيك، والغدَ غدٌ مجهولٌ فلا تضيع اليومَ بالأمسِ - مجهول",
  "الحياة لا تعطينا ما تريده، ولكنها تعطيك ما تحتاج إليه - مجهول",
];

// Handle the /start command.
bot.command("start", (ctx) => {
  const randomPoem = getRandomOfArray(poems);

  ctx.reply("مَرحى! أنا بوت الشعر العربي الأول على التليجرام 🌹").then(() => {
    wait(1, () => (ctx.chatAction = "typing"))
      .then(() => wait(2, () => ctx.reply(randomPoem)))
      .then(() => wait(3, () => ctx.reply("أمزح معك 😂 أرسِل لي رسالةً ما!")))
      .finally(() => (ctx.chatAction = null));
  });
});

bot.command("help", (ctx) => ctx.reply("Help!"));

// Handle other messages.
bot.on("message", async (ctx) => {
  const randomGreeting = getRandomOfArray(arabicGreetings);

  // get message info
  const chatId = ctx.message.chat.id;
  const msgId: number = ctx.message.message_id;
  const text = ctx.message.text;
  let username = ctx.message.from.username;
  const firstName = ctx.message.from.first_name;
  const lastName = ctx.message.from.last_name;
  console.log(`${username}: `, text);

  // optimize username
  username = await optimizeName(firstName, lastName, username);

  // templates for sending messages
  const welcomeMessage = `${randomGreeting} ${username} 👋🏼`;
  const textToSend = `لقد قُلتَ لِتَوك: ${text}`;

  // send chat action

  ctx.reply(welcomeMessage, {
    reply_to_message_id: msgId,
  });

  ctx.chatAction = "typing";
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // ctx.chatAction = "typing";
  ctx.reply(textToSend);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  ctx.reply("لا تنسَ أن تُرسِلَ لي رسالةً ما!");

  ctx.chatAction = "typing";
  await new Promise((resolve) => setTimeout(resolve, 3000));
  ctx.reply(
    `إليك هذه القصيدة يا عزيزي ${username}، لانك من المميزين 😍 
      
      ${getRandomOfArray(poems)}`
  );

  await new Promise((resolve) => setTimeout(resolve, 2000));
  ctx.reply("عاود الإرسال لا تنساني :'( ");
  // ctx.chatAction = null;
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app: Express = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 5000;

  app.get("/", (req: Request, res: Response) => {
    res.send("https://t.me/man_ssorr");
  });

  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
