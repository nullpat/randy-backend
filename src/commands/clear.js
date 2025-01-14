import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clears the song queue");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
