import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { getQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("queue").setDescription("Replies with the song queue");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  const confirm = new ButtonBuilder().setCustomId("confirm").setLabel("Confirm Ban").setStyle(ButtonStyle.Danger);

  const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(cancel, confirm);

  try {
    const queue = await getQueue(guildId);
    const prettyQueue = queue.map((song) => ({
      title: song.info.title,
      author: song.info.author,
      album: song.pluginInfo?.albumName,
    }));
    sendReply(interaction, message, `\`\`\`json\n${JSON.stringify(prettyQueue, null, 2)}\n\`\`\``, row);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }




  // await interaction.reply({
  //   content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
  //   components: [row],
  // });
}

export { data, execute };
