# FPC Management System — Project Documentation

Welcome to the **FPC Management System (NXP WT)** documentation. This application is a modern, responsive Operator User Interface designed for requesting, returning, swapping, and changing (UNLOAD & LOAD) **Front Opening Pod Carriers (FPCs)** between **Smart Storage** and factory workstations/machines via **Automated Guided Vehicles (AGVs)**.

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
*   **Build System**: Vite 8.x
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4 (with CSS-based `@theme` tokens) + Vanilla CSS
*   **UI Components**: Material-UI (MUI v7) & Radix UI primitives
*   **Icons**: Lucide React
*   **Charts**: Recharts (for task queue telemetry)
*   **Animation**: Motion (Framer Motion v12)
*   **Notifications**: Sonner (toast notifications)
*   **Forms**: React Hook Form
*   **Layout**: React Resizable Panels
*   **Date Utilities**: date-fns
*   **CSS Utilities**: class-variance-authority, clsx, tailwind-merge

---

## 📁 Folder Structure

The application adopts a feature-based organization to ensure scalability, ease of maintenance, and separation of concerns.

```text
src/
├── features/               # Feature-specific modules
│   ├── admin/              # Admin panel & audit log management
│   │   ├── components/     # AdminLogsPage
│   │   └── index.ts        # Exports admin features
│   ├── auth/               # Employee authentication & logout components
│   │   ├── components/     # EmployeeLogin, EmployeeMenu
│   │   └── index.ts        # Exports public auth features
│   ├── queue/              # Task queue monitoring & telemetry
│   │   ├── components/     # TaskQueuePage, TaskStatus
│   │   └── index.ts        # Exports queue components
│   └── workflow/           # Operator workflows & forms
│       ├── components/     # MachineSelector, ModeSelection, ReturnFPCWorkflow,
│       │                   # RequestFPCWorkflow, SwapFPCWorkflow, FPCSearchPage
│       └── index.ts        # Exports workflow components
├── shared/                 # Shared components, hooks, assets and configurations
│   ├── components/         # Reusable global components (currently empty)
│   ├── types/              # Global TypeScript interfaces & types
│   └── utils/              # Helper utilities, translations & mock API
│       ├── mockApi.ts      # Stubbed API layer & workflow simulator
│       └── translations.ts # Dual-language English/Thai translation dictionary
├── styles/                 # Application styles & custom theme definitions
│   ├── globals.css         # Global CSS overrides
│   ├── tailwind.css        # Tailwind CSS entry point
│   └── theme.css           # Custom @theme CSS tokens (design system core)
├── assets/                 # Static assets (images, SVGs)
├── App.tsx                 # Core App layout & workspace routing state
├── App.css                 # App-level component styles
├── main.tsx                # Application entry point
└── index.css               # Global Tailwind & Custom Stylesheet
```

---

## ✨ Key Features & Workflows

### 1. Employee Authentication
*   Operators must authenticate using an **Employee ID** and **Password** before accessing any workflows.
*   The system validates credentials against a user database and determines the user's role (Admin, Store, or Operator).
*   Once logged in, the system maintains their active session.
*   Operators can log out at any time from the header menu.

### 2. Four-Mode Transfer Workflows
Operators can trigger four operations from the **Mode Selection** screen:

#### A. LOAD (คืน FPC) — Return FPC Workflow
*   **Goal**: Pick up an empty or processed FPC from a machine and return it to **Smart Storage**.
*   **Flow**:
    1.  Select the **Source Machine** (e.g., `AVT_001` through `AVT_050`) using a real-time search filter.
    2.  Confirm and submit the job.
    3.  The AGV is dispatched to pick up the FPC and return it to Smart Storage.

#### B. UNLOAD (เบิก FPC) — Deliver/Request FPC Workflow
*   **Goal**: Request a specific FPC from **Smart Storage** and command the AGV to deliver it to a target workstation.
*   **Flow**:
    1.  Search and select an active FPC ID from Smart Storage.
    2.  Select the **Destination Machine** using the machine selector.
    3.  Confirm and submit the job to dispatch the AGV.

