# Design Spec: Machine Status Management & Manual Override

This specification defines the design and implementation details for updating the Machine Status system in the Operator UI. It changes machine availability status from a simple available/unavailable boolean to a dynamic 4-state engine (`Empty`, `Occupied`, `Reserved`, `Unavailable`) and provides manual override settings for Admin and Store roles.

## Goal

Provide clear, descriptive machine status information to shop-floor operators and enable managers (Admin and Store roles) to manually set machine availability status since the system cannot integrate with external status feeds. No emoji characters shall be used in UI labels, badges, or buttons; instead, color-coded CSS status indicators (dots/circles) must be used.

---

## Machine State Rules

Machines have one of four states determined dynamically:

1.  **Unavailable**: Configured manually by Admin or Store roles to be offline (Gray indicator dot).
2.  **Reserved**: Configured manually as available, but currently participating in a running (non-terminal) task as either a source or destination (Yellow/Amber indicator dot).
3.  **Occupied**: Configured manually as available, not reserved, and currently has a Front Opening Pod Carrier (FPC) placed on it (Blue indicator dot).
4.  **Empty**: Configured manually as available, not reserved, and does not have an FPC on it (Green indicator dot).

### Workflow Selection Eligibility Matrix

| Machine State | LOAD (คืน FPC)<br>*Src: Machine, Dest: Storage* | UNLOAD (เบิก FPC)<br>*Src: Storage, Dest: Machine* | สลับ FPC (Swap)<br>*Src: Machine A, Dest: Machine B* | เปลี่ยน FPC (UNLOAD & LOAD)<br>*Src: Storage, Dest: Machine* |
| :--- | :---: | :---: | :---: | :---: |
| **Empty** (Green) | ❌ (No FPC to return) | ✅ Selectable as Dest | ✅ Selectable as Dest (simple move) | ❌ (No FPC to swap out) |
| **Occupied** (Blue) | ✅ Selectable as Src | ❌ (Must be Empty first) | ✅ Selectable as Src<br>✅ Selectable as Dest (swap-and-move) | ✅ Selectable as Dest (swaps old FPC) |
| **Reserved** (Yellow) | ❌ (Disabled/Gray) | ❌ (Disabled/Gray) | ❌ (Disabled/Gray) | ❌ (Disabled/Gray) |
| **Unavailable** (Gray) | ❌ (Disabled/Gray) | ❌ (Disabled/Gray) | ❌ (Disabled/Gray) | ❌ (Disabled/Gray) |

---

## Role Permissions for Machine Control

| Action | Admin | Store | Operator |
| :--- | :---: | :---: | :---: |
| View Machine Status badges | ✅ | ✅ | ✅ |
| Toggle Availability (Available ↔ Unavailable) | ✅ | ✅ | ❌ |
| View System Audit Logs | ✅ | ✅ | ❌ |
| Add/Remove Machines (Master Configuration) | ✅ | ❌ | ❌ |

---

## Proposed Changes

### 1. Data Layer & Core Logic (`src/shared/utils/mockApi.ts`)

-   **Persistence**: Load `mockMachines` from `localStorage` (`nxp_machines`) on initialization, defaulting to the hardcoded 50 machines if not present. Save to `localStorage` whenever machine status changes.
-   **MachineState Type**:
    ```typescript
    export type MachineState = 'empty' | 'occupied' | 'reserved' | 'unavailable';
    ```
-   **Dynamic Status Engine**:
    Create a utility function to compute a machine's state dynamically:
    ```typescript
    export function getMachineState(
      machine: Machine,
      fpcItems: FPCItem[],
      activeTasks: TaskResponse[]
    ): MachineState
    ```
    State logic:
    -   If `!machine.available` $\rightarrow$ `'unavailable'` (Gray)
    -   Else if involved in any active task (status is not `'completed'`, `'complete'`, `'canceled'`, `'failed'`, `'rejected'`, `'error'`) as either `sourceMachine` or `destinationMachine` $\rightarrow$ `'reserved'` (Yellow)
    -   Else if `fpcItems.some(f => f.location === machine.id)` $\rightarrow$ `'occupied'` (Blue)
    -   Else $\rightarrow$ `'empty'` (Green)
