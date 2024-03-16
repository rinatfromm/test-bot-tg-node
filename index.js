const TelegramBot = require("node-telegram-bot-api");

const token = "7052992202:AAGTD6eOEU95USn7BkoXZmNTAM9Ij0-TmYM";
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    // await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
    //   reply_markup: {
    //     inline_keyboard: [[{ text: "Заполнить форму", web_app: { url: webAppUrl } }]],
    //   },
    // });

    await bot.sendMessage(
      chatId,
      "Заходи в наш интернет магазин по кнопке ниже",
      {
        reply_markup: {
          keyboard: [
            [{ text: "Сделать заказ", web_app: { url: webAppUrl + "/card" } }],
          ],
        },
      }
    );
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваше имя: " + data?.userName);
      await bot.sendMessage(chatId, "Ваш возраст: " + data?.userAge);

    //   if (data.userFoto) {
    //     await bot.sendPhoto(chatId, data.userFoto);
    // }

      console.log(data);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});