#### C. สลับ FPC — Swap FPC Workflow
*   **Goal**: Transfer an FPC directly from a source machine to a destination machine without going through Smart Storage.
*   **Flow**:
    1.  Select the **Source Machine**.
    2.  Select the **Destination Machine** (the selected source machine is automatically disabled in this view).
    3.  Confirm and submit the job.

#### D. เปลี่ยน FPC — Unload & Load FPC Workflow
*   **Goal**: Unload an existing FPC from a workstation and return it to Smart Storage, then load a new selected FPC from Smart Storage onto the same workstation.
*   **Flow**:
    1.  Search and select the **New FPC** from Smart Storage.
    2.  Select the **Workstation / Destination Machine** (system validates if there is a running FPC on the selected machine to be replaced).
    3.  Confirm and submit the job.

### 3. Task Queue & AGV Progress Tracking
The **Task Queue** displays all active and historical transport jobs. It simulates real-world interaction milestones requiring operator feedback:
1.  `submitted`: Job is created and waiting for backend validation.
2.  `queued`: Job has been accepted and placed in the queue.
3.  `starting`: Backend is preparing the AGV mission.
4.  `moving_to_source`: AGV is moving to the source machine.
5.  `arrived_at_source`: AGV has arrived at the source.
6.  `picking_up_fpc`: AGV is picking up the FPC.
7.  `waiting_cover_head_install`: Operator must confirm **Cover Head Installed** by pressing a physical button on the AGV machine.
8.  `moving_to_destination`: AGV is in transit to destination.
9.  `arrived_at_destination`: AGV has arrived at destination.
10. `placing_fpc`: AGV is placing the FPC.
11. `waiting_cover_head_remove`: Operator must confirm **Cover Head Removed** by pressing a physical button on the AGV machine.
12. `completed` / `failed` / `rejected` / `blocked` / `canceled` / `error`: Terminal states.

*   **Task Queue Sorting**: Active tasks (not finished) are automatically sorted by creation time (newest first) and kept at the top of the queue. Finished/completed/canceled tasks are automatically pushed to the bottom of the list.
*   **Task Cancellation**: Operators can cancel active tasks that they submitted. Prior to cancellation, the interface prompts the operator with a confirmation dialog. Once cancelled, the task's status is changed to `canceled`, and any running simulation tasks/timers for this task are stopped.

### 4. FPC Search Reference View
*   **Goal**: Provide a standalone reference screen for operators to search FPC positions and check inventory categories.
*   **Access**: Accessed via the "FPC Search" button in the top navigation bar.
*   **Filters**:
    *   `ALL`: Shows all FPCs.
    *   `Storage`: Shows FPCs stored in primary storage slots.
    *   `Service`: Shows FPCs in service stations.
    *   `Deposit PM`: Shows FPCs deposited for Preventative Maintenance.
    *   `Deposit Production`: Shows FPCs deposited for active production.
*   **Search**: Supports real-time text query filtering across Address, Function, Label, and Comment fields.
*   **Interactive behavior**: View-only mode with a "Back" button to return to the Main Menu.

### 5. Admin Panel & Audit Logs
*   **Access Control**: Users with **Admin** or **Store** roles land on the Admin/Management Panel upon logging in. Operators can access a view-only AGV log view from the header.
*   **Audit Logs**: Chronological record of all system events (logins, logouts, task submissions, state changes, confirmations, cancellations). Admins can view and clear logs.
*   **User Management (Admin-only)**: View, add, delete, and edit user accounts. The Edit function allows modifying the role and password of existing users. Employee IDs are read-only.
*   **FPC Location Corrections (Admin & Store)**: Manually override system-recorded FPC locations, move FPCs to machines or back to Smart Storage, and swap locations between two FPCs.
*   **Navigation**: The panel includes a "Back" button (ArrowLeft icon) to return to the Main Menu.

---

## 🗃️ Data Models & Types

Core data structures are defined in [src/shared/types/index.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/types/index.ts) and [src/shared/utils/mockApi.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/mockApi.ts):

### `Language`
Defines supported localizations:
```typescript
type Language = 'en' | 'th';
```

### `OperationMode`
Defines active workflows:
```typescript
type OperationMode = 'return' | 'request' | 'swap' | 'unload_load';
```

### `Page`
Defines navigable application pages:
```typescript
type Page = 'mode-selection' | 'return' | 'request' | 'swap' | 'unload_load' | 'queue' | 'fpc-search' | 'admin';
```

