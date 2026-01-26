import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage, editMessage } from "../helpers/helpers.js";
import { addSong, joinChannel } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Adds song to queue by URL or name (Shortcut is >> not >p because of pause command)")
  .addStringOption((option) => option.setName("song").setDescription("Enter song URL or name").setRequired(true));

const execute = async (interaction, message, messageInput, youtubeFlag) => {
  const songInput = messageInput ?? interaction.options.getString("song");
  const guildId = message?.guildId ?? interaction.guildId;
  const channelId = message?.member.voice.channel?.id ?? interaction?.member.voice.channel?.id;
  const requesterId = message?.member ?? interaction.member;
  const youtubeSearch = youtubeFlag ?? interaction.commandName === "youtube";

  const undoButton = new ButtonBuilder().setCustomId("undo").setLabel("Undo").setStyle(ButtonStyle.Danger);
  const actionRow = new ActionRowBuilder().addComponents(undoButton);

  try {

    if (!songInput) {
      return await sendMessage(interaction, message, "Play command is missing a URL or search term");
    }

    if (!channelId) {
      return await sendMessage(interaction, message, "You are not in a voice channel");
    }

    joinChannel(guildId, channelId, channelId);
    const play = await addSong(guildId, songInput, requesterId, youtubeSearch);
    const actionRowVisible = play.success ? actionRow : null;
    const response = await sendMessage(interaction, message, play.message, null, actionRowVisible);

    if ( play.success ) setTimeout(async () => {
      await editMessage(interaction, response, play.message, null, "");
    }, 5000);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
