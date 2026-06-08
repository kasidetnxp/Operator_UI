# FPC Management System — Project Documentation

Welcome to the **FPC Management System (NXP WT)** documentation. This application is a modern, responsive Operator User Interface designed for requesting, returning, and swapping **Front Opening Pod Carriers (FPCs)** between **Smart Storage** and factory workstations/machines via **Automated Guided Vehicles (AGVs)**.

---

## 📖 Table of Contents
1. [System Architecture](#-system-architecture)
2. [Folder Structure](#-folder-structure)
3. [Key Features & Workflows](#-key-features--workflows)
4. [Data Models & Types](#-data-models--types)
5. [Localization (Multi-language Support)](#-localization-multi-language-support)
6. [API & Simulation Layer](#-api--simulation-layer)
7. [Getting Started & Local Development](#-getting-started--local-development)

---

## 🏗️ System Architecture

The frontend is built as a single-page React application using **TypeScript** and **Vite** for fast builds. The UI is designed to be highly responsive, conforming to operator terminal standards with large, touch-friendly components.

### Technology Stack
*   **Framework**: React 18.3.1
*   **Build System**: Vite 6.x / 8.x
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4 (with CSS-based `@theme` tokens) + Vanilla CSS
*   **UI Components**: Material-UI (MUI v7) & Radix UI primitives
*   **Icons**: Lucide React
*   **Charts**: Recharts (for task queue telemetry)

---

## 📁 Folder Structure

The application adopts a feature-based organization to ensure scalability, ease of maintenance, and separation of concerns.

```text
src/
├── features/               # Feature-specific modules
│   ├── auth/               # Employee authentication & logout components
│   │   ├── components/     # EmployeeLogin, EmployeeMenu
│   │   └── index.ts        # Exports public auth features
│   ├── queue/              # Task queue monitoring & telemetry
│   │   ├── components/     # TaskQueuePage, TaskStatus
│   │   └── index.ts        # Exports queue components
│   └── workflow/           # Operator workflows & forms
│       ├── components/     # MachineSelector, ModeSelection, ReturnFPCWorkflow, RequestFPCWorkflow, SwapFPCWorkflow
│       └── index.ts        # Exports workflow components
├── shared/                 # Shared components, hooks, assets and configurations
│   ├── components/         # Reusable global components (e.g., LanguageSwitcher)
│   ├── styles/             # Application styles & custom theme definitions
│   ├── types/              # Global TypeScript interfaces & types
│   └── utils/              # Helper utilities, translations & mock API
│       ├── mockApi.ts      # Stubbed API layer & workflow simulator
│       └── translations.ts # Dual-language English/Thai translation dictionary
├── App.tsx                 # Core App layout & workspace routing state
├── main.tsx                # Application entry point
└── index.css               # Global Tailwind & Custom Stylesheet
```

---

## ✨ Key Features & Workflows

### 1. Employee Authentication
*   Operators must authenticate using a numeric/alphanumeric **Employee ID** before accessing any workflows.
*   Once logged in, the system maintains their active session.
*   Operators can log out at any time from the header menu.

### 2. Dual-Mode & Transfer Workflows
Operators can trigger three operations from the **Mode Selection** screen:

#### A. Return FPC Workflow
*   **Goal**: Pick up an empty or processed FPC from a machine and return it to **Smart Storage**.
*   **Flow**:
    1.  Select the **Source Machine** (e.g., `AVT_001` through `AVT_050`) using a real-time search filter.
    2.  Confirm and submit the job.
    3.  The AGV is dispatched to pick up the FPC and return it to Smart Storage.

#### B. Deliver/Request FPC Workflow
*   **Goal**: Request a specific FPC from **Smart Storage** and command the AGV to deliver it to a target workstation.
*   **Flow**:
    1.  Search and select an active FPC ID from Smart Storage (e.g., `FPC-2024-001`).
    2.  Select the **Destination Machine** using the machine selector.
    3.  Confirm and submit the job to dispatch the AGV.

#### C. Swap FPC Workflow
*   **Goal**: Transfer an FPC directly from a source machine to a destination machine without going through Smart Storage.
*   **Flow**:
    1.  Select the **Source Machine**.
    2.  Select the **Destination Machine** (the selected source machine is automatically disabled in this view).
    3.  Confirm and submit the job.

### 3. Task Queue & AGV Progress Tracking
The **Task Queue** displays all active and historical transport jobs. It simulates real-world interaction milestones requiring operator feedback:
1.  `queued`: Job is created and waiting for an available AGV.
2.  `in_progress`: The AGV is in transit.
3.  `arrived`: The AGV has arrived at the station.
4.  `waiting_confirmation`: The system pauses for physical operator interaction:
    *   *For Return/Swap Workflow*: Operator must confirm **Cover Head Installed** before the AGV is allowed to travel safely.
    *   *For Request/Swap Workflow*: Operator must confirm **Cover Head Removed** to complete the handover.
5.  `complete` / `error`: The job reaches its terminal state.

---

## 🗃️ Data Models & Types

All core data structures are defined in [src/shared/types/index.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/types/index.ts) and [src/shared/utils/mockApi.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/mockApi.ts):

### `Language`
Defines supported localizations:
```typescript
type Language = 'en' | 'th';
```

### `OperationMode`
Defines active workflows:
```typescript
type OperationMode = 'return' | 'request' | 'swap';
```

### `Machine`
Describes a factory machine/workstation:
```typescript
interface Machine {
  id: string;
  name: string;
  available: boolean;
}
```

### `FPCItem`
Represents an FPC stored inside Smart Storage:
```typescript
interface FPCItem {
  id: string;
  type: string;
  location: string;
}
```

### `TaskResponse`
Represents a transport job and its execution state:
```typescript
interface TaskResponse {
  taskId: string;
  jobId: string;
  status: 'queued' | 'in_progress' | 'arrived' | 'waiting_confirmation' | 'complete' | 'error';
  message: string;
  employeeId: string;
  type: 'return' | 'request' | 'swap';
  sourceMachine?: string;
  destinationMachine?: string;
  fpcId?: string;
  createdAt: string;
  coverHeadInstalledConfirmed?: boolean;
}
```

---

## 🌐 Localization (Multi-language Support)

The system supports **English (EN)** and **Thai (TH)**. All static texts, error messages, and labels are stored in a translation dictionary located at [src/shared/utils/translations.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/translations.ts).

### Adding New Strings
To add a new localized text string:
1.  Open `translations.ts`.
2.  Add the key under the `en` object.
3.  Add the corresponding Thai translation under the `th` object.
4.  Render it in the React component:
    ```typescript
    const t = translations[language];
    return <div>{t.yourNewKey}</div>;
    ```

---

## 🔌 API & Simulation Layer

The system currently runs on an in-memory **Simulation Layer** ([src/shared/utils/mockApi.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/mockApi.ts)). This file mocks real network responses with standard delays and transitions AGV statuses automatically via `setTimeout`.

### Available API Stubs
*   `searchFPC(query: string)`: Searches stored FPC units in Smart Storage.
*   `submitReturnFPCJob(employeeId, sourceMachineId)`: Initiates return transport.
*   `submitRequestFPCJob(employeeId, fpcId, destinationMachineId)`: Initiates delivery transport.
*   `submitSwapFPCJob(employeeId, sourceMachineId, destinationMachineId)`: Initiates swap transport.
*   `confirmCoverHeadInstalled(taskId)`: Submits cover head installation confirmation.
*   `confirmCoverHeadRemoved(taskId)`: Submits cover head removal confirmation.
*   `getTaskStatus(taskId)` / `getAllTasks()`: Fetches status updates.

### Production Integration
To connect this frontend to a production backend (e.g., AGV Fleet Manager API):
1.  Install an HTTP client like `axios` or use the standard `fetch` API.
2.  Replace the mock function implementations in `mockApi.ts` with HTTP calls:
    ```typescript
    export async function getAllTasks(): Promise<TaskResponse[]> {
      const response = await fetch('/api/tasks');
      return response.json();
    }
    ```
3.  Remove the `setTimeout` simulation routines.

---

## 🛠️ Getting Started & Local Development

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (v9 or higher)

### Installation
Install project dependencies:
```bash
npm install
```

### Run Local Server
Start the development server (runs on port `3000` to prevent collision with mock backend integrations):
```bash
npm run dev
```

### Linting
Validate codebase formatting and code rules:
```bash
npm run lint
```

### Production Build
Compile and optimize static assets to the `/dist` directory:
```bash
npm run build
```
