# Design Specification: Machine Status Colors and Labels Update

This document specifies the updates to the machine state colors and status labels in the Operator UI to match the requested guidelines.

## Requirements

The machine status labels and colors should be mapped as follows:

| Status | Color | Description | English Label | Thai Label |
|---|---|---|---|---|
| **empty** | ⚪ Gray | Machine is idle, no FPC | No FPC | ไม่มี FPC |
| **occupied** | 🟢 Green | Machine has FPC (ready) | Has FPC | มี FPC |
| **reserved** | 🟠 Orange | Machine is reserved in queue | In Queue | In Queue |
| **Engineering Use** | 🔵 Blue | Disabled for engineering use | Engineering Use | Engineering Use |
| **PM** | 🟡 Yellow | Disabled for PM/Maintenance | PM | PM |
| **Breakdown / Down** | 🔴 Red | Disabled due to breakdown | Breakdown / Down | Breakdown / Down |
| **Other** | ⚫ Dark Gray/Black | Disabled for other reasons (reason comment required) | Other | อื่น ๆ |

Additionally, for the "Other" status reason in the admin dialog, adding a comment description is mandatory (cannot be empty or whitespace).

## Proposed Changes

### Translations

#### [MODIFY] [translations.ts](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/shared/utils/translations.ts)

Update translation strings for both English (`en`) and Thai (`th`) segments:
* `machineStateEmpty` / `filterEmpty`: `"No FPC"` / `"ไม่มี FPC"`
* `machineStateOccupied` / `filterOccupied`: `"Has FPC"` / `"มี FPC"`
* `machineStateReserved` / `filterReserved`: `"In Queue"` / `"In Queue"`
* Modify disable reasons and labels for PM, Breakdown, Engineering Use, and Other to remove parentheses.

### User Interface Components

#### [MODIFY] [MachineSelector.tsx](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/features/workflow/components/MachineSelector.tsx)

1. **State Styling Switch Case**:
   Update `switch (machine.state)` in rendering to map colors to Tailwind classes:
   - `'empty'`: `bg-gray-100 text-gray-700 border-gray-200` with dot `bg-gray-400`
   - `'occupied'`: `bg-emerald-50 text-emerald-700 border-emerald-200` with dot `bg-emerald-500`
   - `'reserved'`: `bg-orange-50 text-orange-700 border-orange-200` with dot `bg-orange-500`
   - `'unavailable'`: Check `machine.disableReason` and map:
     - `'PM / Maintenance'`: `bg-yellow-50 text-yellow-700 border-yellow-200` with dot `bg-yellow-500`, labelText as `PM`
     - `'Breakdown / Error'`: `bg-red-50 text-red-700 border-red-200` with dot `bg-red-500`, labelText as `Breakdown / Down`
     - `'Engineering Use'`: `bg-blue-50 text-blue-700 border-blue-200` with dot `bg-blue-500`, labelText as `Engineering Use`
     - `'Other'` or fallback: `bg-gray-800 text-gray-100 border-gray-700` with dot `bg-gray-900`, labelText as `Other` (English) or `อื่น ๆ` (Thai)

2. **Filter Menu Items**:
   Update the icon dot and background badge colors in the dropdown menu filter list to match the updated states:
   - `empty`: Dot `bg-gray-400`, Badge `bg-gray-100 text-gray-700`
   - `occupied`: Dot `bg-emerald-500`, Badge `bg-emerald-50 text-emerald-700`
   - `reserved`: Dot `bg-orange-500`, Badge `bg-orange-50 text-orange-700`

#### [MODIFY] [AdminLogsPage.tsx](file:///c:/Users/kasid/OneDrive/Desktop/For_Gemini/Operator_UI/src/features/admin/components/AdminLogsPage.tsx)

1. **State Styling Switch Case**:
   Apply the exact same color mappings and status names as `MachineSelector.tsx` for consistency.

2. **Filter Menu Items**:
   Apply the exact same filter dropdown dot and badge updates as `MachineSelector.tsx`.

3. **Form Validation for "Other"**:
   Update the machine availability toggle dialog submit handler:
   - If `!targetMachineAvailable && toggleReason === 'other'`, verify `toggleComment.trim()` is not empty.
   - If empty, set the dialog error message (`setToggleError`) to `"กรุณาระบุรายละเอียดเพิ่มเติมสำหรับเหตุผลอื่น ๆ"` (for Thai) or `"Please provide details for the "Other" reason"` (for English).

## Verification Plan

### Manual Verification
1. Open the Operator workflow UI and check the color and name of available machines (No FPC = Gray, Has FPC = Green, In Queue = Orange).
2. Open the Admin Panel, select a machine, toggle it to unavailable:
   - Select "PM / Maintenance" and confirm yellow color is displayed with label "PM".
   - Select "Breakdown / Error" and confirm red color is displayed with label "Breakdown / Down".
   - Select "Engineering Use" and confirm blue color is displayed with label "Engineering Use".
   - Select "Other", leave the comment field empty, and verify that validation triggers (blocks submission and shows error).
   - Enter a comment for "Other", submit, and confirm dark gray/black color is displayed with label "อื่น ๆ" (Thai) or "Other" (English).
