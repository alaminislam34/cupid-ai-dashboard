This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

**CI/CD — AWS (Amplify & EC2)**

- **Amplify (recommended for beginners):**
	- **Secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AMPLIFY_APP_ID` (if using Console trigger), `AMPLIFY_BRANCH` (if using Console trigger).
	- **How to connect:** In AWS Console → Amplify → Connect app → choose GitHub repo → select branch `main` → review build settings.
	- **If using Actions:** The workflow at `.github/workflows/deploy_amplify_action.yml` will either run `amplify publish` (if an `amplify/` folder exists) or call `aws amplify start-job` (requires `AMPLIFY_APP_ID` + `AMPLIFY_BRANCH`).

- **EC2 (SSH deploy via GitHub Actions):**
	- **Secrets:** `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` (private key contents), `EC2_SSH_PORT` (optional).
	- **Workflow file:** `.github/workflows/deploy_ec2.yml` — builds the app, SCPs files to `/home/<EC2_USER>/app`, then SSHes to install Node/PM2 and start the app with PM2.
	- **Quick server setup:**
		```bash
		ssh -i key.pem ubuntu@EC2_HOST
		curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
		sudo apt-get install -y nodejs
		sudo npm install -g pm2
		mkdir -p /home/ubuntu/app
		chown ubuntu:ubuntu /home/ubuntu/app
		```

- **Tips & best practices:**
	- Store secrets in GitHub → Settings → Secrets → Actions. Never commit keys.
	- Use `NEXT_PUBLIC_...` env names for client-visible variables; store server secrets only in Amplify or on the server.
	- Prefer Amplify for simplest deploy experience; use EC2 for full control.

**PM2 (process manager) — quick start**

Add the included `ecosystem.config.js` to the project root to run the app via PM2.

- Start production (on server, after `npm run build`):
	```bash
	pm2 start ecosystem.config.js --env production
	pm2 save
	```

- Useful PM2 commands:
	```bash
	pm2 status
	pm2 logs cupid-ai-dashboard
	pm2 restart cupid-ai-dashboard
	pm2 stop cupid-ai-dashboard
	```

- Make PM2 start on reboot (example for systemd):
	```bash
	pm2 startup systemd
	# follow printed instructions (may require sudo)
	pm2 save
	```


