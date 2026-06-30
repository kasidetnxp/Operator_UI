# Frontend Project Requirements

## Functional Requirements

### Employee ID and Password Authentication

The frontend system shall support user workflows beginning with the entry of an employee ID and a password.

In the current phase, password authentication is required for all roles (Admin, Store, and Operator) to verify credentials and establish access control levels.

The frontend shall validate that both the employee ID and password fields are not empty before invoking the authentication API to check credentials.


### Display Language

The frontend system shall use Thai as the primary display language for the operator interface.

Common technical terms that are already used by operators, such as LOAD (คืน FPC), UNLOAD (เบิก FPC), สลับ FPC, AGV, Smart Storage, Confirm, and Complete, may remain in English, Thai, or existing shop-floor terms where appropriate to maintain familiarity and reduce confusion for production users.

### Operation Modes

The system shall support four operation modes shown on the user interface as:

- LOAD (คืน FPC)
- UNLOAD (เบิก FPC)
- สลับ FPC
- เปลี่ยน FPC (UNLOAD & LOAD)

In the current phase, the list of machines shall be a predefined configuration used by the frontend.

Each machine shall include an availability state provided by the configured data source or backend response.

Machines marked as Unavailable shall be displayed in gray, shall not be selectable by the operator, and shall not be submitted as part of a job request.

### LOAD (คืน FPC) Mode

In LOAD (คืน FPC) mode, the operator shall select the source machine from which the AGV will pick up the FPC.

The destination shall be fixed as Smart Storage in the current scope.

The frontend shall display the instruction details during the sequential safety verification flow.

The confirmation requires sequential steps:
1. When the AGV arrives at the source machine and the status changes to `waiting_tray_open`, the operator must confirm that the machine tray is open by clicking the "Confirm Tray Opened" button on the screen to proceed.
2. The AGV picks up the FPC.
3. Once the FPC is picked up and the status changes to `waiting_cover_head_install`, the operator must physically install the cover head and confirm by pressing the physical button on the AGV (which registers as "AGV physical button confirmed" automatically after a simulated 5-second delay). The screen UI will display instructions and indicate that it is waiting for physical confirmation; no screen-based bypass confirm button will be available.


### UNLOAD (เบิก FPC) Mode

In UNLOAD (เบิก FPC) mode, the operator shall be able to search for an FPC using data retrieved from the storage database through backend APIs.

The frontend shall display the search results returned by the backend.

If no matching FPC is found, the frontend shall display a no-result message.

The operator shall then select the desired FPC and an available destination machine.

Machines marked as Unavailable shall not be selectable.

After the AGV arrives at the selected destination machine and the backend reports the status indicating that operator confirmation is required, the frontend shall guide the operator through sequential safety verification steps.

The confirmation requires sequential steps:
1. When the AGV arrives at the destination machine and the status changes to `waiting_tray_open`, the operator must confirm that the machine tray is open by clicking the "Confirm Tray Opened" button on the screen to proceed.
2. The AGV places the FPC.
3. Once the FPC is placed and the status changes to `waiting_cover_head_remove`, the operator must physically remove the cover head and confirm by pressing the physical button on the AGV (which registers as "AGV physical button confirmed" automatically after a simulated 5-second delay). The screen UI will display instructions and indicate that it is waiting for physical confirmation; no screen-based bypass confirm button will be available.


### สลับ FPC Mode

In สลับ FPC mode, the operator shall select both the source machine and the destination machine so that the AGV can pick up an FPC from one machine and deliver it to another machine.

The frontend shall prevent the operator from selecting the same machine as both source and destination.

If the destination machine already has an FPC installed, the system shall support a swap-and-move workflow where the AGV first retrieves the new FPC from the source machine, then retrieves the old FPC from the destination machine, places the new FPC on the destination machine, and finally returns the old FPC back to an automatically allocated empty slot in Smart Storage. The operator interface shall dynamically display an informational banner and confirmation details listing both the FPC to load and the FPC to unload. The confirmation dialog will show the return destination as Smart Storage without displaying a specific slot number.

If operator confirmation is required during pickup or placement, the frontend shall display instructions when the backend reports the corresponding status.

The confirmation is completed by the operator pressing a physical button on the AGV machine before the workflow can continue.

### เปลี่ยน FPC (UNLOAD & LOAD) Mode

In เปลี่ยน FPC (UNLOAD & LOAD) mode, the operator shall select a new FPC from Smart Storage and select a destination machine.

The destination machine must have an FPC already installed on it. If the selected machine is empty, the frontend shall present a validation error message (e.g., "Machine does not have an FPC installed") and disable the job submission button.

