# Machine Status Colors and Labels Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update machine state colors and status labels in the Operator UI and implement validation for the "Other" status reason in the admin dialog.

**Architecture:** Modify UI rendering switch cases, dropdown filter menu items, localization translations, and availability toggle form submit handlers.

**Tech Stack:** React, TypeScript, Tailwind CSS, Material UI (MUI).

## Global Constraints
- Keep lines short and clean.
- Build the minimum that works, avoiding unrequested abstractions (Ponytail Style).
- Preserve existing comments and imports unless direct adjustments are required.

---

### Task 1: Update Translations

**Files:**
- Modify: `src/shared/utils/translations.ts`

**Interfaces:**
- Consumes: Existing translation values.
- Produces: Updated translations for English (`en`) and Thai (`th`) segments.

- [ ] **Step 1: Edit translations.ts**

Update the translation keys for machineStateEmpty, machineStateOccupied, machineStateReserved, and filters/disable reasons in `src/shared/utils/translations.ts`.

Replace the lines:
```typescript
    machineTab: 'Machines',
    machineStateEmpty: 'No FPC',
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
```
with:
```typescript
    machineTab: 'Machines',
    machineStateEmpty: 'No FPC',
    machineStateOccupied: 'Has FPC',
    machineStateReserved: 'In Queue',
    machineStateUnavailable: 'Unavailable',
    confirmToggleMachineTitle: 'Set Machine to Unavailable?',
    confirmToggleMachineMessage: 'Setting {machineId} to unavailable will prevent operators from selecting this machine in any workflow.',
    confirmToggleActiveTitle: 'Set Machine to Available?',
    confirmToggleActiveMessage: 'Setting {machineId} to available will restore its dynamic state.',
    reasonLabel: 'Reason',
    reasonMaintenance: 'PM',
    reasonBreakdown: 'Breakdown / Down',
    reasonEngineering: 'Engineering Use',
    reasonOther: 'Other',
```

And update Thai translations around lines 485-498:
Replace:
```typescript
    machineTab: 'เครื่องจักร',
    machineStateEmpty: 'ไม่มี FPC',
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
```
with:
```typescript
    machineTab: 'เครื่องจักร',
    machineStateEmpty: 'ไม่มี FPC',
    machineStateOccupied: 'มี FPC',
    machineStateReserved: 'In Queue',
    machineStateUnavailable: 'ไม่พร้อมใช้งาน',
    confirmToggleMachineTitle: 'ปิดใช้งานเครื่องจักร?',
    confirmToggleMachineMessage: 'การตั้งค่า {machineId} เป็นไม่พร้อมใช้งาน จะทำให้ผู้ปฏิบัติงานไม่สามารถเลือกเครื่องนี้ in ทุก workflow ได้',
    confirmToggleActiveTitle: 'เปิดใช้งานเครื่องจักร?',
    confirmToggleActiveMessage: 'การตั้งค่า {machineId} เป็นพร้อมใช้งาน จะคืนสถานะการทำงานตามปกติของเครื่องจักร',
    reasonLabel: 'เหตุผล',
    reasonMaintenance: 'PM',
    reasonBreakdown: 'Breakdown / Down',
    reasonEngineering: 'Engineering Use',
    reasonOther: 'อื่น ๆ',
```

Also update the filter values:
Replace:
```typescript
    filterEmpty: 'No FPC',
    filterOccupied: 'Occupied',
    filterReserved: 'Reserved',
    filterUnavailable: 'Unavailable',
```
with:
```typescript
    filterEmpty: 'No FPC',
    filterOccupied: 'Has FPC',
    filterReserved: 'In Queue',
    filterUnavailable: 'Unavailable',
```
And:
```typescript
    filterEmpty: 'ไม่มี FPC',
    filterOccupied: 'มี FPC',
    filterReserved: 'มีงาน',
    filterUnavailable: 'ไม่พร้อม',
```
with:
```typescript
    filterEmpty: 'ไม่มี FPC',
    filterOccupied: 'มี FPC',
    filterReserved: 'In Queue',
    filterUnavailable: 'ไม่พร้อมใช้งาน',
```

- [ ] **Step 2: Commit translation changes**
```bash
git add src/shared/utils/translations.ts
git commit -m "feat: update status translations for machine states"
```

---

### Task 2: Update MachineSelector Component UI

**Files:**
- Modify: `src/features/workflow/components/MachineSelector.tsx`

