# driver-document-expiry-toolkit

A small TypeScript utility library for evaluating driver and vehicle document expiry dates.

The package is designed for simple library-style use cases: pass in document records with expiry dates, get back renewal states such as `valid`, `warning`, `expired`, or `missing`.

## What This Package Is

- A lightweight TypeScript toolkit for document expiry checks.
- A generic helper for driver and vehicle document renewal warnings.
- A database-free, UI-free library that can be used from Node.js applications.
- A small public open-source project with no private transport company data.

## What This Package Is Not

- It is not a fleet management platform.
- It is not a compliance authority or legal advice tool.
- It does not store documents, drivers, vehicles, customers, routes, phone numbers, emails, or registrations.
- It does not include private data copied from any transport company or internal system.

## Installation

```bash
npm install driver-document-expiry-toolkit
```

## Usage

```ts
import {
  evaluateDriverDocuments,
  evaluateVehicleDocuments,
  summarizeExpiryWarnings
} from "driver-document-expiry-toolkit";

const driverDocuments = evaluateDriverDocuments(
  [
    { type: "driving_license", expiryDate: "2026-07-15" },
    { type: "medical_certificate", expiryDate: "2026-06-10" },
    { type: "driver_card", expiryDate: null }
  ],
  { fromDate: "2026-06-01", warningDays: 30 }
);

const vehicleDocuments = evaluateVehicleDocuments(
  [
    { type: "registration", expiryDate: "2026-08-01" },
    { type: "technical_inspection", expiryDate: "2026-05-31" }
  ],
  { fromDate: "2026-06-01" }
);

const summary = summarizeExpiryWarnings([...driverDocuments, ...vehicleDocuments]);

console.log(driverDocuments);
console.log(vehicleDocuments);
console.log(summary);
```

## API Overview

### Date Utilities

```ts
toDateOnly(input: Date | string): string
daysUntil(targetDate: Date | string, fromDate?: Date | string): number
isPastDate(targetDate: Date | string, fromDate?: Date | string): boolean
isWithinDays(targetDate: Date | string, days: number, fromDate?: Date | string): boolean
```

Dates are compared as calendar dates only. Time of day is ignored. Invalid date inputs throw clear errors.

### Expiry Status

```ts
getExpiryStatus({
  expiryDate,
  warningDays,
  fromDate
})
```

Returns:

```ts
{
  status: "missing" | "valid" | "warning" | "expired";
  daysUntilExpiry: number | null;
}
```

Default warning window: `30` days.

### Driver Documents

```ts
evaluateDriverDocuments(documents, options)
```

Supported generic driver document types:

- `driving_license`
- `medical_certificate`
- `professional_competence`
- `driver_card`
- `custom`

Unknown string types are allowed and preserved.

### Vehicle Documents

```ts
evaluateVehicleDocuments(documents, options)
```

Supported generic vehicle document types:

- `registration`
- `technical_inspection`
- `tachograph_inspection`
- `insurance`
- `custom`

Unknown string types are allowed and preserved.

### Reminder Summary

```ts
summarizeExpiryWarnings(items)
```

Returns counts for:

- `total`
- `missing`
- `valid`
- `warning`
- `expired`
- `needsAttention`

`needsAttention` is calculated as `missing + warning + expired`.

## Roadmap

- Add more examples for common integration patterns.
- Add stricter TypeScript helper types for custom document categories.
- Consider optional formatting helpers for user-facing renewal messages.
- Keep the package small and dependency-light.

## Privacy and Safety

This repository contains no private transport company data. Examples use fictional, generic document records only. Do not add real driver names, real vehicle registrations, customer names, phone numbers, emails, internal routes, or private operational data to this project.

## Contributing

Contributions are welcome. Please keep changes small, generic, and covered by tests. Avoid adding private dependencies, private data, or application-specific business rules.

## License

MIT
