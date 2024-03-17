const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios');
const { setUserPhoto } = require('././../test-bot-tg/src/store/slices/formSlice'); // Импортируем экшн

const token = "YOUR_TELEGRAM_BOT_TOKEN";
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

// Функция обработки сообщения /start
const handleStartMessage = (msg) => {
  bot.sendMessage(msg.chat.id, "Ниже появится кнопка, заполните форму", {
    reply_markup: {
      keyboard: [[{ text: "Заполнить форму", web_app: { url: webAppUrl } }]],
    },
  });
};

// Функция обработки сообщения с фотографией
const handlePhotoMessage = async (msg, dispatch) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1];
  const photoId = photo.file_id;

  try {
    const fileInfo = await bot.getFile(photoId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;

    // Сохранение ссылки на фотографию в Redux
    dispatch(setUserPhoto(fileUrl));

    await bot.sendMessage(chatId, "Фотография успешно получена и сохранена в Redux!");
  } catch (err) {
    console.error("Ошибка получения информации о файле:", err);
    await bot.sendMessage(
      chatId,
      "Произошла ошибка при получении информации о фотографии."
    );
  }
};

// Обработчик сообщения /start
bot.onText(/\/start/, handleStartMessage);

// Обработчик сообщения с фотографией
bot.on("photo", (msg) => {
  const dispatch = msg.dispatch;
  handlePhotoMessage(msg, dispatch);
});
