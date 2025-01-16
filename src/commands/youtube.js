import { SlashCommandBuilder } from "discord.js";
import { execute } from "../commands/play.js";

const data = new SlashCommandBuilder()
  .setName("youtube")
  .setDescription("Adds a song to the queue, via YouTube search")
  .addStringOption((option) => option.setName("song").setDescription("Enter song URL or search").setRequired(true));

export { data, execute };
