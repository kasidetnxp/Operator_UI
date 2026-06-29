# FPC Management System - NXP WT

A modern, responsive Operator User Interface for requesting, returning, and swapping **Front Opening Pod Carriers (FPCs)** between **Smart Storage** and factory workstations/machines via **Automated Guided Vehicles (AGVs)**.

---

## 🚀 Technical Stack

- **Core**: React 18.3.1 (TypeScript)
- **Build & Development**: Vite 8.x
- **Styling**: Tailwind CSS v4 (with custom `@theme` CSS-based tokens) & Vanilla CSS
- **Component UI**: Material-UI (MUI v7) & Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts (for telemetry/queue analytics)
- **Animation**: Motion (Framer Motion v12)
- **Notifications**: Sonner (toast notifications)

---

## ✨ Key Features

1. **Employee Authentication**
   - Lock interface using Employee ID and Password with credential verification.
   - Role-based access control (Admin, Store, Operator).
   - Session management and clear logout flow.

2. **Four-Mode Workflow (LOAD / UNLOAD / Swap / UNLOAD & LOAD)**
   - **LOAD (คืน FPC)**: Dispatch an AGV to pick up an FPC from a machine and return it to Smart Storage.
   - **UNLOAD (เบิก FPC)**: Search/select a specific FPC from Smart Storage and command the AGV to deliver it to a destination machine.
   - **สลับ FPC (Swap)**: Transfer an FPC directly from a source machine to a destination machine without going through Smart Storage.
   - **UNLOAD & LOAD (เปลี่ยน FPC)**: Remove the old FPC from a machine and install a new FPC from Smart Storage in a single task sequence. The database automatically swaps the location records of the FPCs once the task is completed.

3. **Machine Selector**
   - Real-time search/filtering for over 50 registered machines (`AVT_001` - `AVT_050`).
   - Visual indicators showing machine availability (Available/Unavailable).

4. **Task Queue & AGV Status Tracking**
   - Real-time progress monitoring through detailed statuses: `Submitted` → `Queued` → `Starting` → `Moving to Source` → `Arrived at Source` → `Picking Up FPC` → `Waiting for Cover Head Installation` → `Moving to Destination` → `Arrived at Destination` → `Placing FPC` → `Waiting for Cover Head Removal` → `Completed`.
   - **Safety Checklist & Confirm Button**: Implements a dual-verification safety checklist requiring the operator to manually check "Tray is opened" on screen and confirm cover head installation/removal via the physical AGV button (simulated with a 5-second delay). Once both checklist items are satisfied, a manual "Confirm" button is enabled on the screen to progress the workflow.

5. **Admin Panel & Audit Logs**
   - System audit log viewing and management.
   - User management (Admin role only).
   - FPC location corrections (Admin & Store roles).
   - **AGV Status Controls**: Supports 4 detailed AGV statuses (`Ok`, `Engineering Use`, `PM`, `Error`) editable only by the `Admin` role via locked `210px` dropdown selections. Non-Ok statuses automatically block assigned tasks.

---

## 📁 Directory Structure

```text
src/
├── features/               # Domain-specific feature modules
│   ├── admin/              # Admin panel & audit log management
│   ├── auth/               # Employee login & session component
│   ├── queue/              # Task queue monitoring & actions
│   └── workflow/           # Mode selection, Machine selector, Return/Request/Swap/UnloadLoad forms
├── shared/                 # Shared components, utilities, and assets
│   ├── components/         # Reusable UI components (currently empty)
│   ├── types/              # TypeScript interface and type declarations
│   └── utils/              # Translations dictionary, Mock API layer
├── styles/                 # Project styling configurations
│   ├── globals.css         # Global CSS overrides
│   ├── tailwind.css        # Tailwind CSS entry point
│   └── theme.css           # Custom @theme CSS tokens
├── assets/                 # Static assets (images, SVGs)
├── App.tsx                 # Core App layout & page routing
├── App.css                 # App-level component styles
├── main.tsx                # Entry point
└── index.css               # Tailwind & Global custom theme
```

---

## 🛠️ Getting Started

### Default Test Credentials
| Role | Employee ID | Password |
|---|---|---|
| Admin | `admin` | `admin` |
| Store | `store` | `store` |
| Operator | `operator` | `operator` |

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
