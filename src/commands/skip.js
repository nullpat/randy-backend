import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current song");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
