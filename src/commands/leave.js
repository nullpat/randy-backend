import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leaves the current voice channel and ends song playback");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
