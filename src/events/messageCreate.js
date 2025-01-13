// import services from "../services/services.js";
// import logger from "../utils/logger.js";
// import { execute as queueCommand} from "../commands/queue.js";

const name = "messageCreate";
const runOnce = false;
const prefix = process.env.PREFIX;

async function execute(message) {
  console.log("REE")
  //   if (message.author.bot || !message.content.startsWith(prefix)) return;

  //   const commandName = message.content
  //     .split(" ")[0]
  //     .toLowerCase()
  //     .substring(prefix.length);
  //   const args = message.content.split(" ").slice(1).join(" ");
  
  //   switch (commandName) {
  //     case "q":
  //     case "queue":
  //       queueCommand(null, message, true)
  //       break;
  
  //     case "move":
  //     case "join":
  //       if (!message.member.voice.channel) {
  //         message.channel.send("You are not in a voice channel.");
  //         break;
  //       }
  //       try {
  //         const join = await services.joinChannel(
  //           message.guildId,
  //           message.member.voice.channel.id
  //         );
  //         message.channel.send(join);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "play":
  //     case "p":
  //     case ">":
  //       if (!message.member.voice.channel) {
  //         message.channel.send("You are not in a voice channel.");
  //         break;
  //       }
  //       try {
  //         const join = await services.joinChannel(
  //           message.guildId,
  //           message.member.voice.channel.id
  //         );
  //         const play = await services.addSong(message.guildId, args);
  //         message.channel.send(play);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "youtube":
  //     case "yt":
  //       if (!message.member.voice.channel) {
  //         message.channel.send("You are not in a voice channel.");
  //         break;
  //       }
  //       try {
  //         const join = await services.joinChannel(
  //           message.guildId,
  //           message.member.voice.channel.id
  //         );
  //         const play = await services.addSong(message.guildId, args, true);
  //         message.channel.send(play);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "pause":
  //       try {
  //         const pause = await services.pauseQueue(message.guildId);
  //         message.channel.send(pause);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "resume":
  //       try {
  //         const resume = await services.resumeQueue(message.guildId);
  //         message.channel.send(resume);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "clear":
  //       try {
  //         const clear = await services.clearQueue(message.guildId);
  //         message.channel.send(clear);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "skip":
  //       try {
  //         const skip = await services.skipSong(message.guildId);
  //         if (skip) message.channel.send("Skipped song.");
  //         else
  //           message.channel.send("Failed to skip song. Likely 1 song in queue.");
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "volume":
  //       try {
  //         const volume = await services.changeVolume(message.guildId, args); // add validation for args
  //         message.channel.send(volume);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     case "disconnect":
  //     case "destroy":
  //     case "stop":
  //       try {
  //         const destroy = await services.disconnectPlayer(message.guildId);
  //         message.channel.send(destroy);
  //       } catch (error) {
  //         logger.error(error.stack);
  //         message.channel.send(error.message);
  //       }
  //       break;
  
  //     default:
  //       message.channel.send("Unknown command.");
  //       break;
  //   }
}

export { name, runOnce, execute };
