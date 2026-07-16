import express from "express";
import { signup,login,logout,updateProfile, googleAuth} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controllers.js";
import { loginLimiter, signupLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post("/google", googleAuth);

// Helpful response when someone visits signup/login in browser (GET)
router.get("/signup", (_, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST with body: { username, email, password }" });
});
router.get("/login", (_, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST with body: { username, password }" });
});

// signupLimiter: 5 requests per 1 hour — prevents fake/spam account creation
router.post("/signup", signupLimiter, signup);

// loginLimiter: 5 requests per 15 minutes — prevents brute-force password attacks
router.post("/login", loginLimiter, login);

router.post("/logout", logout); 

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);
export default router;

