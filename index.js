const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios');
const { useDispatch } = require("react-redux");
const { setUserPhoto } = require('././../test-bot-tg/src/store/slices/formSlice'); // Импортируем экшн

const token = "7052992202:AAGTD6eOEU95USn7BkoXZmNTAM9Ij0-TmYM";
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Ниже появится кнопка, заполните форму", {
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
      await bot.sendMessage(chatId, "Ваш возраст: " + data?.userAge);
      await bot.sendMessage(chatId, "Теперь, отправьте пожалуйста фотографию.");

      // В этом месте мы просим пользователя отправить фото
    } catch (e) {
      console.log(e);
    }
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1];
  const photoId = photo.file_id;
  const dispatch = useDispatch(); // Помещаем хук внутрь функционального компонента

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
});


