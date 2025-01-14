import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Sets the volume to a number out of 100");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
