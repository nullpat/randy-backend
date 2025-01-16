import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { joinChannel } from "../services/services.js";

const data = new SlashCommandBuilder().setName("move").setDescription("Moves to your current voice channel");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;
  const channelId = message ? message.member.voice.channel.id : interaction.member.voice.channel.id;

  if (!channelId) {
    sendReply(interaction, message, "You are not in a voice channel.");
    return;
  }

  try {
    const join = await joinChannel(guildId, channelId);
    sendReply(interaction, message, join);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
