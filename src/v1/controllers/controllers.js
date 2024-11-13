import services from "../services/services.js";

const getQueue = async (req, res, next) => {
  if (!req.query.guildId) {
    res.status(400).send("Query string 'guildId' is missing from url");
    return;
  }
  try {
    const queue = await services.getQueue(req.query.guildId);
    res.status(200).send(queue);
  } catch (err) {
    next(err);
  }
};

const pauseQueue = async (req, res, next) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const pause = await services.pauseQueue(req.body.guildId);
    res.status(200).send(pause);
  } catch (err) {
    next(err);
  }
};

const resumeQueue = async (req, res, next) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const resume = await services.resumeQueue(req.body.guildId);
    res.status(200).send(resume);
  } catch (err) {
    next(err);
  }
};

const clearQueue = async (req, res, next) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const clear = await services.clearQueue(req.body.guildId);
    res.status(200).send(clear);
  } catch (err) {
    next(err);
  }
};

const addSong = async (req, res, next) => {
  if (!req.body.guildId || !req.body.trackUrl) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const add = await services.addSong(req.body.guildId, req.body.trackUrl);
    res.status(200).send(add);
  } catch (err) {
    next(err);
  }
};

const skipSong = async (req, res, next) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const skip = await services.skipSong(req.body.guildId);
    res.status(200).send(skip);
  } catch (err) {
    next(err);
  }
};

const controllers = {
  getQueue,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong
};

export default controllers;
