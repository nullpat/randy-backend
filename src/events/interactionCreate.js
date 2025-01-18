import { MessageFlags } from "discord.js";
import { logger } from "../utils/logger.js";
import { removeLast } from "../services/services.js";
import { sendMessage } from "../helpers/helpers.js";

const name = "interactionCreate";
const runOnce = false;

async function execute(interaction) {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error.stack);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: error.message,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: error.message,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  } else if (interaction.isButton()) {
    switch (interaction.customId) {
      case "queue":
        try {
          const queueCommand = interaction.client.commands.get("queue");
          await queueCommand.execute(interaction);
        } catch (error) {
          logger.error(error.stack);
        }
        break;

      case "hjelp":
        try {
          const hjelpCommand = interaction.client.commands.get("hjelp");
          await hjelpCommand.execute(interaction);
        } catch (error) {
          logger.error(error.stack);
        }
        break;

      case "undo":
        try {
          const undoCommand = interaction.client.commands.get("undo");
          await undoCommand.execute(interaction);
        } catch (error) {
          logger.error(error.stack);
        }
        break;

      // case "cancel":
      //   try {
      //     interaction.deferUpdate();
      //   } catch (error) {
      //     logger.error(error.stack);
      //   }
      //   break;

      // case "remove":
      //   try {
      //     const remove = await removeLast(interaction.guildId);
      //     console.log(remove);
      //     // sendMessage(interaction, null, remove, null);
      //     const collectorFilter = m => m.content.includes('discord');
      //     const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 15_000 });
          
      //     collector.on('collect', m => {
      //       console.log(`Collected ${m.content}`);
      //     });
          
      //     collector.on('end', collected => {
      //       console.log(`Collected ${collected.size} items`);
      //     });
      //   } catch (error) {
      //     logger.error(error.stack);
      //   }
      //   break;

      default:
        break;
    }
  } else {
    return;
  }
}

export { name, runOnce, execute };
