import { logger } from "../utils/logger.js";
import { sendMessage, editMessage, getComponent } from "../helpers/helpers.js";
import { checkLast, removeLast } from "../services/services.js";
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("undo")
  .setDescription("Removes the song most recently added to the queue");

const execute = async (interaction, message) => {
  const guildId = message?.guildId ?? interaction.guildId;
  const userId = message?.author?.id ?? interaction.user.id;
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("remove").setLabel("Remove").setStyle(ButtonStyle.Danger),
  );
  let response;

  try {
    const last = checkLast(guildId);
    response = await sendMessage(interaction, message, last, null, row, true);
    let confirmation;

    try {
      confirmation = await getComponent(response, (i) => i.user.id === userId, 15_000);
    } catch {
      await editMessage(interaction, response, "Undo confirmation not received", null, "");
    }

    if (confirmation.customId === "cancel") {
      await confirmation.update({
        content: "Undo cancelled",
        components: [],
      });
    }

    if (confirmation.customId === "remove") {
      const removeResultMsg = removeLast(guildId);
      await confirmation.update({
        content: removeResultMsg,
        components: [],
      });
    }

  } catch (error) {
    logger.error(error.stack);
    const content = process.env.NODE_ENV !== "production" ? error.message : "Internal Server Error";
    if (response) {
      await editMessage(interaction, response, content, null, "");
    } else {
      await sendMessage(interaction, message, content);
    }
  }
};

export { data, execute };