When the job is submitted and starts, the AGV shall perform the following operational flow:
1. Retrieve the new FPC from Smart Storage.
2. Move to the destination machine.
3. Wait for the operator to confirm that the destination machine tray is open by clicking the "Confirm Tray Opened" button on the screen to proceed.
4. Retrieve the old FPC from the destination machine.
5. Wait for the operator to confirm physical cover head installation via the physical button on the AGV (under status `waiting_cover_head_install` with no screen bypass button).
6. Wait for the operator to confirm physical cover head removal via the physical button on the AGV (under status `waiting_cover_head_remove` with no screen bypass button).
7. Install the new FPC onto the destination machine.
8. Return to Smart Storage with the old FPC.
9. Place the old FPC into the Smart Storage slot vacated by the new FPC.

After the task transitions to the `Completed` status, the system shall swap the location records of the two FPCs in the database.

### Task Status Handling

Task statuses shall be provided by the backend via REST APIs and shall represent the status of each existing task, not the general readiness of the AGV.

The frontend shall display the latest task status received from the backend for each task.

Status codes or status values returned by the backend shall be system-defined values, while the frontend shall be responsible for displaying clear Thai operator-facing text.

The backend shall be responsible for determining and reporting the final Completed status.

The frontend shall not independently determine whether a task is complete.

### Empty Task Queue

When there are no active, queued, pending, completed, failed, or canceled tasks to display, the Task Queue page shall display an empty state such as:

```text
No Task
```

This empty state shall not be treated as a task status because it does not belong to any existing task.

### Task Cancellation

The operator shall be able to cancel any of their own active tasks from the Task Details pane.

Before the task is canceled, the frontend shall present a confirmation dialog asking the operator to confirm the cancellation (e.g., "Are you sure you want to cancel this task?").

Once confirmed, the frontend shall invoke the cancellation API to change the task status to `Canceled`. Any ongoing simulation timers or workflow progressions for this task shall be immediately halted to prevent the task from transitioning to other active or completed states.

### Task Queue Sorting and Default Selection

The Task Queue page shall list all tasks dynamically sorted according to the following rules:

1. **Active Tasks** (e.g., `submitted`, `queued`, `starting`, `moving_to_source`, etc.) shall be displayed at the top of the queue list, sorted by their creation timestamp in descending order (newest tasks first).
2. **Finished Tasks** (e.g., `completed`, `complete`, `canceled`, `failed`, `rejected`, `error`) shall be displayed at the bottom of the queue list.
3. When the Task Queue page is loaded, the detail view shall default to showing the most recently added active task (the first task in the sorted queue list).

### Standalone FPC Search Reference Page

The operator shall be able to navigate to a standalone FPC Search reference screen by clicking the "FPC Search" button in the top navigation bar.

This page is purely for reference and viewing status (view-only), and shall contain:
- A "Back" button at the top left to return the operator to the Main Menu (mode selection).
- A search query bar to search FPC items in real-time.
- Category filter tabs: ALL, Storage, Service, Deposit PM, Deposit Production.
- A table listing matching FPCs with columns: ADDRESS, FUNCTION, LABEL, COMMENT.

### Admin Panel & User Management

The system shall support an administrative console (Admin Panel / Management Panel) for system audit logging, FPC location corrections, and User Management.
- **Access Control**: Users with Admin (`admin`) or Store (`store`) roles shall land on the Admin/Management Panel upon logging in. Operators (`operator`) can access a view-only AGV log view of this panel from the header.
- **Navigation**:
  - The Admin/Management Panel shall contain a visible "Back" button (`ArrowLeft` icon button) next to the title. For all roles, clicking this back button shall navigate the user to the Main Menu (Mode Selection screen).
  - The "Main Menu" button in the header shall be removed for operators to avoid duplicate navigation pathways, relying instead on the internal back buttons of each page.
- **User Management (Admin-only)**:
  - The Admin role shall be able to view, add, delete, and edit user accounts.
  - The Edit User function shall allow modifying the role and password of existing users. The employee ID itself shall remain read-only and uneditable.
  - A user cannot delete or edit their own active account session to prevent self-lockouts.

### Supported Task Statuses

The frontend shall support the following operator-facing task statuses for tasks returned by the backend:

