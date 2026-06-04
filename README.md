# FPC Management System - NXP WT

A modern, responsive Operator User Interface for requesting and returning **Front Opening Pod Carriers (FPCs)** between **Smart Storage** and factory workstations/machines.

---

## 🚀 Technical Stack

- **Core**: React 18.3.1 (TypeScript)
- **Build & Development**: Vite 8.x
- **Styling**: Tailwind CSS v4 (with custom `@theme` CSS-based tokens) & Vanilla CSS
- **Component UI**: Material-UI (MUI v7) & Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts (for telemetry/queue analytics)

---

## ✨ Key Features

1. **Employee Authentication**
   - Lock interface using Employee ID with verification.
   - Session management and clear logout flow.

2. **Dual-Mode Workflow**
   - **Return FPC**: Dispatch an Automated Guided Vehicle (AGV) to pick up an FPC from a machine and return it to Smart Storage.
   - **Deliver FPC**: Search/select a specific FPC from Smart Storage and command the AGV to deliver it to a destination machine.

3. **Machine Selector**
   - Real-time search/filtering for over 50 registered machines (`AVT_001` - `AVT_050`).
   - Visual indicators showing machine availability (Available/Unavailable).

4. **Task Queue & AGV Status Tracking**
   - Real-time progress monitoring: `Queued` ➡️ `In Progress` ➡️ `Arrived` ➡️ `Waiting for Confirmation` ➡️ `Complete` / `Error`.
   - Simulates physical workflow interactions requiring operator feedback:
     - **Confirm Barrier Installed**: Safety confirmation when the AGV arrives.
     - **Confirm Barrier Removed**: Confirmation before the AGV departs.

---

## 📁 Directory Structure

```text
src/
├── features/               # Domain-specific feature modules
│   ├── auth/               # Employee login & session component
│   ├── queue/              # Task queue monitoring & actions
│   └── workflow/           # Mode selection, Machine selector, Return/Request forms
├── shared/                 # Shared components, utilities, and assets
│   ├── components/         # Reusable UI components (e.g. LanguageSwitcher)
│   ├── types/              # TypeScript interface and type declarations
│   ├── utils/              # Translations dictionary, Mock API layer
│   └── styles/             # Project styling configurations
├── App.tsx                 # Core App layout & page routing
├── main.tsx                # Entry point
└── index.css               # Tailwind & Global custom theme
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
Runs on port **3000** (configured in [vite.config.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/vite.config.ts) to prevent conflict with other services).
```bash
npm run dev
```

### 3. Lint Code
```bash
npm run lint
```

### 4. Build for Production
Generates optimized static assets in the `/dist` directory.
```bash
npm run build
```
