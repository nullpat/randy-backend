import { execute as queueCommand } from "../commands/queue.js";
import { execute as moveCommand } from "../commands/move.js";
import { execute as playCommand } from "../commands/play.js";
import { execute as pauseCommand } from "../commands/pause.js";
import { execute as resumeCommand } from "../commands/resume.js";
import { execute as clearCommand } from "../commands/clear.js";
import { execute as skipCommand } from "../commands/skip.js";
import { execute as volumeCommand } from "../commands/volume.js";
import { execute as leaveCommand } from "../commands/leave.js";
import { execute as hjelpCommand } from "../commands/hjelp.js";
import { execute as undoCommand } from "../commands/undo.js";
import { logger } from "../utils/logger.js";

const name = "messageCreate";
const runOnce = false;
const prefix = process.env.PREFIX;

const execute = async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const trimmedContent = message.content.substring(prefix.length).trimStart();
  const commandName = trimmedContent.split(" ")[0].toLowerCase();
  const messageInput = trimmedContent.split(" ").slice(1).join(" ");

  switch (commandName) {
    case "q":
    case "queue":
      queueCommand(null, message);
      break;

    case "j":
    case "m":
    case "join":
    case "move":
      moveCommand(null, message);
      break;

    case ">":
    case "play":
      playCommand(null, message, messageInput, false);
      break;

    case "y":
    case "yt":
    case "youtube":
      playCommand(null, message, messageInput, true);
      break;

    case "p":
    case "pause":
      pauseCommand(null, message);
      break;

    case "r":
    case "resume":
      resumeCommand(null, message);
      break;

    case "c":
    case "clear":
      clearCommand(null, message);
      break;

    case "n":
    case "s":
    case "next":
    case "skip":
      skipCommand(null, message);
      break;

    case "v":
    case "volume":
      volumeCommand(null, message, messageInput);
      break;

    case "h":
    case "help":
    case "hjelp":
      hjelpCommand(null, message, messageInput);
      break;

    case "u":
    case "undo":
      undoCommand(null, message);
      break;

    case "d":
    case "l":
    case "e":
    case "disconnect":
    case "destroy":
    case "stop":
    case "exit":
    case "end":
    case "leave":
      leaveCommand(null, message);
      break;

    default:
      message.channel.send(
        "Unknown command. You probably forgot the space between the command and the search term. Or you typo'd. Or both. Yeah you'd do that wouldn't you..",
      );
      logger.warn("Unknown command, or one people organically want to use: " + commandName);

      break;
  }
};

export { name, runOnce, execute };
