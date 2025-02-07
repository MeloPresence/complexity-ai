This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Setup

If you are developing on WSL, create a `.npmrc` file at the top level with `node-linker=hoisted` to make language services work when installed with `pnpm`.

Then, run `pnpm i` to install dependencies.

Get a free Google Gemini API key [here](https://makersuite.google.com/app/apikey). You will also need a Firebase project.

Make a copy of `.env` as `.env.local` and fill in the API keys.

### Running locally

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing pages by modifying any `page.tsx`. The current landing page is [`app/(pages)/(chat)/[[...id]]/page.tsx`](app/(pages)/(chat)/[[...id]]/page.tsx). The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

#### Using Docker/Podman

Run `docker build . --tag complexity-ai:latest` to build the image.

Run `docker run --name complexity-ai -p 3000:3000 complexity-ai:latest` to run the image in a container.

Swap `docker` with `podman` when using Podman.

`podman compose up --build`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
