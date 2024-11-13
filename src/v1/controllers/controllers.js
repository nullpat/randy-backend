import services from "../services/services.js";

const getQueue = async (req, res) => {
  if (!req.query.guildId) {
    res.status(400).send("Query string 'guildId' is missing from url");
    return;
  }
  try {
    const queue = await services.getQueue(req.query.guildId);
    res.send(queue);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const pauseQueue = async (req, res) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const pause = await services.pauseQueue(req.body.guildId);
    res.send(pause);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const resumeQueue = async (req, res) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const resume = await services.resumeQueue(req.body.guildId);
    res.send(resume);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const clearQueue = async (req, res) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const clear = await services.clearQueue(req.body.guildId);
    res.send(clear);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const addSong = async (req, res) => {
  if (!req.body.guildId || !req.body.trackUrl) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const add = await services.addSong(req.body.guildId, req.body.trackUrl);
    res.send(add);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const skipSong = async (req, res) => {
  if (!req.body.guildId) {
    res
      .status(400)
      .send("Missing 'Content-Type' header or 'guildId' parameter in body");
    return;
  }
  try {
    const skip = await services.skipSong(req.body.guildId);
    res.send(skip);
  } catch (error) {
    res.status(500).send("Internal Server Error");
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
