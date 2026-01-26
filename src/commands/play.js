import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage, editMessage } from "../helpers/helpers.js";
import { addSong, joinChannel } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("result")
  .setDescription("Adds song to queue by URL or name (Shortcut is >> not >p because of pause command)")
  .addStringOption((option) => option.setName("song").setDescription("Enter song URL or name").setRequired(true));

UNDO_TIMEOUT = 5_000;

const execute = async (interaction, message, messageInput, youtubeFlag) => {
  const songInput = messageInput ?? interaction.options.getString("song");
  const guildId = message?.guildId ?? interaction.guildId;
  const voiceChannelId = message?.member.voice.channel?.id ?? interaction?.member.voice.channel?.id;
  const requester = message?.member ?? interaction.member;
  const isYoutubeSearch = youtubeFlag ?? interaction.commandName === "youtube";

  const undoButton = new ButtonBuilder().setCustomId("undo").setLabel("Undo").setStyle(ButtonStyle.Danger);
  const undoActionRow = new ActionRowBuilder().addComponents(undoButton);

  try {
    if (!songInput) {
      return await sendMessage(interaction, message, "Play command requires a URL or search term");
    }

    if (!voiceChannelId) {
      return await sendMessage(interaction, message, "You are not in a voice channel");
    }

    joinChannel(guildId, voiceChannelId, voiceChannelId);
    const result = await addSong(guildId, songInput, requester, isYoutubeSearch);
    const components = result.success ? undoActionRow : null;
    const response = await sendMessage(interaction, message, result.message, null, components);

    if (result.success)
      setTimeout(async () => {
        await editMessage(interaction, response, result.message, null, "");
      }, UNDO_TIMEOUT);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
