const TelegramBot = require("node-telegram-bot-api");

const token = "7052992202:AAGTD6eOEU95USn7BkoXZmNTAM9Ij0-TmYM";
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Ниже появится кнопка, заполни форму", {
    reply_markup: {
      keyboard: [[{ text: "Заполнить форму", web_app: { url: webAppUrl } }]],
    },
  });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваше имя: " + data?.userName);
      await bot.sendMessage(chatId, "Ваш возраст: " + data?.userAge, {
        reply_markup: {
          keyboard: [[{ text: "Отправить фото" }]],
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;

  // Получаем информацию о фотографии
  const photo = msg.photo[msg.photo.length - 1];
  const photoId = photo.file_id;

  try {
    // Запрашиваем информацию о фотографии
    const fileInfo = await bot.getFile(photoId);

    // Получаем ссылку на файл
    const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;

    // Отправляем ссылку на изображение в чат
    await bot.sendMessage(chatId, `Вы отправили фотографию: ${fileUrl}`);

    // Здесь вы можете добавить код для сохранения ссылки на изображение
    // в базе данных или хранилище, если это необходимо.
    // Например, вы можете использовать эту ссылку для последующей обработки
    // или отображения в вашем приложении.

    // Вам также нужно будет отправить какое-то подтверждение пользователю о том,
    // что фотография успешно получена и обработана.
    await bot.sendMessage(chatId, "Фотография успешно получена и обработана!");
  } catch (err) {
    console.error("Ошибка получения информации о файле:", err);
    await bot.sendMessage(
      chatId,
      "Произошла ошибка при получении информации о фотографии."
    );
  }
});
