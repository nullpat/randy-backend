import services from "../services/services.js";

const joinChannel = async (req, res, next) => {
  const { guildId, channelId } = req.body;
  if (!guildId || !channelId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId', 'channelId' parameters in body");
    return;
  }
  try {
    const join = await services.joinChannel(guildId, channelId);
    res.status(200).send(join);
  } catch (error) {
    next(error);
  }
};

const leaveChannel = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const destroy = await services.leaveChannel(guildId);
    res.status(200).send(destroy);
  } catch (error) {
    next(error);
  }
};

const changeVolume = async (req, res, next) => {
  const { guildId, volume } = req.body;
  if (!guildId || !volume) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId', 'volume' parameters in body");
    return;
  }
  try {
    const change = await services.changeVolume(guildId, volume);
    res.status(200).send(change);
  } catch (error) {
    next(error);
  }
};

const getServers = async (req, res, next) => {
  try {
    const servers = await services.getServers();
    res.status(200).send(servers);
  } catch (error) {
    next(error);
  }
};

const getServer = async (req, res, next) => {
  const { guildId } = req.query;
  if (!guildId) {
    res.status(400).send("Query string 'guildId' is missing from url");
    return;
  }
  try {
    const server = await services.getServer(guildId);
    res.status(200).send(server);
  } catch (error) {
    next(error);
  }
};

const getVoice = async (req, res, next) => {
  const { guildId } = req.query;
  if (!guildId) {
    res.status(400).send("Query string 'guildId' is missing from url");
    return;
  }
  try {
    const voice = await services.getVoice(guildId);
    res.status(200).send(voice);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};

const pauseQueue = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const pause = await services.pauseQueue(guildId);
    res.status(200).send(pause);
  } catch (error) {
    next(error);
  }
};

const resumeQueue = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const resume = await services.resumeQueue(guildId);
    res.status(200).send(resume);
  } catch (error) {
    next(error);
  }
};

const clearQueue = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const clear = await services.clearQueue(guildId);
    res.status(200).send(clear);
  } catch (error) {
    next(error);
  }
};

const removeLast = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const remove = await services.removeLast(guildId);
    res.status(200).send(remove);
  } catch (error) {
    next(error);
  }
};

const skipSong = async (req, res, next) => {
  const { guildId } = req.body;
  if (!guildId) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const skip = await services.skipSong(guildId);
    res.status(200).send(skip);
  } catch (error) {
    next(error);
  }
};

const addSong = async (req, res, next) => {
  const { guildId, track } = req.body;
  if (!guildId || !track) {
    res.status(400).send("Missing 'Content-Type' header or 'guildId', 'track' parameters in body");
    return;
  }
  try {
    const add = await services.addSong(guildId, track);
    res.status(200).send(add);
  } catch (error) {
    next(error);
  }
};

const getCommands = async (req, res, next) => {
  try {
    const commands = await services.getCommands();
    res.status(200).send(commands);
  } catch (error) {
    next(error);
  }
};

const controllers = {
  joinChannel,
  leaveChannel,
  changeVolume,
  getServers,
  getServer,
  getVoice,
  getQueue,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong,
  getCommands,
  removeLast,
};

export default controllers;
