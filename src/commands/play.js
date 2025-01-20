import FastLink from "@performanc/fastlink";
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage, editMessage } from "../helpers/helpers.js";
import { addSong, joinChannel, nowPlaying } from "../services/services.js";
import { isFirstStartEvent, toggleFirstStartFalse } from "../../index.js";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Adds a song to the queue, via URL or search (Shortcut is >> not >p because of pause command)")
  .addStringOption((option) => option.setName("song").setDescription("Enter song URL or search").setRequired(true));

const execute = async (interaction, message, messageInput, isYT) => {
  const songInput = message ? messageInput : interaction.options.getString("song");
  const guildId = message ? message.guildId : interaction.guildId;
  const channelId = message ? message.member.voice.channel?.id : interaction.member.voice.channel?.id;

  const undoButton = new ButtonBuilder().setCustomId("undo").setLabel("Undo").setStyle(ButtonStyle.Secondary);
  const actionRow = isFirstStartEvent ? null : new ActionRowBuilder().addComponents(undoButton);

  isYT = isYT ?? interaction.commandName === "youtube";

  try {
    const player = new FastLink.player.Player(guildId);
    if (!player.playerCreated()) {
      if (!channelId) {
        return await sendMessage(interaction, message, "You are not in a voice channel.");
      }
      await joinChannel(guildId, channelId);
    }
    const play = await addSong(guildId, songInput, isYT);
    const response = await sendMessage(interaction, message, play, actionRow);

    if (isFirstStartEvent) {
      nowPlaying(guildId, isFirstStartEvent);
      toggleFirstStartFalse();
    }

    setTimeout(() => {
      editMessage(interaction, response, play, null, "");
    }, 5000);
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
