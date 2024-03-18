// const TelegramBot = require("node-telegram-bot-api");
// const { useDispatch } = require("react-redux");


// const token = "7052992202:AAGTD6eOEU95USn7BkoXZmNTAM9Ij0-TmYM";
// const webAppUrl = "https://velvety-custard-289c52.netlify.app/";
// const bot = new TelegramBot(token, { polling: true });

// bot.onText(/\/start/, (msg) => {
//   bot.sendMessage(msg.chat.id, "Ниже появится кнопка, заполните форму", {
//     reply_markup: {
//       keyboard: [[{ text: "Заполнить форму", web_app: { url: webAppUrl } }]],
//     },
//   });
// });

// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;

//   if (msg?.web_app_data?.data) {
//     try {
//       const data = JSON.parse(msg?.web_app_data?.data);

//       await bot.sendMessage(chatId, "Спасибо за обратную связь!");
//       await bot.sendMessage(chatId, "Ваше имя: " + data?.userName);
//       await bot.sendMessage(chatId, "Ваш возраст: " + data?.userAge);
//       await bot.sendMessage(chatId, "Теперь, отправьте пожалуйста фотографию.");

//     } catch (e) {
//       console.log(e);
//     }
//   }
// });

// bot.on("photo", async (msg) => {
//   const chatId = msg.chat.id;

//   const photo = msg.photo[msg.photo.length - 1];
//   const photoId = photo.file_id;

//   try {
//     const fileInfo = await bot.getFile(photoId);

//     const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;

//     await bot.sendMessage(chatId, `Вы отправили фотографию: ${fileUrl}`);

//     await bot.sendMessage(chatId, "Фотография успешно получена и обработана!");
//   } catch (err) {
//     console.error("Ошибка получения информации о файле:", err);
//     await bot.sendMessage(
//       chatId,
//       "Произошла ошибка при получении информации о фотографии."
//     );
//   }
// });




const TelegramBot = require("node-telegram-bot-api");
const fetch = require('node-fetch'); // Подключаем библиотеку для выполнения HTTP запросов

const token = "YOUR_TELEGRAM_BOT_TOKEN_HERE";
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://velvety-custard-289c52.netlify.app/";

// Функция для отправки сообщения на сервер, взаимодействующий с API GPT
async function sendToGPTServer(message) {
  try {
    const response = await fetch('https://your-gpt-server.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response from GPT');
    }

    const data = await response.json();
    return data.response; // Предположим, что ответ от сервера GPT содержит только текстовый ответ
  } catch (error) {
    console.error('Error fetching response from GPT server:', error);
    return 'Произошла ошибка при обработке запроса';
  }
}

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

    } catch (e) {
      console.log(e);
    }
  } else {
    // Отправляем сообщение на сервер, взаимодействующий с API GPT
    const gptResponse = await sendToGPTServer(text);

    // Отправляем ответ от GPT пользователю
    await bot.sendMessage(chatId, gptResponse);
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;

  const photo = msg.photo[msg.photo.length - 1];
  const photoId = photo.file_id;

  try {
    const fileInfo = await bot.getFile(photoId);

    const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;

    await bot.sendMessage(chatId, `Вы отправили фотографию: ${fileUrl}`);

    await bot.sendMessage(chatId, "Фотография успешно получена и обработана!");
  } catch (err) {
    console.error("Ошибка получения информации о файле:", err);
    await bot.sendMessage(
      chatId,
      "Произошла ошибка при получении информации о фотографии."
    );
  }
});