**Interfaces:**
- Consumes: Updated translations, machine state values.
- Produces: Updated MachineSelector UI rendering colors, labels, and filter dropdown item colors.

- [ ] **Step 1: Edit MachineSelector.tsx state rendering**
Modify `switch (machine.state)` in `src/features/workflow/components/MachineSelector.tsx` around line 209 to map the new color scheme:
```typescript
            switch (machine.state) {
              case 'empty':
                badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
                dotClass = 'bg-gray-400';
                labelText = t.machineStateEmpty;
                break;
              case 'occupied':
                badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                dotClass = 'bg-emerald-500';
                labelText = t.machineStateOccupied;
                break;
              case 'reserved':
                badgeClass = 'bg-orange-50 text-orange-700 border-orange-200';
                dotClass = 'bg-orange-500';
                labelText = t.machineStateReserved;
                break;
              case 'unavailable':
              default:
                if (machine.disableReason === 'PM / Maintenance') {
                  badgeClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  dotClass = 'bg-yellow-500';
                  labelText = language === 'th' ? 'PM' : 'PM';
                } else if (machine.disableReason === 'Breakdown / Error') {
                  badgeClass = 'bg-red-50 text-red-700 border-red-200';
                  dotClass = 'bg-red-500';
                  labelText = language === 'th' ? 'Breakdown / Down' : 'Breakdown / Down';
                } else if (machine.disableReason === 'Engineering Use') {
                  badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                  dotClass = 'bg-blue-500';
                  labelText = language === 'th' ? 'Engineering Use' : 'Engineering Use';
                } else {
                  badgeClass = 'bg-gray-800 text-gray-100 border-gray-700';
                  dotClass = 'bg-gray-900';
                  labelText = language === 'th' ? 'อื่น ๆ' : 'Other';
                }
                break;
            }
```

- [ ] **Step 2: Edit filter menu items styling in MachineSelector.tsx**
Update dropdown filter dot colors and counts badge class names around lines 158-184:
- `empty` filter menu item: dot `bg-gray-400`, badge `bg-gray-100 text-gray-700`
- `occupied` filter menu item: dot `bg-emerald-500`, badge `bg-emerald-50 text-emerald-700`
- `reserved` filter menu item: dot `bg-orange-500`, badge `bg-orange-50 text-orange-700`

- [ ] **Step 3: Commit MachineSelector changes**
```bash
git add src/features/workflow/components/MachineSelector.tsx
git commit -m "feat: update MachineSelector colors, labels, and filter styling"
```

---

### Task 3: Update AdminLogsPage Component UI & Enforce Comment Validation for "Other"

**Files:**
- Modify: `src/features/admin/components/AdminLogsPage.tsx`

**Interfaces:**
- Consumes: Updated translations, machine state values.
- Produces: Updated Admin Panel machine status card rendering, filter dropdown item colors, and form validation error when reason is Other and comment is empty.

- [ ] **Step 1: Edit AdminLogsPage.tsx state rendering**
Modify `switch (machine.state)` in `src/features/admin/components/AdminLogsPage.tsx` around line 1077 to match the exact coloring and logic from Task 2.

- [ ] **Step 2: Edit filter menu items styling in AdminLogsPage.tsx**
Update dropdown filter dot colors and counts badge class names around lines 1030-1056 to match the exact coloring from Task 2.

- [ ] **Step 3: Add Validation logic in AdminLogsPage.tsx**
Update the submit handler of toggle dialog around line 1658 to enforce `toggleComment.trim()` is not empty when `toggleReason === 'other'`:
```typescript
              if (!targetMachineAvailable) {
                if (!toggleReason) {
                  setToggleError(t.reasonRequiredError);
                  return;
                }
                if (toggleReason === 'other' && !toggleComment.trim()) {
                  setToggleError(language === 'th' ? 'กรุณาระบุรายละเอียดเพิ่มเติมสำหรับเหตุผลอื่น ๆ' : 'Please provide details for the "Other" reason');
                  return;
                }
              }
```

- [ ] **Step 4: Commit AdminLogsPage changes**
```bash
git add src/features/admin/components/AdminLogsPage.tsx
git commit -m "feat: update AdminLogsPage machine state styling and enforce other comments validation"
```

---

### Task 4: Compilation and Verification

**Files:**
- Check: All modified files

- [ ] **Step 1: Run compilation build check**
Run: `npm run build`
Expected: Compilation passes successfully with no TypeScript or Vite build errors.
