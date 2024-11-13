import FastLink from "@performanc/fastlink";
import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import router from "./src/v1/routes/routes.js";

class MusicBot {
  constructor(botId, token) {
    this.botId = botId;
    this.token = token;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.app = express();
    this._setupRoutes();
    this.prefix = "!";
    this.client.on("messageCreate", this._onMessage.bind(this));
    this.client.on("raw", (data) => FastLink.other.handleRaw(data));
    this.events = FastLink.node.connectNodes(
      [
        {
          hostname: "127.0.0.1",
          secure: false,
          password: "youshallnotpass",
          port: 2333,
        },
      ],
      {
        botId: this.botId,
        shards: 1,
        queue: true,
      }
    );
    this.events.on("debug", console.log);
  }

  _setupRoutes() {
    this.app.use(express.json());

    this.app.use("/api/v1", router);

    this.app.post("/api/play", async (req, res) => {
      const { guildId, channelId, track } = req.body;
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).send("Guild not found");

      const channel = guild.channels.cache.get(channelId);
      if (!channel) return res.status(404).send("Voice channel not found");

      try {
        const message = {
          guild,
          member: { voice: { channel } },
          content: `!play ${track}`,
        };
        await this._handlePlay(message, track);
        res.send("Track playing");
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    this.app.post("/send", async (req, res) => {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message content is required" });
      }

      try {
        const channel = await this.client.channels.fetch(
          process.env.CHANNEL_ID
        );
        if (!channel || !channel.isTextBased()) {
          return res
            .status(404)
            .json({ error: "Channel not found or is not text-based" });
        }

        await channel.send(message);
        res.json({ status: "Message sent!" });
      } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
      }
    });

    this.app.post("/api/pause", (req, res) => {
      const { guildId } = req.body;
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).send("Guild not found");

      const message = { guild };
      this._handlePause(message);
      res.send("Playback paused");
    });

    this.app.post("/api/resume", (req, res) => {
      const { guildId } = req.body;
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).send("Guild not found");

      const message = { guild };
      this._handleResume(message);
      res.send("Playback resumed");
    });

    this.app.post("/api/stop", (req, res) => {
      const { guildId } = req.body;
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).send("Guild not found");

      const message = { guild };
      this._handleStop(message);
      res.send("Playback stopped");
    });

    this.app.listen(process.env.PORT, () => {
      console.log(
        "REST API server running on http://localhost:" + process.env.PORT
      );
    });
  }

  async _onMessage(message) {
    if (message.author.bot) return;

    const commandName = message.content
      .split(" ")[0]
      .toLowerCase()
      .substring(this.prefix.length);
    const args = message.content.split(" ").slice(1).join(" ");

    switch (commandName) {
      case "play":
        await this._handlePlay(message, args);
        break;
      case "volume":
        this._handleVolume(message, args);
        break;
      case "pause":
        this._handlePause(message);
        break;
      case "resume":
        this._handleResume(message);
        break;
      case "skip":
        this._handleSkip(message);
        break;
      case "stop":
        this._handleStop(message);
        break;
      default:
        break;
    }
  }

  async _handlePlay(message, args) {
    if (!message.member.voice.channel) {
      message.channel.send("You must be in a voice channel.");
      return;
    }

    if (!FastLink.node.anyNodeAvailable()) {
      message.channel.send("There aren't nodes connected.");
      return;
    }

    const player = new FastLink.player.Player(message.guild.id);
    if (!player.playerCreated()) player.createPlayer();

    player.connect(
      message.member.voice.channel.id.toString(),
      { mute: false, deaf: true },
      (guildId, payload) => {
        this.client.guilds.cache.get(guildId).shard.send(payload);
      }
    );

    // fastlink is very streamlined, not sure if this is possible, but if we can check if the player is paused, then we can add an if statement here to run the below line only if player state is paused and then ignoring load track WIP
    // player.update({ paused: false }), message.channel.send("Resumed.");

    const track = await player.loadTrack(
      (args.startsWith("https://") ? "" : "ytsearch:") + args
    );
    if (track.loadType === "error") {
      message.channel.send("Something went wrong. " + track.data.message);
      return;
    }

    if (track.loadType === "empty") {
      message.channel.send("No matches found.");
      return;
    }

    if (
      ["playlist", "album", "station", "show", "podcast", "artist"].includes(
        track.loadType
      )
    ) {
      player.update({
        tracks: {
          encodeds: track.data.tracks.map((track) => track.encoded),
        },
      });

      message.channel.send(
        `Added ${track.data.tracks.length} songs to the queue, and playing ${track.data.tracks[0].info.title}.`
      );
      return;
    }

    if (["track", "short"].includes(track.loadType)) {
      player.update({
        track: {
          encoded: track.data.encoded,
        },
      });

      message.channel.send(
        `Playing ${track.data.info.title} from ${track.data.info.sourceName} from url search.`
      );
      return;
    }

    if (track.loadType === "search") {
      player.update({
        track: {
          encoded: track.data[0].encoded,
        },
      });

      message.channel.send(
        `Playing ${track.data[0].info.title} from ${track.data[0].info.sourceName} from search.`
      );
      return;
    }
  }

  _handlePause(message) {
    const player = new FastLink.player.Player(message.guild.id);
    if (!player.playerCreated()) {
      message.channel.send("No player found.");
      return;
    }

    player.update({ paused: true });
    message.channel.send("Paused.");
  }

  _handleResume(message) {
    const player = new FastLink.player.Player(message.guild.id);
    if (!player.playerCreated()) {
      message.channel.send("No player found.");
      return;
    }

    player.update({ paused: false });
    message.channel.send("Resumed.");
  }

  _handleSkip(message) {
    const player = new FastLink.player.Player(message.guild.id);
    if (!player.playerCreated()) {
      message.channel.send("No player found.");
      return;
    }

    const skip = player.skipTrack();
    if (skip) message.channel.send("Skipped the current track.");
    else message.channel.send("Could not skip the current track.");
  }

  _handleStop(message) {
    const player = new FastLink.player.Player(message.guild.id);
    if (!player.playerCreated()) {
      message.channel.send("No player found.");
      return;
    }

    player.update({
      track: {
        encoded: null,
      },
    });

    message.channel.send("Stopped the player.");
  }

  start() {
    this.client.login(this.token);
  }
}

export default MusicBot;
