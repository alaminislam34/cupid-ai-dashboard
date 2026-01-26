module.exports = {
  apps: [
    {
      name: "next-dashboard",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/home/ubuntu/dashboard",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
