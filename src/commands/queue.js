import { SlashCommandBuilder } from "discord.js";
import services from "../services/services.js";
import logger from "../utils/logger.js";

const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Replies with the Queue");

async function execute(interaction, message, isMessage) {
  const guildId = isMessage ? message.guildId : interaction.guildId;

  function sendReply(args) {
    if (isMessage) {
      message.channel.send(args);
    } else {
      interaction.reply(args);
    }
  }
  
  try {
    const queue = await services.getQueue(guildId);
    sendReply(`\`\`\`json\n${JSON.stringify(queue, null, 2)}\n\`\`\``);
  } catch (error) {
    logger.error(error.stack);
    sendReply(error.message);
  }
}

export { data, execute };
