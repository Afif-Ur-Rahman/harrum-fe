#!/usr/bin/env node

/**
 * Script to copy .env files and start standalone server
 * Used by PM2 to ensure .env files are in place before starting
 */

import { existsSync, copyFileSync, mkdirSync, statSync, readdirSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

const projectRoot = process.cwd();
const standaloneDir = join(projectRoot, ".next", "standalone");
const envFiles = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
];

// Copy .env files to standalone if they exist
if (existsSync(standaloneDir)) {
  console.log(
    `[${new Date().toISOString()}] 📋 Copying environment files to standalone build...`,
  );

  let copiedCount = 0;
  envFiles.forEach((envFile) => {
    const sourcePath = join(projectRoot, envFile);
    const destPath = join(standaloneDir, envFile);

    if (existsSync(sourcePath)) {
      try {
        copyFileSync(sourcePath, destPath);
        console.log(`[${new Date().toISOString()}] ✅ Copied ${envFile}`);
        copiedCount++;
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] ❌ Failed to copy ${envFile}:`,
          error.message,
        );
      }
    }
  });

  if (copiedCount > 0) {
    console.log(
      `[${new Date().toISOString()}] ✅ Copied ${copiedCount} environment file(s) to standalone`,
    );
  } else {
    console.log(
      `[${new Date().toISOString()}] ⚠️  No .env files found in project root`,
    );
  }

  // Copy static directory to standalone build (required for images and static assets)
  const staticSource = join(projectRoot, ".next", "static");
  const staticDest = join(standaloneDir, ".next", "static");

  if (existsSync(staticSource) && !existsSync(staticDest)) {
    try {
      // Create .next directory in standalone if it doesn't exist
      const standaloneNextDir = join(standaloneDir, ".next");
      if (!existsSync(standaloneNextDir)) {
        mkdirSync(standaloneNextDir, { recursive: true });
      }

      // Recursive copy function
      const copyRecursiveSync = (src, dest) => {
        const exists = existsSync(src);
        const stats = exists && statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
          }
          readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
              join(src, childItemName),
              join(dest, childItemName),
            );
          });
        } else {
          copyFileSync(src, dest);
        }
      };

      copyRecursiveSync(staticSource, staticDest);
      console.log(
        `[${new Date().toISOString()}] ✅ Copied static files to standalone build`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] ❌ Failed to copy static files:`,
        error.message,
      );
    }
  } else if (existsSync(staticDest)) {
    console.log(
      `[${new Date().toISOString()}] ℹ️  Static directory already exists in standalone build`,
    );
  } else if (!existsSync(staticSource)) {
    console.warn(
      `[${new Date().toISOString()}] ⚠️  Static source directory not found: ${staticSource}`,
    );
  }
} else {
  console.log(
    `[${new Date().toISOString()}] ⚠️  Standalone directory not found, skipping .env copy`,
  );
}

// Start the standalone server
const serverPath = join(standaloneDir, "server.js");

if (!existsSync(serverPath)) {
  console.error(
    `[${new Date().toISOString()}] ❌ Error: ${serverPath} not found!`,
  );
  process.exit(1);
}

console.log(`[${new Date().toISOString()}] 🚀 Starting standalone server...`);

// Spawn the server process and forward all signals
const server = spawn("node", [serverPath], {
  stdio: "inherit",
  cwd: projectRoot,
  env: process.env,
});

server.on("error", (error) => {
  console.error(
    `[${new Date().toISOString()}] ❌ Failed to start server:`,
    error,
  );
  process.exit(1);
});

server.on("exit", (code, signal) => {
  if (signal) {
    console.log(
      `[${new Date().toISOString()}] Server stopped by signal: ${signal}`,
    );
  } else {
    console.log(
      `[${new Date().toISOString()}] Server exited with code: ${code}`,
    );
  }
  process.exit(code || 0);
});

// Forward signals to the server process
process.on("SIGTERM", () => {
  server.kill("SIGTERM");
});

process.on("SIGINT", () => {
  server.kill("SIGINT");
});
