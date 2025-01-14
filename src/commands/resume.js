import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resumes song playback");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
