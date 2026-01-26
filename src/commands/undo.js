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

  const handleConfirmation = async (response, userId, guildId) => {
    try {
      const collectorFilter = (i) => i.user.id === userId;
      const confirmation = await getComponent(response, collectorFilter, 15_000);
      if (confirmation.customId === "remove") {
        const remove = removeLast(guildId);
        await confirmation.update({
          content: remove,
          components: [],
        });
      } else if (confirmation.customId === "cancel") {
        await confirmation.update({ content: "Undo cancelled.", components: [] });
      }
    } catch {
      await editMessage(interaction, response, "Undo confirmation not received.", null, "");
    }
  };

  try {
    const last = await checkLast(guildId);
    if (!last) {
      return await sendMessage(interaction, message, "Queue is already empty");
    }

    const response = await sendMessage(interaction, message, last, null, row, true);
    await handleConfirmation(response, userId, guildId);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
