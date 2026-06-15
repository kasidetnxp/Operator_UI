// ─────────────────────────────────────────────
// Mock API — Static data stub layer
// Replace these functions with real API calls
// when connecting to the backend.
// ─────────────────────────────────────────────

export interface Machine {
  id: string;
  name: string;
  available: boolean;
}

export interface FPCItem {
  id: string;
  type: string;
  location: string;
}

export interface TaskResponse {
  taskId: string;
  jobId: string;
  status:
    | 'submitted'
    | 'queued'
    | 'starting'
    | 'moving_to_source'
    | 'arrived_at_source'
    | 'picking_up_fpc'
    | 'waiting_cover_head_install'
    | 'moving_to_destination'
    | 'arrived_at_destination'
    | 'placing_fpc'
    | 'waiting_cover_head_remove'
    | 'completed'
    | 'rejected'
    | 'blocked'
    | 'failed'
    | 'canceled'
    | 'in_progress'
    | 'arrived'
    | 'waiting_confirmation'
    | 'complete'
    | 'error';
  message: string;
  employeeId: string;
  type: 'return' | 'request' | 'swap';
  sourceMachine?: string;
  destinationMachine?: string;
  fpcId?: string;
  createdAt: string;
  coverHeadInstalledConfirmed?: boolean;
}

// In-memory task queue (replace with API call)
const mockTaskQueue: TaskResponse[] = [];

// ─── Mock Machine Data (50 machines) ───
export const mockMachines: Machine[] = [
  { id: 'AVT_001', name: 'AVT_001', available: true },
  { id: 'AVT_002', name: 'AVT_002', available: true },
  { id: 'AVT_003', name: 'AVT_003', available: false },
  { id: 'AVT_004', name: 'AVT_004', available: true },
  { id: 'AVT_005', name: 'AVT_005', available: true },
  { id: 'AVT_006', name: 'AVT_006', available: false },
  { id: 'AVT_007', name: 'AVT_007', available: true },
  { id: 'AVT_008', name: 'AVT_008', available: true },
  { id: 'AVT_009', name: 'AVT_009', available: true },
  { id: 'AVT_010', name: 'AVT_010', available: false },
  { id: 'AVT_011', name: 'AVT_011', available: true },
  { id: 'AVT_012', name: 'AVT_012', available: true },
  { id: 'AVT_013', name: 'AVT_013', available: true },
  { id: 'AVT_014', name: 'AVT_014', available: false },
  { id: 'AVT_015', name: 'AVT_015', available: true },
  { id: 'AVT_016', name: 'AVT_016', available: true },
  { id: 'AVT_017', name: 'AVT_017', available: true },
  { id: 'AVT_018', name: 'AVT_018', available: true },
  { id: 'AVT_019', name: 'AVT_019', available: false },
  { id: 'AVT_020', name: 'AVT_020', available: true },
  { id: 'AVT_021', name: 'AVT_021', available: true },
  { id: 'AVT_022', name: 'AVT_022', available: true },
  { id: 'AVT_023', name: 'AVT_023', available: false },
  { id: 'AVT_024', name: 'AVT_024', available: true },
  { id: 'AVT_025', name: 'AVT_025', available: true },
  { id: 'AVT_026', name: 'AVT_026', available: true },
  { id: 'AVT_027', name: 'AVT_027', available: false },
  { id: 'AVT_028', name: 'AVT_028', available: true },
  { id: 'AVT_029', name: 'AVT_029', available: true },
  { id: 'AVT_030', name: 'AVT_030', available: true },
  { id: 'AVT_031', name: 'AVT_031', available: false },
  { id: 'AVT_032', name: 'AVT_032', available: true },
  { id: 'AVT_033', name: 'AVT_033', available: true },
  { id: 'AVT_034', name: 'AVT_034', available: true },
  { id: 'AVT_035', name: 'AVT_035', available: true },
  { id: 'AVT_036', name: 'AVT_036', available: false },
  { id: 'AVT_037', name: 'AVT_037', available: true },
  { id: 'AVT_038', name: 'AVT_038', available: true },
  { id: 'AVT_039', name: 'AVT_039', available: true },
  { id: 'AVT_040', name: 'AVT_040', available: false },
  { id: 'AVT_041', name: 'AVT_041', available: true },
  { id: 'AVT_042', name: 'AVT_042', available: true },
  { id: 'AVT_043', name: 'AVT_043', available: true },
  { id: 'AVT_044', name: 'AVT_044', available: true },
  { id: 'AVT_045', name: 'AVT_045', available: false },
  { id: 'AVT_046', name: 'AVT_046', available: true },
  { id: 'AVT_047', name: 'AVT_047', available: true },
  { id: 'AVT_048', name: 'AVT_048', available: true },
  { id: 'AVT_049', name: 'AVT_049', available: true },
  { id: 'AVT_050', name: 'AVT_050', available: false },
];

