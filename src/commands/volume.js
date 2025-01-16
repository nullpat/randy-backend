import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { changeVolume } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Sets the volume to a number out of 100")
  .addNumberOption((option) =>
    option.setName("volume").setDescription("Sets the volume to a number out of 100").setRequired(true),
  );

async function execute(interaction, message, messageInput) {
  const volumeInput = message ? messageInput : interaction.options.getNumber("volume");
  const guildId = message ? message.guildId : interaction.guildId;

  if (!volumeInput || !(volumeInput >= 0 && volumeInput <= 100)) {
    sendReply(interaction, message, "Invalid input. Enter a number out of 100");
    return;
  }

  try {
    const volume = await changeVolume(guildId, volumeInput);
    sendReply(interaction, message, volume);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
