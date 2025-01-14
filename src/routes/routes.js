import express from "express";
import controllers from "../controllers/controllers.js";

const router = express.Router();

router.get("/servers", controllers.getServers);
router.get("/server", controllers.getServer);
router.get("/voiceState", controllers.getVoiceState);
router.get("/queue", controllers.getQueue);
router.patch("/joinChannel", controllers.joinChannel);
router.patch("/leaveChannel", controllers.leaveChannel);
router.patch("/changeVolume", controllers.changeVolume);
router.patch("/pauseQueue", controllers.pauseQueue);
router.patch("/resumeQueue", controllers.resumeQueue);
router.patch("/clearQueue", controllers.clearQueue);
router.patch("/skipSong", controllers.skipSong);
router.patch("/addSong", controllers.addSong);

export default router;
