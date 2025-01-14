import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Adds a song to the queue, via url or search");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
