# Machine Status Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dynamic machine status calculation engine, custom manual override panel in the Admin page for Admin/Store roles, validation rules in workflows, and confirmation dialogs on toggles without using raw emoji characters.

**Architecture:** Extend the mock API layer to calculate machine states dynamically and persist override config. Add a "Machines" tab in the Admin/Store panel with status indicators and search/filter controls. Update workflows to enforce target selection eligibility rules.

**Tech Stack:** React, TypeScript, Material UI (MUI), Tailwind CSS, Lucide icons, LocalStorage.

## Global Constraints

- No emoji characters shall be used in UI labels, badges, or buttons; instead, color-coded CSS status indicators (dots/circles) must be used.
- Only Admin and Store roles can toggle availability status in the Management Panel.
- Machine availability settings must persist in LocalStorage (`nxp_machines`).

---

### Task 1: Data Model and Logic Extension (`src/shared/utils/mockApi.ts`)

**Files:**
- Modify: `src/shared/utils/mockApi.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type MachineState = 'empty' | 'occupied' | 'reserved' | 'unavailable';
  export interface Machine {
    id: string;
    name: string;
    available: boolean;
  }
  export interface MachineWithState extends Machine {
    state: MachineState;
  }
  export function getMachineState(machine: Machine, fpcItems: FPCItem[], activeTasks: TaskResponse[]): MachineState;
  export function updateMachineAvailability(employeeId: string, machineId: string, available: boolean, reason?: string, comment?: string): Promise<void>;
  export function getMachinesWithState(): Promise<MachineWithState[]>;
  ```

- [ ] **Step 1: Define MachineState type**
  Open [mockApi.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/mockApi.ts) and add the `MachineState` type export next to the `Machine` interface.
  ```typescript
  export type MachineState = 'empty' | 'occupied' | 'reserved' | 'unavailable';
  export interface MachineWithState extends Machine {
    state: MachineState;
  }
  ```

- [ ] **Step 2: Add LocalStorage loading/saving for mockMachines**
  Replace the static array declaration of `mockMachines` so it initializes from `localStorage` if available.
  ```typescript
  function loadMachines(): Machine[] {
    const data = localStorage.getItem('nxp_machines');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse nxp_machines', e);
      }
    }
    const defaults = [
      { id: 'AVT_001', name: 'AVT_001', available: true },
      // ... keep AVT_001 to AVT_050 defaults ...
    ];
    localStorage.setItem('nxp_machines', JSON.stringify(defaults));
    return defaults;
  }
  export const mockMachines: Machine[] = loadMachines();
  function saveMachines(): void {
    localStorage.setItem('nxp_machines', JSON.stringify(mockMachines));
  }
  ```

- [ ] **Step 3: Implement getMachineState logic**
  Implement the function that computes a machine's state based on its config, active tasks, and FPC locations.
  ```typescript
  export function getMachineState(
    machine: Machine,
    fpcItems: FPCItem[],
    activeTasks: TaskResponse[]
  ): MachineState {
    if (!machine.available) {
      return 'unavailable';
    }
    const isReserved = activeTasks.some(task => {
      if (['completed', 'complete', 'canceled', 'failed', 'rejected', 'error'].includes(task.status)) {
        return false;
      }
      return task.sourceMachine === machine.name ||
             task.sourceMachine === machine.id ||
             task.destinationMachine === machine.name ||
             task.destinationMachine === machine.id;
    });
    if (isReserved) {
      return 'reserved';
    }
    const isOccupied = fpcItems.some(f => f.location === machine.id);
    if (isOccupied) {
      return 'occupied';
    }
    return 'empty';
  }
  ```

- [ ] **Step 4: Implement updateMachineAvailability and getMachinesWithState APIs**
  Add the status toggle API and the retrieval helper.
  ```typescript
  export async function updateMachineAvailability(
    employeeId: string,
    machineId: string,
    available: boolean,
    reason?: string,
    comment?: string
  ): Promise<void> {
    await delay(300);
    const machine = mockMachines.find(m => m.id === machineId);
    if (!machine) {
      throw new Error('Machine not found');
    }
    const oldAvailable = machine.available;
    machine.available = available;
    saveMachines();

    const stateStr = available ? 'AVAILABLE' : 'UNAVAILABLE';
    const reasonStr = reason ? `Reason: ${reason}. ` : '';
    const commentStr = comment ? `Comment: ${comment}` : '';
    addAuditLog(
      'STATE_CHANGE',
      employeeId,
      `User manually set machine ${machineId} to ${stateStr}. ${reasonStr}${commentStr}`
    );
  }

  export async function getMachinesWithState(): Promise<MachineWithState[]> {
    const fpcItems = await getAllFPCs();
    const activeTasks = await getAllTasks();
    return mockMachines.map(m => ({
      ...m,
      state: getMachineState(m, fpcItems, activeTasks)
    }));
  }
  ```

