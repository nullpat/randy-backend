import FastLink from "@performanc/fastlink";

const name = "raw";
const runOnce = false;

const lavaHostname = process.env.LAVA_HOSTNAME;
const lavaSecure = process.env.LAVA_SECURE === "true"
const lavaPassword = process.env.LAVA_PASSWORD;
const lavaPort = process.env.LAVA_PORT;
const botId = process.env.DISCORD_CLIENT_ID;

const lavaClient = FastLink.node.connectNodes(
  [
    {
      hostname: lavaHostname,
      secure: lavaSecure,
      password: lavaPassword,
      port: lavaPort,
    },
  ],
  {
    botId,
    shards: 1,
    queue: true,
  }
);

// lavaClient.on("debug", console.log);

async function execute(data) {
  FastLink.other.handleRaw(data);
}

export { name, runOnce, execute, lavaClient };
