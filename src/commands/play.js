import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { addSong, joinChannel, nowPlaying } from "../services/services.js";
import { isFirstStartEvent, toggleFirstStartFalse } from "../../index.js";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Adds a song to the queue, via URL or search (Shortcut is >> not >p because of pause command)")
  .addStringOption((option) => option.setName("song").setDescription("Enter song URL or search").setRequired(true));

async function execute(interaction, message, messageInput, isYT) {
  const songInput = message ? messageInput : interaction.options.getString("song");
  const guildId = message ? message.guildId : interaction.guildId;
  const channelId = message ? message.member.voice.channel?.id : interaction.member.voice.channel?.id;
  const undoButton = new ButtonBuilder().setCustomId("undo").setLabel("Undo").setStyle(ButtonStyle.Secondary);
  const row = isFirstStartEvent ? null : new ActionRowBuilder().addComponents(undoButton);

  if (!channelId) {
    sendMessage(interaction, message, "You are not in a voice channel.");
    return;
  }

  isYT = isYT ?? interaction.commandName === "youtube";

  try {
    const join = await joinChannel(guildId, channelId);
    const play = await addSong(guildId, songInput, isYT);
    sendMessage(interaction, message, play, row);

    if (isFirstStartEvent) {
      toggleFirstStartFalse();
      nowPlaying(guildId);
    }
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
}

export { data, execute };
