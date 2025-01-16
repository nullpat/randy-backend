import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { client } from "../musicbot.js";

const data = new SlashCommandBuilder().setName("hjelp").setDescription("Displays a list of commands");

async function execute(interaction, message) {
  const hjelp = client.commands;
  const prettyHjelp = hjelp.map((command) => ({
    command: command.data.name,
    description: command.data.description,
  }));
  try {
    const prettierHjelp = JSON.stringify(prettyHjelp, null, 2);
    const formattedHjelp = `\`\`\`fix\nUse any command like >play or /skip or its first letter like >q or /l\n\`\`\`\`\`\`json\n${prettierHjelp}\n\`\`\``;
    sendReply(interaction, message, formattedHjelp);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
