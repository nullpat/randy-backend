import FastLink from "@performanc/fastlink";
import { Client, GatewayIntentBits } from "discord.js";
import services from "../src/v1/services/services.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const prefix = process.env.PREFIX;
const botId = process.env.DISCORD_ID;

const events = FastLink.node.connectNodes(
  [
    {
      hostname: "127.0.0.1",
      secure: false,
      password: "youshallnotpass",
      port: 2333,
    },
  ],
  {
    botId,
    shards: 1,
    queue: true,
  }
);

events.on("debug", console.log);

client.on("raw", (data) => FastLink.other.handleRaw(data));

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const commandName = message.content
    .split(" ")[0]
    .toLowerCase()
    .substring(prefix.length);
  const args = message.content.split(" ").slice(1).join(" ");

  switch (commandName) {
    case "queue":
      const queue = await services.getQueue(message.guildId);
      message.channel.send(JSON.stringify(queue, null, 2));
      break;

    case "move":
      await services.joinChannel(
        message.guildId,
        message.member.voice.channel.id
      );
      break;

    case "play":
    case ">":
      // fastlink is very streamlined, not sure if this is possible, but if we can check if the player is paused, then we can add an if statement here to run the below line only if player state is paused and then ignoring load track WIP
      // player.update({ paused: false }), message.channel.send("Resumed.");
      await services.joinChannel(
        message.guildId,
        message.member.voice.channel.id
      );
      const play = await services.addSong(message.guildId, args);
      message.channel.send(play);
      break;

    case "pause":
      const pause = await services.pauseQueue(message.guildId);
      message.channel.send(pause);
      break;

    case "resume":
      const resume = await services.resumeQueue(message.guildId);
      message.channel.send(resume);
      break;

    case "clear":
      const clear = await services.clearQueue(message.guildId);
      message.channel.send(clear);
      break;

    case "skip":
      const skip = await services.skipSong(message.guildId);
      message.channel.send(skip);
      break;

    case "volume":
      const volume = await services.changeVolume(message.guildId, args); // add validation for args
      message.channel.send(volume);
      break;

    case "disconnect":
    case "destroy":
    case "stop":
      const destroy = await services.disconnectPlayer(message.guildId);
      message.channel.send(destroy);
      break;

    default:
      message.channel.send("Unknown command.");
      break;
  }
});

export { client };
