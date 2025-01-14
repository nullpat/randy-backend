import { SlashCommandBuilder } from "discord.js";
import services from "../services/services.js";
import logger from "../utils/logger.js";

const data = new SlashCommandBuilder()
  .setName("join")
  .setDescription("Joins your voice channel");

async function execute(interaction, message, isMessage) {
  const guildId = isMessage ? message.guildId : interaction.guildId;
  const channelId = isMessage ? message.member.voice.channel.id : interaction.guildId;

  function sendReply(args) {
    if (isMessage) {
      message.channel.send(args);
    } else {
      interaction.reply(args);
    }
  }

  if (isMessage) {
    if (!message.member.voice.channel) {
      message.channel.send("You are not in a voice channel.");
      return;
    }
  }

  try {
    const join = await services.joinChannel(
      guildId,
      channelId
    );
    sendReply(join);
  } catch (error) {
    logger.error(error.stack);
    sendReply(error.message);
  }
}

export { data, execute };
