import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import birthdayList from "../../dummybirthdays.js";

const data = new SlashCommandBuilder().setName("birthday").setDescription("Displays a list of birthdays");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;

  try {

    if (!birthdayList) throw new Error("No birthday list found");
    const guildBirthdayList = birthdayList.filter((user) => user.serverId === guildId);

    const guildBirthdayString = guildBirthdayList
      .map((birthdayPerson) => `${birthdayPerson.name.padEnd(20)} - ${birthdayPerson.month}/${birthdayPerson.day}`)
      .join("\n");

    const formattedMessage = [
      "```",
      "List of Birthdays",
      "─".repeat(17),
      guildBirthdayString,
      "```",
    ].join("\n");

    await sendMessage(interaction, message, formattedMessage);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
