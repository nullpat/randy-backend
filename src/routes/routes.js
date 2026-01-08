import express from "express";
import controllers from "../controllers/controllers.js";

const router = express.Router();

router.get("/commands", controllers.getCommands);
router.get("/servers", controllers.getServers);
router.get("/server", controllers.getServer);
router.get("/voice", controllers.getVoice);
router.get("/queue", controllers.getQueue);
router.post("/joinChannel", controllers.joinChannel);
router.post("/leaveChannel", controllers.leaveChannel);
router.post("/changeVolume", controllers.changeVolume);
router.post("/pauseQueue", controllers.pauseQueue);
router.post("/resumeQueue", controllers.resumeQueue);
router.post("/clearQueue", controllers.clearQueue);
router.post("/removeLast", controllers.removeLast);
router.post("/skipSong", controllers.skipSong);
router.post("/addSong", controllers.addSong);

export default router;
