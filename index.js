const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5888076920:AAHb9FY04BGG39K9hGbLcvT7_p1w8VGu1BQ'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const start = () => {
bot.setMyCommands( [
    {command:'/start',description: 'Начальное приветствие'},
    {command:'/info', description:'Получить информацию о пользователе'},
    {command:'/game', description:'Игра угадай цифру'},
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен угадать!');
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber;
        await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);

}



bot.on("message", async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if (text === '/start') {
        await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/64a/12e/64a12e11-b501-3b30-820d-c75065df1367/4.webp`)
        return bot.sendMessage(chatId, "Добро пожаловать в мой уютный телеграмм канал")
    }
    if (text === '/info') {
        return bot.sendMessage(chatId, `Вас зовут ${msg.from.first_name} ${msg.from.last_name}` );
    }
    if (text === '/game') {
        return startGame(chatId);
        

    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!');
})
    
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage (chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage (chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()