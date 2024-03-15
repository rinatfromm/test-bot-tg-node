const TelegramBot = require("node-telegram-bot-api");

const token = "7052992202:AAGTD6eOEU95USn7BkoXZmNTAM9Ij0-TmYM";
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка,заполни форму", {
      reply_markup: {
        keyboard: [
          [{ text: "заполнить форму", web_app: { url: webAppUrl  } }],
        ],
      },
    });
  }
  await bot.sendMessage(chatId, "Создай карту", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Ваша карточка", web_app: { url: webAppUrl + "/form"} }],
      ],
    },
  });

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваша страна: " + data?.userName);
      await bot.sendMessage(chatId, "Ваша улица: " + data?.userAge);

      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});
