import FastLink from "@performanc/fastlink";

const getQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  const queueRaw = await player.getQueue();
  const queue = await player.decodeTracks(queueRaw);
  return queue;
};

const pauseQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  player.update({ paused: true });
  return;
};

const resumeQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  player.update({ paused: false });
  return;
};

const clearQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  player.update({ track: { encoded: null } });
  return;
};

const skipSong = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  player.skipTrack();
  return;
};

const addSong = async (guildId, trackUrl) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) {
    return (500);
  }
  const loadPrefix = trackUrl.startsWith("https://") ? "" : "ytsearch:";
  const track = await player.loadTrack(loadPrefix + trackUrl);
  const { loadType, data } = track;
  if (
    ["playlist", "album", "station", "show", "podcast", "artist"].includes(
      loadType
    )
  ) {
    player.update({
      tracks: {
        encodeds: data.tracks.map((track) => track.encoded),
      },
    });
    return `Added ${track.data.tracks.length} songs to the queue, and playing ${track.data.tracks[0].info.title}.`;
  } else if (["track", "short"].includes(loadType)) {
    player.update({
      track: {
        encoded: data.encoded,
      },
    });
    return `Playing ${track.data.info.title} from ${track.data.info.sourceName}`;
  } else if (["search"].includes(loadType)) {
    player.update({
      track: {
        encoded: data[0].encoded,
      },
    });
    return `Playing ${track.data[0].info.title} from ${track.data[0].info.sourceName} from search.`;
  } else return "error";
};

const services = {
  getQueue,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong
};

export default services;
