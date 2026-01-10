import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { changeVolume } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Sets the volume to a number out of 200")
  .addNumberOption((option) =>
    option.setName("volume").setDescription("Sets the volume to a number out of 200").setRequired(true),
  );

const execute = async (interaction, message, messageInput) => {
  const volumeInput = messageInput ?? interaction.options.getNumber("volume");
  const guildId = message?.guildId ?? interaction.guildId;
  const volumeInt = Number(volumeInput);

  if (!volumeInt || !Number.isInteger(volumeInt) || volumeInt < 0 || volumeInt > 200) {
    return await sendMessage(interaction, message, "Invalid input. Enter a whole number between 0 and 200");
  }

  try {
    const volume = await changeVolume(guildId, volumeInput);
    await sendMessage(interaction, message, volume);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
