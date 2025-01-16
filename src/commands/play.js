import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { addSong, joinChannel, nowPlaying } from "../services/services.js";
import { isFirstStartEvent, toggleFirstStartFalse } from "../../index.js";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Adds a song to the queue, via URL or search")
  .addStringOption((option) => option.setName("song").setDescription("Enter song URL or search").setRequired(true));

async function execute(interaction, message, messageInput, isYT) {
  const songInput = message ? messageInput : interaction.options.getString("song");
  const guildId = message ? message.guildId : interaction.guildId;
  const channelId = message ? message.member.voice.channel?.id : interaction.member.voice.channel?.id;

  if (!channelId) {
    sendReply(interaction, message, "You are not in a voice channel.");
    return;
  }

  isYT = isYT ?? interaction.commandName === "youtube";

  try {
    const join = await joinChannel(guildId, channelId);
    const play = await addSong(guildId, songInput, isYT);
    sendReply(interaction, message, play);

    if (isFirstStartEvent) {
      toggleFirstStartFalse();
      nowPlaying(guildId);
    }
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
