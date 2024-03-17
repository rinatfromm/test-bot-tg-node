const TelegramBot = require("node-telegram-bot-api");

const token = "7052992202:AAGTD6eOEU95USn7BkoXZmNTAM9Ij0-TmYM";
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Я ваш Telegram-бот.');
});


bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        keyboard: [[{ text: "Заполнить форму", web_app: { url: webAppUrl } }]],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
     
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваше имя: " + data?.userName);
      await bot.sendMessage(chatId, "Ваш возраст: " + data?.userAge);

      await bot.sendMessage(chatId, "Отправте ваше фото");

      if (msg.photo) {
        // Получаем информацию о фотографии
        const photo = msg.photo[msg.photo.length - 1];
        const photoId = photo.file_id;
    
        // Запрашиваем информацию о фотографии
        bot.getFile(photoId).then((fileInfo) => {
          // Получаем ссылку на файл
          const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
          
          // Отправляем ссылку на изображение в чат
          bot.sendMessage(chatId, `Вы отправили фотографию: ${fileUrl}`);
        }).catch((err) => {
          console.error('Ошибка получения информации о файле:', err);
          bot.sendMessage(chatId, 'Произошла ошибка при получении информации о фотографии.');
        });
      }

      console.log(data);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});
