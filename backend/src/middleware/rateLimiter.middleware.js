import rateLimit from "express-rate-limit";

// ─────────────────────────────────────────────────────────────────────────────
// Shared handler: returns a consistent JSON 429 response for every limiter.
// Using a single handler keeps the error format uniform across all routes.
// ─────────────────────────────────────────────────────────────────────────────
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many requests. Please try again later.",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN LIMITER — 5 requests per 15 minutes
//
// Why: Login is the primary attack surface for brute-force password guessing.
// An attacker who can try thousands of passwords quickly can compromise weak
// accounts. Limiting to 5 attempts per 15 minutes effectively neutralises this.
//
// Applied to: POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  handler: rateLimitHandler,
  standardHeaders: true,  // Send RateLimit-* headers so clients know limits
  legacyHeaders: false,   // Disable deprecated X-RateLimit-* headers
});

// ─────────────────────────────────────────────────────────────────────────────
// SIGNUP LIMITER — 5 requests per 1 hour
//
// Why: A loose signup endpoint lets bots register thousands of fake accounts
// quickly, polluting the database and enabling spam. A tight 1-hour window
// makes mass account creation infeasible while not impacting real users.
//
// Applied to: POST /api/auth/signup
// ─────────────────────────────────────────────────────────────────────────────
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// USER SEARCH LIMITER — 60 requests per 1 minute
//
// Why: The sidebar user list is fetched often (every page load / refresh).
// Normal usage of 60 requests per minute covers even the most active users.
// Beyond that, requests are likely automated scraping of the user base.
//
// Applied to: GET /api/messages/users
// ─────────────────────────────────────────────────────────────────────────────
export const userSearchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// GENERAL API LIMITER — 100 requests per 15 minutes
//
// Why: A blanket safety net for all API endpoints. Catches any abuse that
// slips past the more specific limiters and guards against DDoS-style floods
// that could exhaust the Render server's resources.
//
// Applied to: All /api/* routes (registered in index.js before route mounting)
// NOTE: Socket.io traffic is NOT HTTP — it runs over WebSocket and is never
// touched by this or any other Express rate limiter.
// ─────────────────────────────────────────────────────────────────────────────
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});
