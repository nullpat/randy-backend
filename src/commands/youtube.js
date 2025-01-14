import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("youtube")
  .setDescription("Adds a song to the queue, via YouTube search");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
