import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";  // Security middleware to set HTTP headers
import cors from "cors";  // Middleware to control cross-origin requests
import dotenv from "dotenv";  // Load environment variables from .env file
import { dirname } from "path";
import { fileURLToPath } from "url";

// Load environment variables (PORT, PASSWORD, CORS_ORIGIN) from .env file
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
// Read port and password from environment variables (security best practice: no hardcoded secrets)
const port = process.env.PORT || 3000;
const correctPassword = process.env.PASSWORD || "ILoveProgramming";

// === SECURITY MIDDLEWARE ===
// Helmet: Sets HTTP headers (X-Frame-Options, X-Content-Type-Options, etc.) to prevent common attacks
app.use(helmet());

// CORS: Restrict which domains can make requests to this server
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));

// Parse URL-encoded request bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Track authorized users by their IP address (simplified session management)
// Note: In production, use express-session or JWT tokens instead of tracking by IP
const authorizedSessions = new Set();

// Middleware to validate password and authorize users
function passwordCheck(req, res, next) {
  const password = req.body.password;

  // === INPUT VALIDATION ===
  // Check if password exists and is a string (prevents injection attacks)
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid password format" });
  }

  const trimmedPassword = password.trim();

  // Validate password length to prevent buffer overflow and injection attacks
  if (trimmedPassword.length === 0 || trimmedPassword.length > 200) {
    return res.status(400).json({ error: "Password length invalid" });
  }

  // === AUTHORIZATION ===
  // If password is correct, add client's IP to authorized sessions
  if (trimmedPassword === correctPassword) {
    authorizedSessions.add(req.ip);
  }

  // Continue to next middleware/route
  next();
}
app.use(passwordCheck);

// Home route: serve login page
app.get("/", (req, res) => {
  // sendFile callback handles errors (e.g., file not found)
  res.sendFile(__dirname + "/public/index.html", (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(404).send("Page not found");
    }
  });
});

// Check authorization route: verify user's password and return appropriate page
app.post("/check", (req, res) => {
  // Check if this client's IP is in the authorized sessions set
  // (password validation already happened in passwordCheck middleware above)
  const isAuthorized = authorizedSessions.has(req.ip);

  if (isAuthorized) {
    // Serve secret page to authorized users
    res.sendFile(__dirname + "/public/secret.html", (err) => {
      if (err) {
        console.error("Error serving secret.html:", err);
        res.status(500).send("Error loading secret page");
      }
    });
  } else {
    // Send login page back to unauthorized users
    res.sendFile(__dirname + "/public/index.html", (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(404).send("Page not found");
      }
    });
  }
});

// === ERROR HANDLING MIDDLEWARE ===
// Global error handler (must be defined AFTER all other routes and middleware)
// Catches any errors thrown during request processing and sends safe error response
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  // Return JSON error response instead of exposing server details
  res.status(500).json({ error: "Server error" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
