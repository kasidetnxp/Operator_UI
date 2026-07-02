# FPC Comment Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable all user roles to edit FPC comments on the FPC Search page, logging the edits in audit logs.

**Architecture:** Add a mock API function `updateFPCComment` that updates comments and writes to audit logs. Connect this API to a new MUI Dialog in `FPCSearchPage` triggered by a 48x48px Pencil button.

**Tech Stack:** React, TypeScript, Material UI (MUI v7), Lucide Icons, Tailwind CSS.

## Global Constraints
- Every clickable area must accommodate gloved operators, ensuring at least 48px × 48px touch target clearance.
- Primary language is Thai (TH), secondary is English (EN).
- No console logs or placeholders.
- Maintain type safety; verify with compilation checks.

---

### Task 1: API and Translations Implementation

**Files:**
- Modify: `src/shared/utils/mockApi.ts:549-550` (or search for `searchFPC` function)
- Modify: `src/shared/utils/translations.ts:53-54` and `src/shared/utils/translations.ts:273-274` (or search for `comment: 'COMMENT'`)

**Interfaces:**
- Produces: `updateFPCComment(employeeId: string, fpcId: string, comment: string): Promise<void>`

- [ ] **Step 1: Implement updateFPCComment in mockApi.ts**
  Add the following code block above `searchFPC` function:
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

- [ ] **Step 2: Add translation keys in translations.ts**
  Modify the `en` object (under `comment` key) and `th` object (under `comment` key) to add translations for edit dialog:
  In `en`:
  ```typescript
      comment: 'COMMENT',
      editComment: 'Edit Comment',
      commentPlaceholder: 'Enter comment details...',
      commentUpdatedSuccessfully: 'Comment updated successfully',
  ```
  In `th`:
  ```typescript
      comment: 'COMMENT',
      editComment: 'แก้ไขความคิดเห็น',
      commentPlaceholder: 'ระบุความคิดเห็น...',
      commentUpdatedSuccessfully: 'อัปเดตความคิดเห็นสำเร็จ',
  ```

- [ ] **Step 3: Run TypeScript compiler check**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/shared/utils/mockApi.ts src/shared/utils/translations.ts
  git commit -m "feat: add updateFPCComment API and edit comment translations"
  ```

---

### Task 2: FPCSearchPage Integration

**Files:**
- Modify: `src/features/workflow/components/FPCSearchPage.tsx`

**Interfaces:**
- Consumes: `employeeId` from `FPCSearchPageProps`
- Consumes: `updateFPCComment` from `@/shared/utils/mockApi`

- [ ] **Step 1: Extract employeeId and import Pencil/MUI Dialog**
  Update imports and component props in `src/features/workflow/components/FPCSearchPage.tsx`:
  - Add `Pencil` to `lucide-react` import.
  - Add `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` to `@mui/material` import.
  - Import `updateFPCComment` from `@/shared/utils/mockApi`.
  - Extract `employeeId` in the `FPCSearchPage` argument destructuring.

- [ ] **Step 2: Define modal states and edit handler**
  Add state definitions inside `FPCSearchPage`:
  ```typescript
  const [editingFpc, setEditingFpc] = useState<FPCItem | null>(null);
  const [tempComment, setTempComment] = useState('');
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [saveError, setSaveError] = useState('');
  ```
  Implement the save handler:
  ```typescript
  const handleSaveComment = async () => {
    if (!editingFpc) return;
    setIsSavingComment(true);
    setSaveError('');
    try {
      await updateFPCComment(employeeId, editingFpc.id, tempComment);
      // Update local state instantly
      setAllFPCItems(prev =>
        prev.map(item =>
          item.id === editingFpc.id ? { ...item, comment: tempComment } : item
        )
      );
      setEditingFpc(null);
    } catch (err) {
      console.error(err);
      setSaveError(language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' : 'Failed to save comment');
    } finally {
      setIsSavingComment(false);
    }
  };
  ```

- [ ] **Step 3: Render Pencil button in Comment column cell**
  Change the TableCell rendering for comment in `FPCSearchPage.tsx`:
  ```typescript
  <TableCell className="!text-xl !py-5 !pr-8 text-muted-foreground">
    <div className="flex items-center justify-between gap-4 group">
      <span className="truncate max-w-[200px] sm:max-w-none">{fpc.comment || '-'}</span>
      <Button
        onClick={() => {
          setEditingFpc(fpc);
          setTempComment(fpc.comment || '');
        }}
        size="small"
        className="!min-w-[48px] !min-h-[48px] !p-0 !text-info hover:!bg-info/10"
        aria-label={t.editComment}
      >
        <Pencil className="w-5 h-5" />
      </Button>
    </div>
  </TableCell>
  ```

- [ ] **Step 4: Render Edit Dialog Modal overlay**
  Add the Dialog code at the bottom of the component inside the outer return `div`:
  ```typescript
  <Dialog
    open={editingFpc !== null}
    onClose={() => !isSavingComment && setEditingFpc(null)}
    maxWidth="sm"
    fullWidth
    PaperProps={{ className: '!p-6 !bg-card !text-foreground rounded-lg border border-border' }}
  >
    <DialogTitle className="!text-3xl !font-bold !pb-4">
      {t.editComment} ({editingFpc?.label})
    </DialogTitle>
    <DialogContent className="!py-4">
      <div className="space-y-4">
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={t.commentPlaceholder}
          value={tempComment}
          onChange={(e) => setTempComment(e.target.value)}
          variant="outlined"
          disabled={isSavingComment}
          inputProps={{
            style: { fontSize: '1.25rem', lineHeight: '1.75rem' },
            maxLength: 200,
            'aria-label': t.editComment
          }}
        />
        {saveError && (
          <Alert severity="error" className="!text-lg">
            {saveError}
          </Alert>
        )}
      </div>
    </DialogContent>
    <DialogActions className="!p-4 !pt-2 gap-4">
      <Button
        onClick={() => setEditingFpc(null)}
        variant="outlined"
        disabled={isSavingComment}
        className="!py-4 !px-8 !text-xl !min-w-[120px] !min-h-[48px]"
      >
        {t.cancel}
      </Button>
      <Button
        onClick={handleSaveComment}
        variant="contained"
        disabled={isSavingComment}
        className="!py-4 !px-8 !text-xl !min-w-[120px] !min-h-[48px]"
      >
        {isSavingComment ? t.processing : t.save}
      </Button>
    </DialogActions>
  </Dialog>
  ```

- [ ] **Step 5: Run TypeScript compiler check**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 6: Commit changes**
  ```bash
  git add src/features/workflow/components/FPCSearchPage.tsx
  git commit -m "feat: integrate Edit Comment Dialog in FPCSearchPage"
  ```
