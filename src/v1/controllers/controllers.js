import services from "../services/services.js";

const joinChannel = async (req, res, next) => {
  const { guildId, channelId } = req.body;
  if (!guildId || !channelId) {
    res
      .status(400)
      .send(
        "Missing 'Content-Type' header or 'guildId', 'channelId' parameters in body"
      );
    return;
  }
  try {
    const join = await services.joinChannel(guildId, channelId);
    res.status(200).send(join);
  } catch (err) {
    next(err);
  }
};

const disconnectPlayer = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res
      .status(400)
      .send(
        "Missing 'Content-Type' header or 'guildId' parameter in body"
      );
    return;
  }
  try {
    const destroy = await services.disconnectPlayer(guildId);
    res.status(200).send(destroy);
  } catch (err) {
    next(err);
  }
};

const changeVolume = async (req, res, next) => {
  const { guildId, volume } = req.body;
  if (!guildId || !volume) {
    res
      .status(400)
      .send(
        "Missing 'Content-Type' header or 'guildId', 'volume' parameters in body"
      );
    return;
  }
  try {
    const change = await services.changeVolume(guildId, volume);
    res.status(200).send(change);
  } catch (err) {
    next(err);
  }
};

const getQueue = async (req, res, next) => {
  const { guildId } = req.query;
  if (!guildId) {
    res.status(400).send("Query string 'guildId' is missing from url");
    return;
  }
  try {
    const queue = await services.getQueue(guildId);
    res.status(200).send(queue);
  } catch (err) {
    next(err);
  }
};

const pauseQueue = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const pause = await services.pauseQueue(guildId);
    res.status(200).send(pause);
  } catch (err) {
    next(err);
  }
};

const resumeQueue = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const resume = await services.resumeQueue(guildId);
    res.status(200).send(resume);
  } catch (err) {
    next(err);
  }
};

const clearQueue = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const clear = await services.clearQueue(guildId);
    res.status(200).send(clear);
  } catch (err) {
    next(err);
  }
};

const skipSong = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const skip = await services.skipSong(guildId);
    res.status(200).send(skip);
  } catch (err) {
    next(err);
  }
};

const addSong = async (req, res, next) => {
  const { guildId, track } = req.body;
  if (!guildId || !track) {
    res
      .status(400)
      .send(
        "Missing 'Content-Type' header or 'guildId', 'track' parameters in body"
      );
    return;
  }
  try {
    const add = await services.addSong(guildId, track);
    res.status(200).send(add);
  } catch (err) {
    next(err);
  }
};

const controllers = {
  joinChannel,
  disconnectPlayer,
  changeVolume,
  getQueue,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong,
};

export default controllers;