| Operator-facing Text | Meaning | Operator Action |
|---|---|---|
| Submitted | The system has received the job request. | Wait for backend validation and scheduling. |
| Queued | The job has been accepted and placed in the queue. | Wait for the job to start. |
| Starting | The backend is preparing the AGV mission. | Wait for the AGV to move. |
| Moving to Source | The AGV is moving to the source machine. | Wait for arrival at the source. |
| Arrived at Source | The AGV has arrived at the source machine. | Prepare to observe pickup activity if needed. |
| Picking Up FPC | The AGV is picking up the FPC. | Wait until pickup is completed. |
| Waiting for Cover Head Installation Confirmation | Pickup is complete and operator confirmation is required before the workflow can continue. | Verify that the cover head has been installed, then press the physical button on the AGV. |
| Moving to Destination | The AGV is moving to the destination location. | Wait for arrival at the destination. |
| Arrived at Destination | The AGV has arrived at the destination. | Prepare to observe placement activity if needed. |
| Placing FPC | The AGV is placing or delivering the FPC. | Wait until placement is completed. |
| Waiting for Cover Head Removal Confirmation | Placement is ready and operator confirmation is required before the workflow can continue. | Verify that the cover head has been removed, then press the physical button on the AGV. |
| Completed | The job has been completed successfully. | Review the result or create a new job. |
| Rejected | The backend did not accept the job request. | Review the input data and submit again if appropriate. |
| Blocked | The job cannot continue because of an external condition or dependency. | Check the cause or notify the responsible person. |
| Failed | The job failed during execution. | Retry the job if allowed or contact support. |
| Canceled | The job was canceled before completion. | Review the reason before creating a new job. |

Each displayed task status shall be written in operator-friendly language and should be shown together with the current step and the next required action when applicable.

For example:

- `Waiting for Cover Head Installation Confirmation` shall indicate that the operator must verify that the cover head has been installed and then press the physical button on the AGV.
- `Waiting for Cover Head Removal Confirmation` shall indicate that the operator must verify that the cover head has been removed and then press the physical button on the AGV.

### Job Queue Submission

While the AGV is executing tasks, the frontend shall still allow the operator to submit new job requests.

The backend shall be solely responsible for job queue management, scheduling, and acceptance decisions.

When a new job request is submitted, the frontend shall display the latest result returned by the backend, such as accepted, queued, rejected, or failed.

### Assigned AGV Display

For each task displayed in the Task Queue, the frontend shall show the assigned AGV information provided by the backend, such as:

- AGV ID
- AGV name
- AGV number

If an AGV has not yet been assigned, the frontend shall display a clear placeholder such as:

```text
Not assigned yet
```

The frontend shall not independently select or determine which AGV is responsible for the task.

AGV assignment shall be managed and reported by the backend.

### AGV Statuses & Edit Permissions

The system shall support four AGV status states:
- `Ok` (Normal operational state)
- `Engineering Use` (Unavailable for tasks; active tasks assigned to this AGV are blocked)
- `PM` (Preventative Maintenance; active tasks assigned to this AGV are blocked)
- `Error` (Fault state; active tasks assigned to this AGV are blocked)

Only users with the `Admin` role shall have permission to edit/change the AGV status. The Admin Panel shall feature locked-width (`210px`) dropdown selections for editing AGV statuses. Non-admin roles (Store and Operator) shall be restricted to viewing AGV statuses in the header badges.

### Button State and Error Handling

After submitting a command or confirmation, the frontend shall disable the related action button until a response is received from the backend in order to prevent duplicate requests.

If the backend returns success, the frontend shall update the displayed state based on the response.

If a backend API request fails, times out, or returns an error, the frontend shall display an appropriate error message in Thai and shall allow the operator to retry the same action when applicable.

---

## System Architecture

This system is a web-based frontend application designed for operators to control FPC pickup and delivery workflows using tablets and PC monitors.

The frontend acts as the user interface, displaying system status, receiving user input, performing basic validation, and sending commands or confirmations to the backend via REST APIs.

The backend is responsible for:

- Processing requests from the frontend
- Validating data
- Managing job queues
- Recording operation logs with employee IDs
- Coordinating with the AGV system
- Interacting with the storage database to retrieve FPC information
- Maintaining job-related data such as queue status, operation history, and operator information

The frontend does not communicate directly with the AGV system.

All robot-related commands are routed through the backend to ensure proper validation, logging, and workflow control.

The backend sends instructions to the AGV/Robot to carry out FPC pickup or delivery based on the selected workflow.

The AGV missions are preconfigured in advance.

Since the system does not require real-time robot positioning or continuous status updates, REST APIs are sufficient as the primary communication method between the frontend and backend.

As the backend provides status updates or results, the frontend presents them to the operator through:

- Confirmation buttons
- Notification messages
- Completion status indicators

Although the system mainly operates in a local environment, security remains an important consideration.

Key security and reliability measures include:

- User access control
- Data validation before sending commands
- Centralized backend validation
- Operation logging
- Proper error handling

Operators begin by entering their employee ID and selecting an operation mode.

The system supports three modes shown on the user interface as:

- LOAD (คืน FPC)
- UNLOAD (เบิก FPC)
- สลับ FPC

In สลับ FPC mode, the AGV transfers an FPC from one machine to another machine.

For some workflow steps, operator confirmation is required before the backend proceeds, such as confirming cover head installation or removal via a physical button on the AGV to ensure safe operation.

In the current scope, the Smart Storage system supports a single destination location for the LOAD (คืน FPC) workflow.

An overview of the system workflow and interactions can be seen in Figure X.X.