// ─── Mock FPC Database ───
const mockFPCDatabase: FPCItem[] = [
  { id: 'FPC-2024-001', type: 'Type A', location: 'Smart Storage - A1' },
  { id: 'FPC-2024-002', type: 'Type B', location: 'Smart Storage - A2' },
  { id: 'FPC-2024-003', type: 'Type A', location: 'Smart Storage - B1' },
  { id: 'FPC-2024-004', type: 'Type C', location: 'Smart Storage - B2' },
  { id: 'FPC-2024-005', type: 'Type B', location: 'Smart Storage - C1' },
  { id: 'FPC-2024-006', type: 'Type A', location: 'Smart Storage - C2' },
  { id: 'FPC-2024-007', type: 'Type C', location: 'Smart Storage - D1' },
  { id: 'FPC-2024-008', type: 'Type B', location: 'Smart Storage - D2' },
  { id: 'FPC-2025-001', type: 'Type A', location: 'Smart Storage - E1' },
  { id: 'FPC-2025-002', type: 'Type C', location: 'Smart Storage - E2' },
];

// Simulate network delay (remove when connecting to real API)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique Job ID
function generateJobId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `JOB-${timestamp}-${random}`;
}

// ─── API Functions (stub — replace with real fetch/axios calls) ───

/** Search FPC items by query string */
export async function searchFPC(query: string): Promise<FPCItem[]> {
  await delay(800);
  const lowerQuery = query.toLowerCase();
  return mockFPCDatabase.filter(
    fpc =>
      fpc.id.toLowerCase().includes(lowerQuery) ||
      fpc.type.toLowerCase().includes(lowerQuery) ||
      fpc.location.toLowerCase().includes(lowerQuery)
  );
}

/** Submit a Return FPC job */
export async function submitReturnFPCJob(
  employeeId: string,
  sourceMachineId: string
): Promise<TaskResponse> {
  await delay(1000);

  const taskId = `TASK-${Date.now()}`;
  const jobId = generateJobId();
  const machine = mockMachines.find(m => m.id === sourceMachineId);

  const task: TaskResponse = {
    taskId,
    jobId,
    status: 'submitted',
    message: 'Job submitted successfully',
    employeeId,
    type: 'return',
    sourceMachine: machine?.name || sourceMachineId,
    destinationMachine: 'Smart Storage',
    createdAt: new Date().toISOString(),
  };

  mockTaskQueue.push(task);

  // Detailed status progression
  setTimeout(() => updateTaskStatus(taskId, 'queued'), 1500);
  setTimeout(() => updateTaskStatus(taskId, 'starting'), 4000);
  setTimeout(() => updateTaskStatus(taskId, 'moving_to_source'), 7000);
  setTimeout(() => updateTaskStatus(taskId, 'arrived_at_source'), 11000);
  setTimeout(() => updateTaskStatus(taskId, 'picking_up_fpc'), 14500);
  setTimeout(() => updateTaskStatus(taskId, 'waiting_cover_head_install'), 18000);

  return task;
}

/** Submit a Request FPC job */
export async function submitRequestFPCJob(
  employeeId: string,
  fpcId: string,
  destinationMachineId: string
): Promise<TaskResponse> {
  await delay(1000);

  const taskId = `TASK-${Date.now()}`;
  const jobId = generateJobId();
  const machine = mockMachines.find(m => m.id === destinationMachineId);

  const task: TaskResponse = {
    taskId,
    jobId,
    status: 'submitted',
    message: 'Job submitted successfully',
    employeeId,
    type: 'request',
    sourceMachine: 'Smart Storage',
    destinationMachine: machine?.name || destinationMachineId,
    fpcId,
    createdAt: new Date().toISOString(),
  };

  mockTaskQueue.push(task);

  // Detailed status progression
  setTimeout(() => updateTaskStatus(taskId, 'queued'), 1500);
  setTimeout(() => updateTaskStatus(taskId, 'starting'), 4000);
  setTimeout(() => updateTaskStatus(taskId, 'moving_to_source'), 7000);
  setTimeout(() => updateTaskStatus(taskId, 'arrived_at_source'), 11000);
  setTimeout(() => updateTaskStatus(taskId, 'picking_up_fpc'), 14500);
  setTimeout(() => updateTaskStatus(taskId, 'moving_to_destination'), 18000);
  setTimeout(() => updateTaskStatus(taskId, 'arrived_at_destination'), 22000);
  setTimeout(() => updateTaskStatus(taskId, 'placing_fpc'), 25500);
  setTimeout(() => updateTaskStatus(taskId, 'waiting_cover_head_remove'), 29000);

  return task;
}

