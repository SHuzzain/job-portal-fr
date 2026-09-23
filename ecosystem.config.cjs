const path = require("path");
const os = require("os");
const { name } = require("./package.json");

// ── NVM Configuration ──────────────────────────────────────────
// On Linux: ~/.nvm/versions/node/vXX.XX.X/bin/node
// On Windows: uses system PATH (nvm-windows manages it automatically)
const NODE_VERSION = "v22.22.3";
const isLinux = os.platform() !== "win32";

let interpreterPath;
if (isLinux) {
  const nvmDir = process.env.NVM_DIR || path.join(os.homedir(), ".nvm");
  const nodeBin = path.join(nvmDir, "versions", "node", NODE_VERSION, "bin");
  interpreterPath = path.join(nodeBin, "node");
}
// ───────────────────────────────────────────────────────────────

module.exports = {
  apps: [
    {
      name,

      script: "node_modules/next/dist/bin/next",
      args: "start",

      // On Linux: use NVM's Node directly. On Windows: use default from PATH.
      ...(interpreterPath && { interpreter: interpreterPath }),

      instances: 1,
      exec_mode: "fork",

      watch: false,

      max_memory_restart: "1G",
      restart_delay: 4000,
      autorestart: true,

      time: true,

      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,

      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",

        // On Linux: prepend NVM bin to PATH for child processes
        ...(isLinux && {
          PATH: `${path.dirname(interpreterPath)}:${process.env.PATH}`,
        }),
      },
    },
  ],
};