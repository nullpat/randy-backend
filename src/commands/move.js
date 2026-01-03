import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { moveChannel } from "../services/services.js";

const data = new SlashCommandBuilder().setName("move").setDescription("Moves to your current voice channel");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;
  const channelId = message ? message.member.voice.channel?.id : interaction.member.voice.channel?.id;
  
  if (!channelId) {
    return await sendMessage(interaction, message, "You are not in a voice channel.");
  }

  try {
    const move = await moveChannel(guildId, channelId);
    await sendMessage(interaction, message, move);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
