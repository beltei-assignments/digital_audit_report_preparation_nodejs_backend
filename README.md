# AuditPro (Node.js)

Digital Audit Report Preparation Software

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node (Version >= `16`)
- MySQL or MariaDB

## Setup

1. Configure environment:

    - Copy file `/config/config.json.exemple` to `/config/config.json`
    - Change your database configuration

2. Install dependencies:

```powershell
npm install
```

3. Apply migrations and seed data:

```powershell
npm run migrate:seed
```

4. Start development application:

```powershell
npm run dev
```
