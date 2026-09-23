module.exports = {
  apps: [
    {
      name: "job-portal-fr",
      script: "node_modules/next/dist/bin/next",
      args: "start",
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
      },
    },
  ],
};