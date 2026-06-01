# Contributing

Thank you for considering a contribution to `driver-document-expiry-toolkit`.

## Development Setup

```bash
npm install
npm test
npm run build
```

## Guidelines

- Keep the toolkit generic and library-focused.
- Add or update tests for behavior changes.
- Keep changes small and reviewable.
- Do not add private company data, real driver names, real vehicle registrations, real customer data, phone numbers, emails, or internal routes.
- Do not add private dependencies.
- Prefer clear TypeScript types and simple functions over framework-specific code.

## Scripts

- `npm run build` builds the package with TypeScript.
- `npm test` runs the Vitest suite once.
- `npm run test:watch` runs Vitest in watch mode.
- `npm run typecheck` checks TypeScript without emitting files.