-   **Toggle API**:
    Add `updateMachineAvailability(employeeId: string, machineId: string, available: boolean, reason?: string, comment?: string): Promise<void>` which updates the state, saves to local storage, and adds an audit log indicating the reason and comment.

### 2. Admin & Store Panel UI (`src/features/admin/components/AdminLogsPage.tsx`)

-   **Tab Navigation**:
    -   If user is `admin` or `store`, show the new **Machines** tab alongside Logs and FPC Location (User management remains admin-only).
-   **Machine Status & Management UI**:
    -   Display list of 50 machines inside a search-and-filter grid.
    -   Include filter tabs matching the FPC Search style (no emoji characters, using CSS styled indicator circles/dots):
        -   `[ ทั้งหมด (50) ]`
        -   `[ ว่าง (count) ]` (Green dot)
        -   `[ มี FPC (count) ]` (Blue dot)
        -   `[ มีงาน (count) ]` (Yellow dot)
        -   `[ ไม่พร้อม (count) ]` (Gray dot)
    -   Search bar to filter machines by Name or ID.
    -   For each machine, display:
        -   Name and ID.
        -   Calculated state badge with CSS dot color.
        -   Switch / Dropdown to change operational availability.
-   **Confirmation Dialog on Toggle**:
    -   **Enabling**: Simple confirmation dialog.
    -   **Disabling (Unavailable)**: Form dialog forcing user to:
        -   Select a reason: `PM / Maintenance` (ซ่อมบำรุงตามแผน), `Breakdown / Error` (เครื่องเสีย), `Engineering Use` (งานวิศวกรรม), `Other` (อื่น ๆ).
        -   Write a text comment.
        -   Save to localStorage and write to audit logs upon submit.

### 3. Operator Workflows UI (`src/features/workflow/components/`)

-   **Translations** (`src/shared/utils/translations.ts`):
    -   Add UI strings and states in Thai and English (e.g. `machineStateEmpty`, `machineStateOccupied`, `machineStateReserved`, `machineStateUnavailable`).
-   **Machine Selector Component** (`MachineSelector.tsx`):
    -   Receive calculated state/availability for each machine.
    -   Update buttons with state CSS colored indicator dots and text badges (no raw emojis).
    -   Implement selectability logic using a callback prop like `isMachineSelectable?: (machineId: string, state: MachineState) => boolean`.
-   **Workflow pages logic**:
    -   **LOAD (ReturnFPCWorkflow.tsx)**: Allow selection only if state is `'occupied'`.
    -   **UNLOAD (RequestFPCWorkflow.tsx)**: Allow selection only if state is `'empty'`.
    -   **สลับ FPC (MoveFPCWorkflow.tsx)**:
        -   Source selector: Allow only if state is `'occupied'`.
        -   Destination selector: Allow if state is `'empty'` or `'occupied'`.
    -   **เปลี่ยน FPC (UnloadLoadWorkflow.tsx)**: Allow selection only if state is `'occupied'`.

---

## Verification Plan

### Automated Tests
Verify that the `getMachineState` utility correctly calculates state given combinations of `available`, `fpcItems`, and `activeTasks`.

### Manual Verification
1.  **Operator workflows**:
    -   Navigate to LOAD/UNLOAD/Swap/Change pages, verify that machines are colored according to their real-time state and that only allowed machines are clickable.
2.  **Management Panel**:
    -   Log in as Store/Admin. Navigate to the new Machines tab.
    -   Verify that all 50 machines load with correct badges and colored indicator dots (CSS).
    -   Filter by states (`ทั้งหมด`, `ว่าง`, etc.) and search by machine ID.
    -   Disable a machine: Verify that a dialog pops up requiring a Reason/Comment. Confirm, check that it goes into the Audit Logs, and that the machine becomes gray/disabled in the operator workflow screens.
    -   Enable the machine back: Verify that it is restored to its dynamic state.
