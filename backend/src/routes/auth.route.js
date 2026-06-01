import express from "express";
import { signup,login,logout,updateProfile, googleAuth} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/google", googleAuth);

// Helpful response when someone visits signup/login in browser (GET)
router.get("/signup", (_, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST with body: { fullName, username, email, password }" });
});
router.get("/login", (_, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST with body: { username, password }" });
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); 

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);
export default router;
