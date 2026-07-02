# Design Specification: FPC Comment Editing for All Roles

Adding the ability for users of all roles (Admin, Store, Operator) to view and edit comments of FPC items directly from the "Search FPC" (ค้นหา FPC) page.

---

## 1. Problem Description

Currently, the FPC items listed in the FPC Search page show a "COMMENT" column, but this column is read-only. We want to enable editing of these comments regardless of the employee role. All modifications should be logged in the system audit logs.

---

## 2. Technical Approach

### 2.1 Backend Mock API Addition

Add `updateFPCComment` in [mockApi.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/mockApi.ts) to update the comment field in `mockFPCDatabase` and register a state change audit log.

```typescript
/** Update FPC comment */
export async function updateFPCComment(
  employeeId: string,
  fpcId: string,
  comment: string
): Promise<void> {
  await delay(300);

  const fpc = mockFPCDatabase.find(f => f.id === fpcId);
  if (!fpc) {
    throw new Error('FPC not found');
  }

  const oldComment = fpc.comment;
  fpc.comment = comment;

  addAuditLog(
    'STATE_CHANGE',
    employeeId,
    `Updated comment for FPC ${fpcId} from "${oldComment || '-'}" to "${comment || '-'}"`
  );
}
```

### 2.2 Localization Translations

Add the following translations in [translations.ts](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/shared/utils/translations.ts):

* **English (`en`)**:
  * `editComment`: `'Edit Comment'`
  * `commentPlaceholder`: `'Enter comment details...'`
  * `commentUpdatedSuccessfully`: `'Comment updated successfully'`
* **Thai (`th`)**:
  * `editComment`: `'แก้ไขความคิดเห็น'`
  * `commentPlaceholder`: `'ระบุความคิดเห็น...'`
  * `commentUpdatedSuccessfully`: `'อัปเดตความคิดเห็นสำเร็จ'`

### 2.3 Frontend UI Integration (FPCSearchPage.tsx)

Modify [FPCSearchPage.tsx](file:///c:/Users/nxg22301/Desktop/Anti_Folder/Real_Frontend_project/src/features/workflow/components/FPCSearchPage.tsx):

1. Destructure `employeeId` from `FPCSearchPageProps` and pass it down.
2. Add imports for `updateFPCComment` from `@/shared/utils/mockApi` and `Pencil` from `lucide-react`.
3. Add imports for `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` from `@mui/material`.
4. Manage state fields:
   * `editingFpc: FPCItem | null`
   * `tempComment: string`
   * `isSavingComment: boolean`
   * `showEditDialog: boolean`
   * `successMsg: string`
5. In the table's `COMMENT` cell:
   * Render the comment string.
   * Render a pencil button next to it.
   * Use CSS classes: `!min-w-[48px] !min-h-[48px]` for touch target requirements (gloved interaction).
6. Implement the edit modal (`Dialog` component):
   * Large input field (`TextField` with multiline support and generous font-size).
   * Generous spacing and clear "Save" and "Cancel" buttons.
   * On save, invoke `updateFPCComment`, update the local FPC item array to immediately reflect changes, show a success status message or update the UI, and close the dialog.

---

## 3. Verification Plan

### Manual Verification
1. Login as an operator (`operator`), click `ค้นหา FPC` (FPC Search).
2. Verify that the table displays comments.
3. Click the Pencil icon next to an FPC's comment.
4. Verify the Dialog popup opens with the current comment loaded.
5. Edit the comment and click "Save".
6. Verify the table updates immediately with the new comment.
7. Navigate to the `Audit Logs` page and confirm that a log entry of type `STATE_CHANGE` was created (e.g., "Updated comment for FPC ...").
8. Repeat steps 1-7 logging in as a `store` person and an `admin`.
