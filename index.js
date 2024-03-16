bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
      await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
          reply_markup: {
              inline_keyboard: [[{ text: "Заполнить форму", callback_data: "fill_form" }]],
          },
      });
  }

  if (msg?.web_app_data?.data) {
      try {
          const data = JSON.parse(msg?.web_app_data?.data);
          console.log(data);
          await bot.sendMessage(chatId, "Спасибо за обратную связь!");
          await bot.sendMessage(chatId, "Ваше имя: " + data?.userName);
          await bot.sendMessage(chatId, "Ваш возраст: " + data?.userAge);

          console.log(data);
          setTimeout(async () => {
              await bot.sendMessage(chatId, "Вся информация будет отправлена в этом чате");
          }, 3000);
      } catch (e) {
          console.log(e);
      }
  }

  if (msg?.data === "fill_form") {
      await bot.sendMessage(chatId, "Пожалуйста, заполните форму");
  }
});