import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getMessages,sendMessage,getUsersForSidebar} from "../controllers/message.controller.js";
import { userSearchLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

// userSearchLimiter: 60 requests per 1 minute — allows normal usage but prevents user list scraping
router.get("/users",protectRoute,userSearchLimiter,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);

export default router;