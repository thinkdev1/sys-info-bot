const TelegramBot = require('node-telegram-bot-api');
const os = require('os');

const token = 'token bot';

const adminChatIds = ['your id'];

const bot = new TelegramBot(token, { polling: true });

function isAdmin(userId) {
  return adminChatIds.includes(userId.toString());
}

bot.onText(/\/systeminfo/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (isAdmin(userId)) {
    const cpuInfo = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    const message = `
      CPU Load: ${cpuInfo.map((core) => core.times.user).join(', ')}
      Total Memory: ${(totalMemory / (1024 ** 3)).toFixed(2)} GB
      Used Memory: ${(usedMemory / (1024 ** 3)).toFixed(2)} GB
      Free Memory: ${(freeMemory / (1024 ** 3)).toFixed(2)} GB
    `;

    bot.sendMessage(chatId, message);
  } else {
    bot.sendMessage(chatId, 'У вас нет прав для выполнения этой команды.');
  }
});

bot.on('polling_error', (error) => {
  console.log(`Ошибка в опросе: ${error}`);
});
