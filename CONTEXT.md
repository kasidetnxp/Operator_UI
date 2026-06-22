# FPC Management System Glossary

This glossary defines the domain terms used in the Operator User Interface for FPC transport and AGV operations.

## Language

**Cover Head**:
A protective cover/head on the FPC carrier that must be installed or removed by an operator during transport stages.

**Waiting for Cover Head Installation Confirmation**:
A status indicating that the FPC has been picked up, and the AGV is waiting for the physical button on the AGV machine to be pressed to confirm that the Cover Head has been installed.
_Avoid_: Waiting for install confirmation, Pending cover head

**Waiting for Cover Head Removal Confirmation**:
A status indicating that the FPC has arrived at the destination, and the AGV is waiting for the physical button on the AGV machine to be pressed to confirm that the Cover Head has been removed.
_Avoid_: Waiting for remove confirmation, Pending cover removal

**FPC Search**:
A reference screen used by operators to inspect FPC locations, addresses, labels, and comments. Supports filtering by storage category (Storage, Service, Deposit PM, Deposit Production) and query searching.
_Avoid_: FPC lookup, inventory view

**Admin Panel (Admin role)**:
An administrative console accessible by users with the Admin role. Provides full system control including user management (add, edit, delete accounts), audit log viewing and clearing, and manual FPC location corrections.
_Avoid_: Admin screen, configuration page

**Admin Panel (Store role)**:
A management console accessible by users with the Store role. Provides limited administrative capabilities including FPC location corrections and audit log viewing, but excludes user management operations.
_Avoid_: Store dashboard, stocker console

**Audit Logs**:
A record of chronological system events, operator actions, and AGV state transitions captured by the FPC Management System.
_Avoid_: System outputs, log files

**FPC Location**:
The current physical or logical coordinate of an FPC. It can be a slot address inside Smart Storage (along with its category) or a specific Machine (Workstation) where the FPC is currently placed. A Machine can hold at most one FPC at a time.
_Avoid_: FPC position, container coordinates

**FPC Mismatch**:
A discrepancy between the system-recorded location of an FPC and its actual physical location on the factory floor, typically caused by manual transport or swaps performed by operators without updating the system.
_Avoid_: Location error, database conflict

**Location Correction**:
An administrative action to manually override the system-recorded location of one or more FPCs. This includes moving an FPC to a machine, sending a displaced FPC back to Smart Storage, or swapping the locations of two FPCs.
_Avoid_: Manual force, database update

**Probecard ID**:
An alternative term for FPC ID used on confirmation dialogs before submit to match operator shop-floor terminology. It refers to the unique identifier of the FPC item, displayed as "Probecard ID" in English across all language modes.

**Authentication**:
The process of validating a user's credentials (Employee ID and password) at workflow entry to determine their system role (Admin, Store, or Operator) and control screen access.
_Avoid_: Log-in check, user verification

**Admin**:
A role with full control over the system, including user management, manual override of any data, viewing audit logs, and approving exception operations.
_Avoid_: Superuser, system manager

**Store**:
A role that acts as backend support for production, handling process data updates, and resolving exceptions such as FPC mismatches and manual location adjustments.
_Avoid_: Storage operator, stocker helper

**Operator**:
A role focused on executing FPC transport workflows (LOAD, UNLOAD, Swap) and interacting with active tasks.
_Avoid_: Shift worker, floor user



