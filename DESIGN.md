# Design Guidelines

This document defines the visual design system, layout paradigms, typography, color palettes, and strict interaction rules for the WT FPC Management System.

---

## 🛠️ Technology Stack
* **Framework**: React 18 + TypeScript + Vite
* **Styling**: Tailwind CSS v4 with `@theme` CSS tokens (primary styling mechanism).
* **New Components**: Radix UI primitives are preferred for all NEW components.
* **Icons**: Lucide React only. Do not mix other icon packs.
* **Legacy UI**: MUI v7 components are legacy and are being phased down. Do NOT use or recommend MUI components for new features if a Radix UI equivalent is available.
* **Charts**: Recharts (restricted strictly to task queue telemetry views).

---

## 🎨 Color Palette
The color palette represents a clean, industrial cleanroom environment. Avoid any gradient effects or high-saturation decorative colors.

### Base Colors
* **Background**: `bg-white` or `bg-zinc-50`
* **Surface Panels**: `bg-white`
* **Borders**: `border-zinc-200`
* **Text (Primary)**: `text-zinc-900`
* **Text (Secondary)**: `text-zinc-600`
* **Text (Disabled)**: `text-zinc-400`

### Semantic Status Colors
These map to the 16 backend task states:
* **Active States** (`submitted`, `queued`, `starting`, `moving_to_source`, `arrived_at_source`, `picking_up_fpc`, `moving_to_destination`, `arrived_at_destination`, `placing_fpc`) 
  → Tailwind `text-blue-600` / `bg-blue-50`
* **Action Required States** (`waiting_cover_head_install`, `waiting_cover_head_remove`) 
  → Tailwind `text-amber-600` / `bg-amber-50` / `border-amber-200` with a subtle pulse animation (`animate-pulse`)
* **Success State** (`completed`) 
  → Tailwind `text-emerald-600` / `bg-emerald-50`
* **Warning State** (`blocked`) 
  → Tailwind `text-orange-600` / `bg-orange-50`
* **Error States** (`failed`, `rejected`, `error`) 
  → Tailwind `text-red-600` / `bg-red-50`
* **Canceled State** (`canceled`) 
  → Tailwind `text-zinc-500` / `bg-zinc-100`
* **Disabled / Unavailable Machines** 
  → Tailwind `bg-zinc-100` / `text-zinc-300` / `border-zinc-200`

### Forbidden Palettes & Styles
* Gradient text backgrounds (`background-clip: text`)
* Purple-to-blue gradients or multi-color gradients
* Pastel "fintech" color schemes
* Gray text placed on top of colored backgrounds (use tinted backgrounds or full contrast)

---

## 🔤 Typography
* **Primary Font**: `'IBM Plex Sans Thai', 'Noto Sans Thai', 'Inter', system-ui, sans-serif`.
  * *Critical Rule*: Do NOT use `Inter` alone for Thai characters, as the glyphs render poorly. Always fallback or lead with Thai-optimized fonts.
* **Mono Font (for IDs/codes)**: `'JetBrains Mono', 'IBM Plex Mono', monospace`.
* **Sizing (Base Body)**: 
  * Tablet: `16px` (for gloved reading and ease of access)
  * PC: `14px`
* **Numerals**: Use `tabular-nums` class on numeric tables and status readouts to avoid text shifting during simulation transitions.

---

## 📐 Spacing & Touch Targets
* **Minimum Touch Target**: `48px` × `48px` (strict requirement for operators wearing industrial gloves).
* **Form Inputs & Buttons**: Minimum height of `48px` on tablet views.
* **Spacing Scale**: Tailwind's default 4px base (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px, etc.).
* **Density**: Moderate-to-comfortable spacing density. Avoid the packed, highly compact look of traditional admin grids to minimize accidental taps on physical screens.

---

## 🏗️ Layout Patterns
* **Mode Selection Screen**: Four large, equal-weight tiles (LOAD, UNLOAD, สลับ FPC, เปลี่ยน FPC) displayed centrally.
* **Task Queue**: Two-pane list+detail layout (List on the left pane, Selected Task details on the right pane).
* **Header / Navigation Bar**: Includes the company logo, a link button to FPC Search, and a role-aware employee profile dropdown.
* **Header Constraints**: Operators (Employee ID `operator` / role Operator) must NOT have a "Main Menu" button in the header. They rely solely on the sub-page's internal back button to return.
* **Sub-page Navigation**: Every sub-page must feature a prominent Back button (ArrowLeft icon) in the top-left corner leading back to the Mode Selection screen.
* **Form Workflows**: Vertical stack format, displaying step-by-step progress with generous spacing.
* **Data Tables**: Sticky headers, no zebra striping, with hover row highlights only.
* **Empty States**: Neutral icon + short Thai text (e.g. "No Task" in the task queue when empty). Do not use cartoonish illustrations.

---

## 🛡️ Critical Domain & Interaction Rules

### 1. Confirmation Instruction Pattern (Safety-Critical)
When a task status is `waiting_cover_head_install` or `waiting_cover_head_remove`, the right detail pane must display a high-prominence amber instruction card. 
* **CRITICAL**: The UI card must NOT contain any clickable "Confirm" or "Complete" buttons. Operators confirm the action strictly by pressing the physical buttons mounted on the AGV machine. The web interface serves purely to display instructions and read the status updates reported by the backend.

### 2. Machine Selection Availability
Machines with `available: false` must be displayed in `zinc-300`, must be unselectable/unclickable, and must never be included in the form payload submitted to the backend.

### 3. Swap Mode Constraints
The same machine cannot be selected as both the source and the destination in Swap (สลับ FPC) mode. Once a source machine is selected, that machine must be visually disabled and locked out in the destination dropdown/selector.

### 4. Status Translation & Color Codes
All 16 statuses must correspond to specific icons, colors, and Thai translations as defined in the translations dictionary. The frontend must never independently declare a task "Completed" or "Failed" — it must read this status directly from the backend.

### 5. Role-based Landing Pages
Upon authentication, the user is redirected based on credentials:
* **Admin (`admin`) & Store (`store`)** → Lands directly on the Admin Panel / Management Panel.
* **Operator (`operator`)** → Lands directly on the Mode Selection screen.

### 6. Duplicate Submission Prevention
Disable all submit buttons immediately upon click, keeping them disabled until a success/error response is returned by the backend. If an API call fails, display a clear Thai error notification and re-enable the action button to allow retries.

### 7. Task Queue Sorting Rule
1. Active tasks (non-terminal) are sorted by `createdAt` in descending order (newest first) at the top.
2. Finished tasks (`completed`, `canceled`, `failed`, `rejected`, `error`) are pushed to the bottom.
3. Upon page load, the detail view defaults to the newest active task (the first item in the sorted list).

### 8. AGV Telemetry Display
Display the backend-reported AGV details (AGV ID, AGV name, AGV number). If an AGV has not been scheduled yet, display "Not assigned yet" (หรือ "ยังไม่ได้ระบุ AGV" ในภาษาไทย). The frontend must never mock or self-assign AGV IDs.

---

## 🌐 Localization & Terminology
Primary language: **Thai (TH)**, Secondary language: **English (EN)**.
* Translation strings must live in `src/shared/utils/translations.ts`.
* Permitted English shop-floor terms: `LOAD`, `UNLOAD`, `FPC`, `AGV`, `Smart Storage`, `Confirm`, `Complete`.
* Standardized operation names:
  * `"LOAD (คืน FPC)"`
  * `"UNLOAD (เบิก FPC)"`
  * `"สลับ FPC"`
  * `"เปลี่ยน FPC (UNLOAD & LOAD)"`