### `Role`
Defines user access roles:
```typescript
type Role = 'admin' | 'store' | 'operator';
```

### `UserAccount`
Represents a system user for authentication and access control:
```typescript
interface UserAccount {
  employeeId: string;
  passwordHash: string;
  role: Role;
}
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
  address: string;
  functionName: string;
  label: string;
  comment?: string;
  category: 'Storage' | 'Service' | 'Deposit PM' | 'Deposit Production';
  location: string;
}
```

### `TaskResponse`
Represents a transport job and its execution state:
```typescript
interface TaskResponse {
  taskId: string;
  jobId: string;
  status:
    | 'submitted'
    | 'queued'
    | 'starting'
    | 'moving_to_source'
    | 'arrived_at_source'
    | 'picking_up_fpc'
    | 'waiting_cover_head_install'
    | 'moving_to_destination'
    | 'arrived_at_destination'
    | 'placing_fpc'
    | 'waiting_cover_head_remove'
    | 'completed'
    | 'rejected'
    | 'blocked'
    | 'failed'
    | 'canceled'
    | 'in_progress'
    | 'arrived'
    | 'waiting_confirmation'
    | 'complete'
    | 'error';
  message: string;
  employeeId: string;
  type: 'return' | 'request' | 'swap';
  sourceMachine?: string;
  destinationMachine?: string;
  fpcId?: string;
  createdAt: string;
  coverHeadInstalledConfirmed?: boolean;
  agvId?: string;
}
```

### `AuditLog`
Represents a system audit log entry:
```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'TASK_SUBMIT' | 'STATE_CHANGE' | 'CONFIRMATION' | 'CANCEL' | 'SYSTEM';
  employeeId: string;
  message: string;
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

### Authentication APIs
*   `validateCredentials(employeeId, passwordHash)`: Validates user credentials and returns role information.

### Workflow APIs
*   `searchFPC(query: string)`: Searches stored FPC units in Smart Storage.
*   `submitReturnFPCJob(employeeId, sourceMachineId)`: Initiates return transport.
*   `submitRequestFPCJob(employeeId, fpcId, destinationMachineId)`: Initiates delivery transport.
*   `submitSwapFPCJob(employeeId, sourceMachineId, destinationMachineId)`: Initiates swap transport.
*   `confirmCoverHeadInstalled(taskId)`: Submits cover head installation confirmation (simulated via 5s delay on waiting status in frontend).
*   `confirmCoverHeadRemoved(taskId)`: Submits cover head removal confirmation (simulated via 5s delay on waiting status in frontend).
*   `cancelTask(taskId)`: Sets task status to `canceled` and halts further simulated transitions.
*   `getTaskStatus(taskId)` / `getAllTasks()`: Fetches status updates.

### FPC Location Management APIs
*   `getAllFPCs()`: Returns all FPC items from the database.
*   `updateFPCLocation(employeeId, fpcId, newLocation, newAddress)`: Manually updates an FPC's location (with slot/machine occupancy validation).
*   `swapFPCLocations(employeeId, fpcId1, fpcId2)`: Swaps the locations of two FPC items.

### Audit Log APIs
*   `addAuditLog(eventType, employeeId, message)`: Records a new audit log entry.
*   `getAuditLogs()`: Returns all audit log entries.
*   `clearAuditLogs(employeeId)`: Clears all audit logs (records the clear action itself).

### User Management APIs
*   `getUsers()` / `addUser(adminId, employeeId, passwordHash, role)` / `deleteUser(adminId, employeeId)` / `updateUser(adminId, employeeId, newPasswordHash, newRole)`: Performs operations for User Accounts database (restricted to Admin role).

### AGV System APIs
*   `getAGVSystemStatus()` / `setAGVSystemStatus(status)`: Gets/sets the global AGV system status (`'OK'` | `'ERROR'`).

### Testing Utilities
*   `initializeMockQueue()`: Optionally pre-populates the task queue for UI testing.

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

### Default Test Credentials
| Role | Employee ID | Password |
|---|---|---|
| Admin | `admin` | `admin` |
| Store | `store` | `store` |
| Operator | `operator` | `operator` |

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
