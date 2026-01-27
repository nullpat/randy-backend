import { logger } from "../utils/logger.js";
import { sendMessage, editMessage, getComponent } from "../helpers/helpers.js";
import { checkLast, removeLast } from "../services/services.js";
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("undo")
  .setDescription("Removes the song most recently added to the queue");

const execute = async (interaction, message) => {
  const guildId = message?.guildId ?? interaction.guildId;
  const userId = message?.author.id ?? interaction.user.id;
  const cancelButton = new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Primary);
  const removeButton = new ButtonBuilder().setCustomId("remove").setLabel("Remove").setStyle(ButtonStyle.Danger);
  const row = new ActionRowBuilder().addComponents(cancelButton, removeButton);
  let confirmation;

  const handleConfirmation = async (interaction, response, userId, guildId) => {
    const collectorFilter = (i) => i.user.id === userId;

    try {
      confirmation = await getComponent(response, collectorFilter, 15_000);
    } catch {
      await editMessage(interaction, response, "Undo confirmation not received", null, "");
    }

    if (confirmation.customId === "remove") {
      const removeResultMsg = removeLast(guildId);

      await confirmation.update({ content: removeResultMsg, components: [] });
    } else if (confirmation.customId === "cancel") {
      await confirmation.update({ content: "Undo cancelled", components: [] });
    }
  };

  try {
    const last = checkLast(guildId);
    const response = await sendMessage(interaction, message, last, null, row, true);
    await handleConfirmation(interaction, response, userId, guildId);
  } catch (error) {
    logger.error(error.stack);
    await confirmation.update({
      content: process.env.NODE_ENV !== "production" ? error.message : "Internal Server Error",
      components: [],
    });
  }
};

export { data, execute };
