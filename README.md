# Kranti

Kranti is a civic action platform built for citizens to report injustice, organize public support, and keep pressure on institutions in a clear, accountable way.

## What it does

- Lets people raise public issues with context and supporting material.
- Helps supporters rally around active cases and campaigns.
- Focuses on lawful, safer civic action with moderation and privacy safeguards.

## Tech stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Clerk authentication
- Appwrite backend and storage

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Create a local `.env.local` file with the required Clerk and Appwrite values used by the app.

## Project Structure

- `src/app` - routes, pages, layout, and global styling
- `src/components` - shared UI and shell components
- `public` - logos, icons, and static assets

## Documentation

- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## License

Released under the MIT License. See [LICENSE](LICENSE).