- [ ] **Step 5: Verify building and imports**
  Run: `npm run build` or inspect output logs to ensure there are no TypeScript syntax or type compilation errors.

- [ ] **Step 6: Commit**
  ```bash
  git add src/shared/utils/mockApi.ts
  git commit -m "feat: implement machine state calculation and persistence APIs"
  ```

---

### Task 2: Implement Translation Strings (`src/shared/utils/translations.ts`)

**Files:**
- Modify: `src/shared/utils/translations.ts`

- [ ] **Step 1: Add new keys for Machine Status features**
  Open [translations.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/translations.ts) and add the following keys to both `en` and `th` objects.

  For `en`:
  ```typescript
  machineTab: 'Machines',
  machineStateEmpty: 'Empty',
  machineStateOccupied: 'Occupied',
  machineStateReserved: 'Reserved',
  machineStateUnavailable: 'Unavailable',
  confirmToggleMachineTitle: 'Set Machine to Unavailable?',
  confirmToggleMachineMessage: 'Setting {machineId} to unavailable will prevent operators from selecting this machine in any workflow.',
  confirmToggleActiveTitle: 'Set Machine to Available?',
  confirmToggleActiveMessage: 'Setting {machineId} to available will restore its dynamic state.',
  reasonLabel: 'Reason',
  reasonMaintenance: 'PM / Maintenance',
  reasonBreakdown: 'Breakdown / Error',
  reasonEngineering: 'Engineering Use',
  reasonOther: 'Other',
  commentLabel: 'Additional Comments',
  commentPlaceholder: 'Type comments here...',
  reasonRequiredError: 'Please select a reason',
  confirmBtn: 'Confirm',
  cancelBtn: 'Cancel',
  filterAll: 'All',
  filterEmpty: 'Empty',
  filterOccupied: 'Occupied',
  filterReserved: 'Reserved',
  filterUnavailable: 'Unavailable',
  errorMachineHasNoFPC: 'The selected machine does not have an FPC installed.',
  errorMachineMustBeEmpty: 'The selected destination machine must be Empty.',
  errorMachineMustHaveFPC: 'The selected machine must have an FPC installed.',
  ```

  For `th`:
  ```typescript
  machineTab: 'เครื่องจักร',
  machineStateEmpty: 'ว่าง',
  machineStateOccupied: 'มี FPC',
  machineStateReserved: 'มีงาน',
  machineStateUnavailable: 'ไม่พร้อมใช้งาน',
  confirmToggleMachineTitle: 'ปิดใช้งานเครื่องจักร?',
  confirmToggleMachineMessage: 'การตั้งค่า {machineId} เป็นไม่พร้อมใช้งาน จะทำให้ผู้ปฏิบัติงานไม่สามารถเลือกเครื่องนี้ในทุก workflow ได้',
  confirmToggleActiveTitle: 'เปิดใช้งานเครื่องจักร?',
  confirmToggleActiveMessage: 'การตั้งค่า {machineId} เป็นพร้อมใช้งาน จะคืนสถานะการทำงานตามปกติของเครื่องจักร',
  reasonLabel: 'เหตุผล',
  reasonMaintenance: 'ซ่อมบำรุงตามแผน (PM / Maintenance)',
  reasonBreakdown: 'เครื่องเสีย / เกิดข้อผิดพลาด (Breakdown / Error)',
  reasonEngineering: 'งานวิศวกรรม (Engineering Use)',
  reasonOther: 'อื่น ๆ (Other)',
  commentLabel: 'รายละเอียดเพิ่มเติม',
  commentPlaceholder: 'ระบุรายละเอียดเพิ่มเติม...',
  reasonRequiredError: 'กรุณาเลือกเหตุผล',
  confirmBtn: 'ยืนยัน',
  cancelBtn: 'ยกเลิก',
  filterAll: 'ทั้งหมด',
  filterEmpty: 'ว่าง',
  filterOccupied: 'มี FPC',
  filterReserved: 'มีงาน',
  filterUnavailable: 'ไม่พร้อม',
  errorMachineHasNoFPC: 'เครื่องจักรที่เลือกไม่มี FPC ติดตั้งอยู่',
  errorMachineMustBeEmpty: 'เครื่องจักรปลายทางที่เลือกจะต้องเป็นสถานะว่าง',
  errorMachineMustHaveFPC: 'เครื่องจักรปลายทางที่เลือกจะต้องมี FPC ติดตั้งอยู่แล้ว',
  ```

- [ ] **Step 2: Verify translation syntax and commit**
  Verify the file syntax is correct, and commit.
  ```bash
  git add src/shared/utils/translations.ts
  git commit -m "feat: add localized strings for machine status override UI"
  ```

---

### Task 3: Update Workflow Selectors and Validation Rules

