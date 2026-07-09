# Show Probe Card Name in Machine Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Probe Card (FPC) name/ID under the status badge for occupied machines in the Operator UI (machine grids) and Admin Panel (machine grid).

**Architecture:** Extend the mock API's `MachineWithState` returned from `getMachinesWithState` to associate FPC IDs with machines based on locations, add localization, and render it in `MachineSelector.tsx` and `AdminLogsPage.tsx`.

**Tech Stack:** React, TypeScript, Material UI, Tailwind CSS.

## Global Constraints
- Do not introduce unnecessary dependencies.
- Maintain existing codebase style and layout.
- Include a `// ponytail: <comment>` on lines where simplified logic is implemented.

---

### Task 1: Update API/Types Layer in mockApi.ts

**Files:**
- Modify: [mockApi.ts](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/shared/utils/mockApi.ts)

**Interfaces:**
- Consumes: None
- Produces: `MachineWithState` containing `fpcId?: string`

- [ ] **Step 1: Modify `MachineWithState` interface**
  Add optional `fpcId` field to `MachineWithState` around line 17:
  ```typescript
  export interface MachineWithState extends Machine {
    state: MachineState;
    fpcId?: string; // ponytail: store active FPC card ID for occupied machine
  }
  ```

- [ ] **Step 2: Modify `getMachinesWithState` function**
  Update the mapping inside `getMachinesWithState` around line 1041 to resolve and attach the `fpcId` corresponding to the machine's location.
  ```typescript
  export async function getMachinesWithState(): Promise<MachineWithState[]> {
    const fpcItems = await getAllFPCs();
    const activeTasks = await getAllTasks();
    return mockMachines.map(m => {
      const fpc = fpcItems.find(f => f.location === m.id);
      return {
        ...m,
        state: getMachineState(m, fpcItems, activeTasks),
        fpcId: fpc?.id // ponytail: resolve matching FPC ID
      };
    });
  }
  ```

- [ ] **Step 3: Run TypeScript compiler validation**
  Run: `npx tsc --noEmit`
  Expected: Command runs and finishes successfully with no TypeScript compilation errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/shared/utils/mockApi.ts
  git commit -m "feat: extend MachineWithState to include active fpcId"
  ```

---

### Task 2: Add Translations

**Files:**
- Modify: [translations.ts](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/shared/utils/translations.ts)

**Interfaces:**
- Consumes: None
- Produces: `translations` keys including `machineProbeLabel` for English and Thai.

- [ ] **Step 1: Add key under `en` segment**
  Modify translations for `en` (around line 235) to add `machineProbeLabel`:
  ```typescript
  machineStateOccupied: 'Has FPC',
  machineProbeLabel: 'Probe', // ponytail: English label for active probe card
  ```

- [ ] **Step 2: Add key under `th` segment**
  Modify translations for `th` (around line 487) to add `machineProbeLabel`:
  ```typescript
  machineStateOccupied: 'มี FPC',
  machineProbeLabel: 'โพรบ', // ponytail: Thai label for active probe card
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add src/shared/utils/translations.ts
  git commit -m "feat: add machineProbeLabel translation keys"
  ```

---

### Task 3: Render Probe Name in MachineSelector Component

**Files:**
- Modify: [MachineSelector.tsx](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/features/workflow/components/MachineSelector.tsx)

- [ ] **Step 1: Add rendering code for the Probe ID label**
  Modify the JSX where machine button is rendered (around line 278). Right under the status badge wrapper, render the Probe ID block if machine state is `'occupied'` and `machine.fpcId` is present:
  ```tsx
  <div
    className={`
      flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium border
      ${badgeClass}
    `}
  >
    <span className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
    <span>{labelText}</span>
  </div>
  {machine.state === 'occupied' && machine.fpcId && (
    <div className="text-base text-muted-foreground font-mono mt-1.5">
      {t.machineProbeLabel || 'Probe'}: {machine.fpcId}
    </div>
  )}
  ```

- [ ] **Step 2: Run TypeScript compiler and ESLint validation**
  Run: `npx tsc --noEmit` and `npm run lint`
  Expected: Commands run successfully with no errors.

- [ ] **Step 3: Commit**
  ```bash
  git add src/features/workflow/components/MachineSelector.tsx
  git commit -m "feat: display probe card ID in MachineSelector for occupied machines"
  ```

---

### Task 4: Render Probe Name in Admin Panel Machine Grid

**Files:**
- Modify: [AdminLogsPage.tsx](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/features/admin/components/AdminLogsPage.tsx)

- [ ] **Step 1: Add rendering code for the Probe ID label in Admin UI**
  Modify the JSX in `AdminLogsPage.tsx` where machine card items are rendered (around line 1124). Right under the status badge, render the Probe ID block if machine state is `'occupied'` and `machine.fpcId` is present:
  ```tsx
  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium border ${badgeClass}`}>
    <span className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
    <span>{labelText}</span>
  </div>
  {machine.state === 'occupied' && machine.fpcId && (
    <div className="text-base text-muted-foreground font-mono mt-1">
      {t.machineProbeLabel || 'Probe'}: {machine.fpcId}
    </div>
  )}
  ```

- [ ] **Step 2: Run build and lint verification**
  Run: `npm run build` and `npm run lint`
  Expected: Both commands compile and check successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/features/admin/components/AdminLogsPage.tsx
  git commit -m "feat: display probe card ID in Admin panel for occupied machines"
  ```
