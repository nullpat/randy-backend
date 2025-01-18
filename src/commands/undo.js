import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage, editMessage, getComponent } from "../helpers/helpers.js";
import { checkLast, removeLast } from "../services/services.js";
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("undo")
  .setDescription("Removes the last queued song");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;
  const userId = message ? message.author.id : interaction.user.id;
  const cancelButton = new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Primary);
  const removeButton = new ButtonBuilder().setCustomId("remove").setLabel("Remove").setStyle(ButtonStyle.Danger);
  const row = new ActionRowBuilder().addComponents(cancelButton, removeButton);

  const last = await checkLast(guildId);
  if (!last) {
    sendMessage(interaction, message, "Queue is already empty");
  } else
    try {
      const response = await sendMessage(interaction, message, last, row, true);
      try {
        const collectorFilter = (i) => i.user.id === userId;
        const confirmation = await getComponent(response, collectorFilter, 15_000);
        if (confirmation.customId === "remove") {
          const remove = await removeLast(guildId);
          await confirmation.update({
            content: remove,
            components: [],
          });
        } else if (confirmation.customId === "cancel") {
          await confirmation.update({ content: "Action aborted.", components: [] });
        }
      } catch {
        editMessage(interaction, response, "Undo confirmation not received.", "");
      }
    } catch (error) {
      logger.error(error.stack);
      sendMessage(interaction, message, error.message);
    }
}

export { data, execute };
