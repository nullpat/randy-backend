import MusicBot from "./musicbot.js";

const bot = new MusicBot(process.env.DISCORD_ID, process.env.DISCORD_TOKEN);
bot.start();
