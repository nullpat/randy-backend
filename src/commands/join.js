import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { joinChannel } from "../services/services.js";

const data = new SlashCommandBuilder().setName("join").setDescription("Joins your voice channel");

async function execute(interaction, message, isMessage) {
  const guildId = isMessage ? message.guildId : interaction.guildId;
  const channelId = isMessage ? message.member.voice.channel.id : interaction.member.voice.channel.id;

  if (!channelId) {
    sendReply(interaction, message, isMessage, "You are not in a voice channel.");
    return;
  }

  try {
    const join = await joinChannel(guildId, channelId);
    sendReply(interaction, message, isMessage, join);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, isMessage, error.message);
  }
}

export { data, execute };
