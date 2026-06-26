require("dotenv").config();

// Define exactly what environment variables our app needs to survive
const requiredEnvVars = ["PORT", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "MONGO_URI"];

// Validate that every required variable actually exists
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: Environment variable ${envVar} is missing!`);
    // Kill the server if it's missing critical config (prevents silent bugs in production)
    process.exit(1); 
  }
});

// Export them cleanly so the rest of the app doesn't need to read process.env
module.exports = {
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  MONGO_URI: process.env.MONGO_URI,
};
