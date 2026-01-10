import client from "../musicbot.js";

const name = "raw";
const runOnce = false;

const execute = async (d, t) => {
  if (d.t === "VOICE_SERVER_UPDATE" || d.t === "VOICE_STATE_UPDATE") {
    return client.aqua.updateVoiceState(d, t);
}
};

export { name, runOnce, execute };
