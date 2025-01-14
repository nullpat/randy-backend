import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pauses song playback");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
