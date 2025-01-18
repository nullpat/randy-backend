import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { getCommands } from "../services/services.js";

const data = new SlashCommandBuilder().setName("hjelp").setDescription("Displays a list of commands");

async function execute(interaction, message) {
  try {
    const hjelp = getCommands();
    const prettierHjelp = JSON.stringify(hjelp, null, 2);
    const formattedHjelp = `\`\`\`fix\nUse any command like >play or /skip or its first letter like >q or /l\n\`\`\`\`\`\`json\n${prettierHjelp}\n\`\`\``;
    sendMessage(interaction, message, formattedHjelp);
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
}

export { data, execute };
