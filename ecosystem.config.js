import "dotenv/config";

import { existsSync } from "fs";
import { join } from "path";

const PORT = process.env.PORT || 8021;
const SERVICE_NAME = process.env.SERVICE_NAME || "restaurant-web";

// Check if standalone build exists
const standalonePath = join(process.cwd(), ".next", "standalone", "server.js");
const useStandalone = existsSync(standalonePath);
const standaloneScript = join(process.cwd(), "scripts", "start-standalone.js");

// Find next binary path (fallback if standalone is not available)
const nextBinPath = join(process.cwd(), "node_modules", ".bin", "next");

export const apps = [
  {
    name: `${SERVICE_NAME}-${PORT}`,
    // Use standalone server if available (with .env copy), otherwise fall back to next start
    script: useStandalone
      ? "node"
      : existsSync(nextBinPath)
        ? nextBinPath
        : "npx",
    args: useStandalone
      ? [standaloneScript]
      : existsSync(nextBinPath)
        ? ["start"]
        : ["next", "start"],
    env: {
      PORT,
      NODE_ENV: "production",
      NODE_OPTIONS: "--max-old-space-size=2048",
    },
    autorestart: true,
    error_file: "./logs/pm2/error.log",
    out_file: "./logs/pm2/out.log",
    log_file: "./logs/pm2/combined.log",
    time: true,
    exec_mode: "fork",
    watch: false,
    max_memory_restart: "4G",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
  },
];
export const deploy = {
  production: {
    "post-deploy":
      "npm ci && NODE_OPTIONS='--max-old-space-size=1536' npm run build && pm2 reload ecosystem.config.js --env production",
  },
};