**Files:**
- Modify: `src/features/workflow/components/MachineSelector.tsx`
- Modify: `src/features/workflow/components/ReturnFPCWorkflow.tsx`
- Modify: `src/features/workflow/components/RequestFPCWorkflow.tsx`
- Modify: `src/features/workflow/components/MoveFPCWorkflow.tsx`
- Modify: `src/features/workflow/components/UnloadLoadWorkflow.tsx`

**Interfaces:**
- Modify `MachineSelectorProps` to:
  ```typescript
  interface MachineSelectorProps {
    machines: MachineWithState[];
    selectedMachine: string | null;
    onSelectMachine: (machineId: string) => void;
    language: Language;
    title: string;
    isMachineSelectable?: (machineId: string, state: MachineState) => boolean;
  }
  ```

- [ ] **Step 1: Update MachineSelector component**
  Open [MachineSelector.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/workflow/components/MachineSelector.tsx):
  - Replace type imports to use `MachineWithState` and `MachineState`.
  - Add `isMachineSelectable` callback to props (defaulting to checking `available === true` or equivalent).
  - Inside the button `.map()`, check `isMachineSelectable(machine.id, machine.state)` to toggle `disabled` and style.
  - Implement colored indicator circles/dots matching the state:
    - Empty: Green dot (`bg-emerald-500`)
    - Occupied: Blue dot (`bg-blue-500`)
    - Reserved: Yellow dot (`bg-amber-500`)
    - Unavailable: Gray dot (`bg-gray-400`)
  - The badge text should display `t.machineStateEmpty`, `t.machineStateOccupied`, `t.machineStateReserved`, or `t.machineStateUnavailable` from translations. No raw emojis.

- [ ] **Step 2: Update ReturnFPCWorkflow (LOAD)**
  Open [ReturnFPCWorkflow.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/workflow/components/ReturnFPCWorkflow.tsx):
  - Load machines with state dynamically.
  - Set `isMachineSelectable` callback to allow only `state === 'occupied'`.
  - Pass `machinesWithState` array to `MachineSelector`.

- [ ] **Step 3: Update RequestFPCWorkflow (UNLOAD)**
  Open [RequestFPCWorkflow.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/workflow/components/RequestFPCWorkflow.tsx):
  - Load machines with state dynamically.
  - Set `isMachineSelectable` callback to allow only `state === 'empty'`.

- [ ] **Step 4: Update MoveFPCWorkflow (Swap)**
  Open [MoveFPCWorkflow.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/workflow/components/MoveFPCWorkflow.tsx):
  - Load machines with state dynamically.
  - Source selector: Allow selection only if `state === 'occupied'`.
  - Destination selector: Allow selection if `state === 'empty'` or `state === 'occupied'`.

- [ ] **Step 5: Update UnloadLoadWorkflow (UNLOAD & LOAD)**
  Open [UnloadLoadWorkflow.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/workflow/components/UnloadLoadWorkflow.tsx):
  - Load machines with state dynamically.
  - Destination selector: Allow selection only if `state === 'occupied'`.

- [ ] **Step 6: Commit**
  ```bash
  git add src/features/workflow/components/
  git commit -m "feat: integrate MachineSelector with 4-state engine and rules"
  ```

---

### Task 4: Implement Machine Tab in Management Panel (`AdminLogsPage.tsx`)

**Files:**
- Modify: `src/features/admin/components/AdminLogsPage.tsx`

- [ ] **Step 1: Add new tab tab-rendering and toggle state**
  Open [AdminLogsPage.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/admin/components/AdminLogsPage.tsx). Add `'machines'` to the available tab states. Ensure it is rendered in the tabs headers list only if `userRole === 'admin' || userRole === 'store'` (both can view and toggle availability).

- [ ] **Step 2: Implement Machine List tab interface**
  Under `{activeTab === 'machines' && ...}`, implement:
  - Search bar to search by machine name or ID.
  - Dynamic Filter Tabs: `All`, `Empty` (Green dot), `Occupied` (Blue dot), `Reserved` (Yellow dot), `Unavailable` (Gray dot), showing counts: `ทั้งหมด (50)`, etc.
  - Grid list or table of machines.
  - For each machine, show its Name, ID, calculated State badge (CSS colored dot + localized state label), and a toggle Button/Switch to toggle availability.

- [ ] **Step 3: Implement Confirmation Dialogs**
  Add state variables and dialog components in JSX:
  - `isConfirmToggleOpen` state.
  - Selected machine toggle properties (`targetMachineId`, `nextAvailable`).
  - Reason Select field: `pm`, `breakdown`, `engineering`, `other` (forced only if setting `available = false`).
  - Comment text input.
  - Confirm / Cancel action handlers. Calling `updateMachineAvailability(...)` on submit, refetching machine states, showing a success message, and closing the dialog.

- [ ] **Step 4: Verify UI functionality and layout**
  Run: `npm run build` and check for any syntax or TS errors.

- [ ] **Step 5: Commit**
  ```bash
  git add src/features/admin/components/AdminLogsPage.tsx
  git commit -m "feat: implement Machines management tab and confirmation overrides"
  ```
