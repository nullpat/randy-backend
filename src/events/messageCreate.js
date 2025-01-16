import { execute as queueCommand } from "../commands/queue.js";
import { execute as joinCommand } from "../commands/join.js";
import { execute as playCommand } from "../commands/play.js";
import { execute as pauseCommand } from "../commands/pause.js";
import { execute as resumeCommand } from "../commands/resume.js";
import { execute as clearCommand } from "../commands/clear.js";
import { execute as skipCommand } from "../commands/skip.js";
import { execute as volumeCommand } from "../commands/volume.js";
import { execute as leaveCommand } from "../commands/leave.js";
import { logger } from "../utils/logger.js";

const name = "messageCreate";
const runOnce = false;
const prefix = process.env.PREFIX;

async function execute(message) {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const commandName = message.content.split(" ")[0].toLowerCase().substring(prefix.length);
  const messageInput = message.content.split(" ").slice(1).join(" ");

  switch (commandName) {
    case "q":
    case "queue":
      queueCommand(null, message, true);
      break;

    case "m":
    case "j":
    case "move":
    case "join":
      joinCommand(null, message, true);
      break;

    case ">":
    case "play":
      playCommand(null, message, true, messageInput, false);
      break;

    case "y":
    case "yt":
    case "youtube":
      playCommand(null, message, true, messageInput, true);
      break;

    case "p":
    case "pause":
      pauseCommand(null, message, true);
      break;

    case "r":
    case "resume":
      resumeCommand(null, message, true);
      break;

    case "c":
    case "clear":
      clearCommand(null, message, true);
      break;

    case "n":
    case "s":
    case "next":
    case "skip":
      skipCommand(null, message, true);
      break;

    case "v":
    case "volume":
      volumeCommand(null, message, true, messageInput);
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
      leaveCommand(null, message, true);
      break;

    default:
      message.channel.send(
        "Unknown command. You almost certainly forgot the space between the command and the search term. Or you typo'd. Or both.",
      );
      logger.warn("Unknown command, or one people organically want to use: " + commandName);

      break;
  }
}

export { name, runOnce, execute };