/** Submit a Swap FPC job */
export async function submitSwapFPCJob(
  employeeId: string,
  sourceMachineId: string,
  destinationMachineId: string
): Promise<TaskResponse> {
  await delay(1000);

  const taskId = `TASK-${Date.now()}`;
  const jobId = generateJobId();
  const srcMachine = mockMachines.find(m => m.id === sourceMachineId);
  const destMachine = mockMachines.find(m => m.id === destinationMachineId);

  const task: TaskResponse = {
    taskId,
    jobId,
    status: 'submitted',
    message: 'Job submitted successfully',
    employeeId,
    type: 'swap',
    sourceMachine: srcMachine?.name || sourceMachineId,
    destinationMachine: destMachine?.name || destinationMachineId,
    createdAt: new Date().toISOString(),
    coverHeadInstalledConfirmed: false,
  };

  mockTaskQueue.push(task);

  // Detailed status progression
  setTimeout(() => updateTaskStatus(taskId, 'queued'), 1500);
  setTimeout(() => updateTaskStatus(taskId, 'starting'), 4000);
  setTimeout(() => updateTaskStatus(taskId, 'moving_to_source'), 7000);
  setTimeout(() => updateTaskStatus(taskId, 'arrived_at_source'), 11000);
  setTimeout(() => updateTaskStatus(taskId, 'picking_up_fpc'), 14500);
  setTimeout(() => updateTaskStatus(taskId, 'waiting_cover_head_install'), 18000);

  return task;
}

/** Confirm Cover Head installed (Return FPC workflow step, or Swap first stage) */
export async function confirmCoverHeadInstalled(taskId: string): Promise<TaskResponse> {
  await delay(500);
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    if (task.type === 'swap') {
      task.coverHeadInstalledConfirmed = true;
      task.status = 'moving_to_destination';
      task.message = 'Cover Head installation confirmed, AGV proceeding to destination';

      // Simulate transit to destination machine
      setTimeout(() => updateTaskStatus(taskId, 'arrived_at_destination'), 3000);
      setTimeout(() => updateTaskStatus(taskId, 'placing_fpc'), 6500);
      setTimeout(() => updateTaskStatus(taskId, 'waiting_cover_head_remove'), 10000);
    } else {
      task.status = 'moving_to_destination';
      task.message = 'Cover Head installation confirmed, AGV proceeding to Smart Storage';

      // Simulate transit to Smart Storage
      setTimeout(() => updateTaskStatus(taskId, 'arrived_at_destination'), 3000);
      setTimeout(() => updateTaskStatus(taskId, 'placing_fpc'), 6500);
      setTimeout(() => updateTaskStatus(taskId, 'completed'), 10000);
    }
  }
  return task || {
    taskId,
    jobId: 'UNKNOWN',
    status: 'completed',
    message: 'Cover Head installation confirmed, AGV proceeding',
    employeeId: '',
    type: 'return',
    createdAt: new Date().toISOString(),
  };
}

/** Confirm Cover Head removed (Request FPC workflow step, or Swap second stage) */
export async function confirmCoverHeadRemoved(taskId: string): Promise<TaskResponse> {
  await delay(500);
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    task.status = 'completed';
    task.message = 'Cover Head removal confirmed, job completed';
  }
  return task || {
    taskId,
    jobId: 'UNKNOWN',
    status: 'completed',
    message: 'Cover Head removal confirmed, AGV proceeding',
    employeeId: '',
    type: 'request',
    createdAt: new Date().toISOString(),
  };
}

/** Get task status by ID */
export async function getTaskStatus(taskId: string): Promise<TaskResponse | null> {
  await delay(300);
  return mockTaskQueue.find(t => t.taskId === taskId) || null;
}

/** Get all tasks in the queue */
export async function getAllTasks(): Promise<TaskResponse[]> {
  await delay(300);
  return [...mockTaskQueue];
}

/** Update task status in-memory */
export function updateTaskStatus(taskId: string, status: TaskResponse['status']): void {
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    task.status = status;

    // Simulate AGV physical button confirmation after 5 seconds
    if (status === 'waiting_cover_head_install') {
      setTimeout(() => {
        confirmCoverHeadInstalled(taskId);
      }, 5000);
    } else if (status === 'waiting_cover_head_remove') {
      setTimeout(() => {
        confirmCoverHeadRemoved(taskId);
      }, 5000);
    }
  }
}

/** Optionally pre-populate queue for testing */
export function initializeMockQueue(): void {
  // Add sample tasks here for UI testing if needed
}
