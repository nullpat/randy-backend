import FastLink from "@performanc/fastlink";
import { nowPlaying } from "../services/services.js";
import client from "../musicbot.js";

const name = "raw";
const runOnce = false;

// todo: replace deprecated nowplaying trigger

// lavaClient.on("raw", async (d, t) => {

  // if (data.type === "TrackEndEvent") {
  //   nowPlaying(data.guildId);
  // } else {
  //   return;
  // }
// });

const execute = async (d, t) => {
  if (d.t === "VOICE_SERVER_UPDATE" || d.t === "VOICE_STATE_UPDATE") {
    return client.aqua.updateVoiceState(d, t);
}
};

export { name, runOnce, execute };
