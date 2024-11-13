import express from "express";
import controllers from "../controllers/controllers.js";

const router = express.Router();

router.get("/getQueue", controllers.getQueue);
router.get("/pauseQueue", controllers.pauseQueue);
router.get("/sendMessage", controllers.getQueue);

export default router;
