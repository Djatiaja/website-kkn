This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Shared Hosting

This app needs a Node.js server because it uses API routes, auth, Prisma, and server actions. It cannot be deployed as a pure static export without breaking those features.

Use the standalone build output for the smallest production bundle:

```bash
npm install
npm run build
```

After the build completes, deploy these files to the hosting account:

```bash
.next/standalone
.next/static
public
```

If the host runs a custom Node app, start the bundled server with:

```bash
node .next/standalone/server.js
```

Set the required environment variables on the hosting panel before starting the app, especially database, auth, and upload settings.

If your shared host does not support Node.js applications, this project will not run there as-is. In that case you will need a VPS, a platform with Node app support, or a separate backend/frontend split.

## Deploy on DirectAdmin

DirectAdmin works if your hosting plan includes a Node.js application manager or a way to run a custom Node process behind a domain or subdomain.

1. Build the app locally:

```bash
npm install
npm run build
```

2. Upload these production folders to your DirectAdmin account:

```bash
.next/standalone
.next/static
public
```

3. In DirectAdmin, create a Node.js app for the site or subdomain and point the startup file to:

```bash
.next/standalone/server.js
```

4. Set the environment variables in DirectAdmin before starting the app, especially:

```bash
NODE_ENV=production
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.example
```

5. If your DirectAdmin setup exposes a custom port, keep the default server start command and let the panel manage `PORT`. The standalone server reads the runtime port from the environment.

6. Run any Prisma migration or seed step before going live if your database is empty:

```bash
npx prisma migrate deploy
npx prisma db seed
```

7. If uploads are stored on disk, make sure the `public/uploads` path is writable by the Node process.

If your DirectAdmin plan does not include Node.js support, this app will not run correctly there without a VPS or a separate backend/frontend deployment.
