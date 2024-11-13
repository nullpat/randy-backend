import express from "express";
import controllers from "../controllers/controllers.js";

const router = express.Router();

router.get("/getQueue", controllers.getQueue);
router.patch("/pauseQueue", controllers.pauseQueue);
router.patch("/resumeQueue", controllers.resumeQueue);
router.patch("/clearQueue", controllers.clearQueue);
router.patch("/joinChannel", controllers.joinChannel);
router.patch("/skipSong", controllers.skipSong);
router.patch("/addSong", controllers.addSong);

export default router;
