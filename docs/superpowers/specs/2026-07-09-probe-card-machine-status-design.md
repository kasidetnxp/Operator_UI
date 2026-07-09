# Design Specification: Show Probe Card (FPC) Name in Machine Status

This document specifies the design for displaying the Probe Card (FPC) name in the machine status view within the Operator UI, allowing operators to see immediately which Probe is currently installed on which machine.

## User Review Required

> [!NOTE]
> The Probe Card name will be displayed as a separate, distinct text label directly under the machine status badge when the machine is occupied (i.e., state is `occupied`).

## Proposed Changes

### Data Layer
#### [MODIFY] [mockApi.ts](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/shared/utils/mockApi.ts)
* Extend `MachineWithState` interface to include optional `fpcId?: string` property.
* In `getMachinesWithState`, fetch all FPC items, find the FPC residing on each machine, and populate `fpcId`:
  ```typescript
  export async function getMachinesWithState(): Promise<MachineWithState[]> {
    const fpcItems = await getAllFPCs();
    const activeTasks = await getAllTasks();
    return mockMachines.map(m => {
      const fpc = fpcItems.find(f => f.location === m.id);
      return {
        ...m,
        state: getMachineState(m, fpcItems, activeTasks),
        fpcId: fpc?.id
      };
    });
  }
  ```

### Translations
#### [MODIFY] [translations.ts](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/shared/utils/translations.ts)
* Add `machineProbeLabel` key:
  * English (`en`): `'FPC'`
  * Thai (`th`): `'FPC'`

### User Interface Components
#### [MODIFY] [MachineSelector.tsx](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/features/workflow/components/MachineSelector.tsx)
* Render a text block for the Probe Card name below the status badge if the machine state is `occupied` and `fpcId` is available.
  ```tsx
  {machine.state === 'occupied' && machine.fpcId && (
    <div className="text-base text-muted-foreground font-mono mt-1">
      {t.machineProbeLabel}: {machine.fpcId}
    </div>
  )}
  ```

#### [MODIFY] [AdminLogsPage.tsx](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/features/admin/components/AdminLogsPage.tsx)
* Render the exact same label logic below the status badge inside the machine list items in the admin card view:
  ```tsx
  {machine.state === 'occupied' && machine.fpcId && (
    <div className="text-base text-muted-foreground font-mono mt-1">
      {t.machineProbeLabel}: {machine.fpcId}
    </div>
  )}
  ```

## Verification Plan

### Manual Verification
1. Run the local development server (`npm run dev`).
2. Verify in the Operator UI (under any workflow like Request, Return, or Move FPC) that machines with FPCs (occupied state) display their Probe name (e.g. `โพรบ: 2IE075TV001B` / `Probe: 2IE075TV001B`) directly under the status badge.
3. Verify on the Admin Panel page under the "Machines" tab that occupied machines similarly show their Probe card ID.
