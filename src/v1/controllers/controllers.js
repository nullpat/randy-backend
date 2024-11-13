import services from "../services/services.js";

const getQueue = async (req, res) => {
  if (!req.query.guildId) {
    res.status(400).send({
      error: "Query string 'guildId' is missing from url",
    });
    return;
  }
  const queue = await services.getQueue(req.query.guildId);
  res.send(queue);
};

const pauseQueue = async (req, res) => {
    // console.log(message)
  const pauseTheQueueService = await services.pauseQueue(req.query.guildId);
  res.send(pauseTheQueueService);
};

const resumeQueue = (req, res) => {
  const resumeTheQueueService = services.getQueue();
  res.send("Resume the Queue");
};

const stopQueue = (req, res) => {
  const stopTheQueueService = services.getQueue();
  res.send("Stop the Queue");
};

const addSongToQueue = (req, res) => {
  const addSongToQueueService = services.getQueue();
  res.send("Add a song to the Queue");
};

const sendMessage = (req, res) => {
  const sendMessageService = services.getQueue();
  res.send("Send a message");
};

const controllers = {
  getQueue,
  addSongToQueue,
  sendMessage,
  pauseQueue,
  resumeQueue,
  stopQueue,
};

export default controllers;
