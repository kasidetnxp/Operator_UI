// ─────────────────────────────────────────────
// Mock API — Static data stub layer
// Replace these functions with real API calls
// when connecting to the backend.
// ─────────────────────────────────────────────

export type MachineState = 'empty' | 'occupied' | 'reserved' | 'unavailable';

export interface Machine {
  id: string;
  name: string;
  available: boolean;
  disableReason?: string;
  disableComment?: string;
}

export interface MachineWithState extends Machine {
  state: MachineState;
}

export interface FPCItem {
  id: string;
  address: string;
  functionName: string;
  label: string;
  comment?: string;
  category: 'Storage' | 'Service' | 'Deposit PM' | 'Deposit Production';
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
  | 'waiting_tray_open'
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
  type: 'return' | 'request' | 'move' | 'unload_load';
  sourceMachine?: string;
  destinationMachine?: string;
  fpcId?: string;
  createdAt: string;
  coverHeadInstalledConfirmed?: boolean;
  agvId?: string;
  currentStepIndex?: number;
  trayOpenedConfirmed?: boolean;
  coverHeadPhysicalConfirmed?: boolean;
  isOccupiedMove?: boolean;
  oldFpcId?: string;
}

// In-memory task queue (replace with API call)
const mockTaskQueue: TaskResponse[] = [];

import type { Role, UserAccount } from '@/shared/types';

// Default mock users
const DEFAULT_USERS: UserAccount[] = [
  {
    employeeId: import.meta.env.VITE_MOCK_ADMIN_ID || 'admin',
    passwordHash: import.meta.env.VITE_MOCK_ADMIN_PASSWORD || 'admin',
    role: 'admin'
  },
  {
    employeeId: import.meta.env.VITE_MOCK_STORE_ID || 'store',
    passwordHash: import.meta.env.VITE_MOCK_STORE_PASSWORD || 'store',
    role: 'store'
  },
  {
    employeeId: import.meta.env.VITE_MOCK_OPERATOR_ID || 'operator',
    passwordHash: import.meta.env.VITE_MOCK_OPERATOR_PASSWORD || 'operator',
    role: 'operator'
  }
];

// Load users from localStorage or fallback to defaults
function loadUsers(): UserAccount[] {
  const data = localStorage.getItem('nxp_users');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse nxp_users', e);
    }
  }
  localStorage.setItem('nxp_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

const mockUsers: UserAccount[] = loadUsers();

function saveUsers(): void {
  localStorage.setItem('nxp_users', JSON.stringify(mockUsers));
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'TASK_SUBMIT' | 'STATE_CHANGE' | 'CONFIRMATION' | 'CANCEL' | 'SYSTEM';
  employeeId: string;
  message: string;
}

// Load logs from localStorage or start empty
function loadLogs(): AuditLog[] {
  const data = localStorage.getItem('nxp_audit_logs');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse nxp_audit_logs', e);
    }
  }
  return [];
}

const mockAuditLogs: AuditLog[] = loadLogs();

function saveLogs(): void {
  localStorage.setItem('nxp_audit_logs', JSON.stringify(mockAuditLogs));
}

export function addAuditLog(
  eventType: AuditLog['eventType'],
  employeeId: string,
  message: string
): void {
  const log: AuditLog = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    eventType,
    employeeId,
    message,
  };
  mockAuditLogs.unshift(log);
  saveLogs();
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  await delay(100);
  return [...mockAuditLogs];
}

export function clearAuditLogs(employeeId: string): void {
  mockAuditLogs.length = 0;
  saveLogs();
  addAuditLog('SYSTEM', employeeId, `Audit logs cleared by user ${employeeId}`);
}

export async function getUsers(): Promise<UserAccount[]> {
  await delay(100);
  return [...mockUsers];
}

export async function validateCredentials(
  employeeId: string,
  passwordHash: string
): Promise<{ employeeId: string; role: Role } | null> {
  await delay(200);
  const user = mockUsers.find(
    u => u.employeeId === employeeId && u.passwordHash === passwordHash
  );
  if (user) {
    return { employeeId: user.employeeId, role: user.role };
  }
  return null;
}

export async function addUser(
  adminId: string,
  employeeId: string,
  passwordHash: string,
  role: Role
): Promise<void> {
  await delay(200);
  const exists = mockUsers.some(u => u.employeeId === employeeId);
  if (exists) {
    throw new Error('Employee ID already exists');
  }
  mockUsers.push({ employeeId, passwordHash, role });
  saveUsers();
  addAuditLog('SYSTEM', adminId, `User ${employeeId} added with role ${role}`);
}

export async function deleteUser(adminId: string, employeeId: string): Promise<void> {
  await delay(200);
  const index = mockUsers.findIndex(u => u.employeeId === employeeId);
  if (index === -1) {
    throw new Error('User not found');
  }
  const role = mockUsers[index].role;
  mockUsers.splice(index, 1);
  saveUsers();
  addAuditLog('SYSTEM', adminId, `User ${employeeId} (${role}) deleted`);
}

export async function updateUser(
  adminId: string,
  employeeId: string,
  newPasswordHash: string,
  newRole: Role
): Promise<void> {
  await delay(200);
  const user = mockUsers.find(u => u.employeeId === employeeId);
  if (!user) {
    throw new Error('User not found');
  }
  const oldRole = user.role;
  user.passwordHash = newPasswordHash;
  user.role = newRole;
  saveUsers();
  addAuditLog('SYSTEM', adminId, `User ${employeeId} updated: role ${oldRole} -> ${newRole}`);
}


// ─── Mock Machine Data (50 machines) ───
const DEFAULT_MACHINES: Machine[] = [
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

function loadMachines(): Machine[] {
  const data = localStorage.getItem('nxp_machines');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse nxp_machines', e);
    }
  }
  localStorage.setItem('nxp_machines', JSON.stringify(DEFAULT_MACHINES));
  return DEFAULT_MACHINES;
}

export const mockMachines: Machine[] = loadMachines();

function saveMachines(): void {
  localStorage.setItem('nxp_machines', JSON.stringify(mockMachines));
}

// ─── Mock FPC Database ───
const mockFPCDatabase: FPCItem[] = [
  { id: '2ID021FV002B', address: '002', functionName: 'PM Load', label: '2ID021FV002B', comment: '', category: 'Storage', location: 'Smart Storage' },
  { id: 'P14380-FHB-0596', address: '003', functionName: 'PM Load', label: 'P14380-FHB-0596', comment: '', category: 'Service', location: 'Smart Storage' },
  { id: 'P25250-FNN-0498', address: '004', functionName: 'PM Load', label: 'P25250-FNN-0498', comment: '', category: 'Deposit PM', location: 'Smart Storage' },
  { id: '2ID057TV001B', address: '005', functionName: 'PM Load', label: '2ID057TV001B', comment: '', category: 'Deposit Production', location: 'Smart Storage' },
  { id: 'P15760-TBB-0705', address: '006', functionName: 'PM Load', label: 'P15760-TBB-0705', comment: '', category: 'Storage', location: 'Smart Storage' },
  { id: 'PI0001-SBB-0494', address: '007', functionName: 'PM Load', label: 'PI0001-SBB-0494', comment: '', category: 'Service', location: 'Smart Storage' },
  { id: 'P14080-FHH-2655', address: '008', functionName: 'PM Load', label: 'P14080-FHH-2655', comment: '', category: 'Deposit PM', location: 'Smart Storage' },
  { id: 'P15450-FHH-2685', address: '009', functionName: 'PM Load', label: 'P15450-FHH-2685', comment: '', category: 'Deposit Production', location: 'Smart Storage' },
  { id: 'PIR011-TBB-0594', address: '010', functionName: 'PM Load', label: 'PIR011-TBB-0594', comment: '', category: 'Storage', location: 'Smart Storage' },
  { id: '2IE075TV001B', address: '-', functionName: 'PM Load', label: '2IE075TV001B', comment: '', category: 'Service', location: 'AVT_002' },
  { id: '2ID021FV003B', address: '-', functionName: 'PM Load', label: '2ID021FV003B', comment: '', category: 'Deposit PM', location: 'AVT_001' },
  { id: 'P15700-FBB-0707', address: '014', functionName: 'PM Load', label: 'P15700-FBB-0707', comment: '', category: 'Deposit Production', location: 'Smart Storage' },
];

// Simulate network delay (remove when connecting to real API)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique Job ID: JOB_YYMMDD_counter (resets daily, persists on refresh)
function generateJobId(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yy}${mm}${dd}`;

  let count = 1;
  const rawCounter = localStorage.getItem('nxp_job_counter');
  if (rawCounter) {
    try {
      const parsed = JSON.parse(rawCounter);
      if (parsed && parsed.date === dateStr) {
        count = (parsed.count || 0) + 1;
      }
    } catch (e) {
      console.error('Failed to parse nxp_job_counter', e);
    }
  }

  localStorage.setItem('nxp_job_counter', JSON.stringify({ date: dateStr, count }));

  const counterStr = count.toString().padStart(3, '0');
  return `JOB_${dateStr}_${counterStr}`;
}

// ─── Dual AGV Status ───
export type AGVStatus = 'Ok' | 'Engineering Use' | 'PM' | 'Error';
let agv1Status: AGVStatus = 'Ok';
let agv2Status: AGVStatus = 'Ok';

export function getAGV1Status(): AGVStatus { return agv1Status; }
export function getAGV2Status(): AGVStatus { return agv2Status; }

export function setAGV1Status(status: AGVStatus): void {
  agv1Status = status;
  addAuditLog('SYSTEM', 'SYSTEM', `AGV 1 status changed to ${status}`);
  // Pause or resume tasks assigned to AGV-01
  for (const task of mockTaskQueue) {
    if (task.agvId === 'AGV-01') {
      if (status !== 'Ok' && !isTerminal(task.status) && task.status !== 'blocked' && task.status !== 'submitted') {
        pauseTaskProgression(task.taskId, status);
      } else if (status === 'Ok' && task.status === 'blocked') {
        resumeTaskProgression(task.taskId);
      }
    }
  }
}

export function setAGV2Status(status: AGVStatus): void {
  agv2Status = status;
  addAuditLog('SYSTEM', 'SYSTEM', `AGV 2 status changed to ${status}`);
  // Pause or resume tasks assigned to AGV-02
  for (const task of mockTaskQueue) {
    if (task.agvId === 'AGV-02') {
      if (status !== 'Ok' && !isTerminal(task.status) && task.status !== 'blocked' && task.status !== 'submitted') {
        pauseTaskProgression(task.taskId, status);
      } else if (status === 'Ok' && task.status === 'blocked') {
        resumeTaskProgression(task.taskId);
      }
    }
  }
}

// Legacy compat — returns Error if either AGV is Error, or PM, or Engineering Use, otherwise Ok
export function getAGVSystemStatus(): AGVStatus {
  if (agv1Status === 'Error' || agv2Status === 'Error') return 'Error';
  if (agv1Status === 'PM' || agv2Status === 'PM') return 'PM';
  if (agv1Status === 'Engineering Use' || agv2Status === 'Engineering Use') return 'Engineering Use';
  return 'Ok';
}
export function setAGVSystemStatus(status: AGVStatus): void {
  setAGV1Status(status);
  setAGV2Status(status);
}

function isTerminal(status: TaskResponse['status']): boolean {
  return ['completed', 'complete', 'canceled', 'failed', 'rejected', 'error'].includes(status);
}

// ─── Step-Based Progression Engine ───
const RETURN_STEPS: TaskResponse['status'][] = [
  'queued', 'starting', 'moving_to_source', 'arrived_at_source',
  'waiting_tray_open', 'picking_up_fpc', 'waiting_cover_head_install',
  'moving_to_destination', 'arrived_at_destination', 'placing_fpc',
  'completed'
];
const REQUEST_STEPS: TaskResponse['status'][] = [
  'queued', 'starting', 'moving_to_source', 'arrived_at_source',
  'picking_up_fpc', 'moving_to_destination', 'arrived_at_destination',
  'waiting_tray_open', 'placing_fpc', 'waiting_cover_head_remove',
  'completed'
];
const MOVE_STEPS: TaskResponse['status'][] = [
  'queued', 'starting', 'moving_to_source', 'arrived_at_source',
  'waiting_tray_open', 'picking_up_fpc', 'waiting_cover_head_install',
  'moving_to_destination', 'arrived_at_destination', 'waiting_tray_open',
  'placing_fpc', 'waiting_cover_head_remove', 'completed'
];
const MOVE_OCCUPIED_STEPS: TaskResponse['status'][] = [
  'queued',
  'starting',
  'moving_to_source',
  'arrived_at_source',
  'waiting_tray_open',
  'picking_up_fpc',
  'waiting_cover_head_install',
  'moving_to_destination',
  'arrived_at_destination',
  'waiting_tray_open',
  'picking_up_fpc',
  'waiting_cover_head_install',
  'waiting_cover_head_remove',
  'placing_fpc',
  'moving_to_destination',
  'arrived_at_destination',
  'placing_fpc',
  'completed'
];
const UNLOAD_LOAD_STEPS: TaskResponse['status'][] = [
  'queued',
  'starting',
  'moving_to_source',
  'arrived_at_source',
  'picking_up_fpc',
  'moving_to_destination',
  'arrived_at_destination',
  'waiting_tray_open',
  'picking_up_fpc',
  'waiting_cover_head_install',
  'waiting_cover_head_remove',
  'placing_fpc',
  'moving_to_destination',
  'arrived_at_destination',
  'placing_fpc',
  'completed'
];

const STEP_DELAYS: Record<string, number> = {
  queued: 1500,
  starting: 2500,
  moving_to_source: 3000,
  arrived_at_source: 3500,
  waiting_tray_open: 1000,
  picking_up_fpc: 3500,
  waiting_cover_head_install: 3500,
  moving_to_destination: 4000,
  arrived_at_destination: 3500,
  placing_fpc: 3500,
  waiting_cover_head_remove: 3500,
};

// Active timer handles per task
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();
// Saved "next step" for paused tasks so we can resume
const pausedNextStep = new Map<string, TaskResponse['status']>();

function getStepsForType(task: TaskResponse): TaskResponse['status'][] {
  if (task.type === 'return') return RETURN_STEPS;
  if (task.type === 'request') return REQUEST_STEPS;
  if (task.type === 'unload_load') return UNLOAD_LOAD_STEPS;
  if (task.type === 'move' && task.isOccupiedMove) return MOVE_OCCUPIED_STEPS;
  return MOVE_STEPS;
}

function scheduleNextStep(taskId: string, nextStatus: TaskResponse['status']): void {
  const delayMs = STEP_DELAYS[nextStatus] || 3000;
  const timer = setTimeout(() => {
    activeTimers.delete(taskId);
    updateTaskStatus(taskId, nextStatus);
  }, delayMs);
  activeTimers.set(taskId, timer);
}

function pauseTaskProgression(taskId: string, agvStatus: AGVStatus): void {
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (!task || isTerminal(task.status)) return;

  // Clear pending timer
  const timer = activeTimers.get(taskId);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(taskId);
  }

  // Determine what the next step would have been
  const steps = getStepsForType(task);
  const currentIdx = steps.indexOf(task.status);
  if (currentIdx >= 0 && currentIdx < steps.length - 1) {
    pausedNextStep.set(taskId, steps[currentIdx + 1]);
  }

  // Mark as blocked
  const previousStatus = task.status;
  task.status = 'blocked';
  addAuditLog('STATE_CHANGE', task.employeeId, `Job ${task.jobId} BLOCKED (was ${previousStatus}) — assigned AGV is in ${agvStatus} state`);
}

function resumeTaskProgression(taskId: string): void {
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (!task || task.status !== 'blocked') return;

  // Restore to the saved next step, or find the next step from savedPre state
  const savedStep = pausedNextStep.get(taskId);
  pausedNextStep.delete(taskId);

  if (savedStep) {
    // Resume: schedule the next step
    addAuditLog('STATE_CHANGE', task.employeeId, `Job ${task.jobId} RESUMED — AGV back to OK, scheduling ${savedStep}`);
    // Put task back to a running state temporarily, then let scheduleNextStep advance
    const steps = getStepsForType(task);
    const savedIdx = steps.indexOf(savedStep);
    if (savedIdx > 0) {
      task.status = steps[savedIdx - 1];
    } else {
      task.status = 'queued';
    }
    scheduleNextStep(taskId, savedStep);
  } else {
    // Fallback: just set to queued and let it re-run
    task.status = 'queued';
    addAuditLog('STATE_CHANGE', task.employeeId, `Job ${task.jobId} RESUMED — AGV back to OK`);
  }
}

function startProgression(task: TaskResponse): void {
  const steps = getStepsForType(task);
  if (steps.length > 0) {
    scheduleNextStep(task.taskId, steps[0]);
  }
}

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

/** Search FPC items by query string */
export async function searchFPC(query: string): Promise<FPCItem[]> {
  await delay(800);
  const lowerQuery = query.toLowerCase();
  return mockFPCDatabase.filter(
    fpc =>
      fpc.address.toLowerCase().includes(lowerQuery) ||
      fpc.functionName.toLowerCase().includes(lowerQuery) ||
      fpc.label.toLowerCase().includes(lowerQuery) ||
      (fpc.comment && fpc.comment.toLowerCase().includes(lowerQuery))
  );
}

/** Get all FPCs */
export async function getAllFPCs(): Promise<FPCItem[]> {
  await delay(200);
  return [...mockFPCDatabase];
}

/** Update FPC location */
export async function updateFPCLocation(
  employeeId: string,
  fpcId: string,
  newLocation: string,
  newAddress: string | null
): Promise<void> {
  await delay(500);

  const fpc = mockFPCDatabase.find(f => f.id === fpcId);
  if (!fpc) {
    throw new Error('FPC not found');
  }

  const oldLocation = fpc.location;
  const oldAddress = fpc.address;

  // Validate slot occupancy if moving to Smart Storage
  if (newLocation === 'Smart Storage' && newAddress) {
    const occupant = mockFPCDatabase.find(
      f => f.id !== fpcId && f.location === 'Smart Storage' && f.address === newAddress
    );
    if (occupant) {
      throw new Error(`Slot ${newAddress} is already occupied by FPC ${occupant.id}`);
    }
  }

  // Validate machine occupancy if moving to a machine
  if (newLocation !== 'Smart Storage') {
    const occupant = mockFPCDatabase.find(
      f => f.id !== fpcId && f.location === newLocation
    );
    if (occupant) {
      throw new Error(`Machine ${newLocation} is already occupied by FPC ${occupant.id}`);
    }
  }

  fpc.location = newLocation;
  fpc.address = newLocation === 'Smart Storage' ? (newAddress || '') : '-';

  const newLocStr = newLocation === 'Smart Storage' ? `Smart Storage (Slot: ${newAddress})` : `Machine ${newLocation}`;
  const oldLocStr = oldLocation === 'Smart Storage' ? `Smart Storage (Slot: ${oldAddress})` : `Machine ${oldLocation}`;

  addAuditLog(
    'STATE_CHANGE',
    employeeId,
    `Admin manually moved FPC ${fpcId} from ${oldLocStr} to ${newLocStr}`
  );
}

/** Swap FPC locations */
export async function swapFPCLocations(
  employeeId: string,
  fpcId1: string,
  fpcId2: string
): Promise<void> {
  await delay(500);

  const fpc1 = mockFPCDatabase.find(f => f.id === fpcId1);
  const fpc2 = mockFPCDatabase.find(f => f.id === fpcId2);

  if (!fpc1 || !fpc2) {
    throw new Error('One or both FPC items not found');
  }

  const loc1 = fpc1.location;
  const addr1 = fpc1.address;
  const loc2 = fpc2.location;
  const addr2 = fpc2.address;

  fpc1.location = loc2;
  fpc1.address = addr2;

  fpc2.location = loc1;
  fpc2.address = addr1;

  const locStr1 = loc1 === 'Smart Storage' ? `Smart Storage (Slot: ${addr1})` : `Machine ${loc1}`;
  const locStr2 = loc2 === 'Smart Storage' ? `Smart Storage (Slot: ${addr2})` : `Machine ${loc2}`;

  addAuditLog(
    'STATE_CHANGE',
    employeeId,
    `Admin manually swapped locations between FPC ${fpcId1} (${locStr1}) and FPC ${fpcId2} (${locStr2})`
  );
}

/** Submit a Return FPC job */
export async function submitReturnFPCJob(
  employeeId: string,
  sourceMachineId: string
): Promise<TaskResponse> {
  await delay(1000);

  const hasFPC = mockFPCDatabase.some(f => f.location === sourceMachineId);
  if (!hasFPC) {
    throw new Error('Source machine does not have a Probecard');
  }

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
  addAuditLog('TASK_SUBMIT', employeeId, `Submitted Return FPC job (Job: ${jobId}). Source: ${machine?.name || sourceMachineId}`);

  // Step-based progression
  startProgression(task);

  return task;
}

/** Submit a Request FPC job */
export async function submitRequestFPCJob(
  employeeId: string,
  fpcId: string,
  destinationMachineId: string
): Promise<TaskResponse> {
  await delay(1000);

  const isOccupied = mockFPCDatabase.some(f => f.location === destinationMachineId);
  if (isOccupied) {
    throw new Error('Destination machine already has a Probecard');
  }

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
  addAuditLog('TASK_SUBMIT', employeeId, `Submitted Request FPC job (Job: ${jobId}). FPC: ${fpcId}, Destination: ${machine?.name || destinationMachineId}`);

  // Step-based progression
  startProgression(task);

  return task;
}

/** Submit a Move FPC job */
export async function submitMoveFPCJob(
  employeeId: string,
  sourceMachineId: string,
  destinationMachineId: string
): Promise<TaskResponse> {
  await delay(1000);

  const hasSourceFPC = mockFPCDatabase.some(f => f.location === sourceMachineId);
  if (!hasSourceFPC) {
    throw new Error('Source machine does not have a Probecard');
  }
  const destFPC = mockFPCDatabase.find(f => f.location === destinationMachineId);
  const isOccupiedMove = !!destFPC;

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
    type: 'move',
    sourceMachine: srcMachine?.name || sourceMachineId,
    destinationMachine: destMachine?.name || destinationMachineId,
    createdAt: new Date().toISOString(),
    coverHeadInstalledConfirmed: false,
    isOccupiedMove,
    oldFpcId: destFPC?.id,
    currentStepIndex: isOccupiedMove ? 0 : undefined,
  };

  mockTaskQueue.push(task);
  if (isOccupiedMove) {
    addAuditLog('TASK_SUBMIT', employeeId, `Submitted Occupied Move FPC job (Job: ${jobId}). Source: ${srcMachine?.name || sourceMachineId}, Destination: ${destMachine?.name || destinationMachineId}, Old FPC: ${destFPC?.id}`);
  } else {
    addAuditLog('TASK_SUBMIT', employeeId, `Submitted Move FPC job (Job: ${jobId}). Source: ${srcMachine?.name || sourceMachineId}, Destination: ${destMachine?.name || destinationMachineId}`);
  }

  // Step-based progression
  startProgression(task);

  return task;
}

/** Submit an Unload & Load FPC job */
export async function submitUnloadLoadFPCJob(
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
    type: 'unload_load',
    sourceMachine: 'Smart Storage',
    destinationMachine: machine?.name || destinationMachineId,
    fpcId,
    createdAt: new Date().toISOString(),
    coverHeadInstalledConfirmed: false,
    currentStepIndex: 0,
  };

  mockTaskQueue.push(task);
  addAuditLog('TASK_SUBMIT', employeeId, `Submitted Unload & Load FPC job (Job: ${jobId}). FPC: ${fpcId}, Destination: ${machine?.name || destinationMachineId}`);

  // Step-based progression
  startProgression(task);

  return task;
}

/** Confirm or unconfirm Tray Opened manually by Operator from screen UI */
export async function confirmTrayOpened(taskId: string, confirmed: boolean = true): Promise<TaskResponse> {
  await delay(300);
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    if (task.status === 'waiting_tray_open') {
      task.trayOpenedConfirmed = confirmed;
      addAuditLog('CONFIRMATION', task.employeeId, `${confirmed ? 'Confirmed' : 'Unconfirmed'} Tray Opened for job (Job: ${task.jobId})`);
      
      if (confirmed) {
        const steps = getStepsForType(task);
        let currentIdx = task.currentStepIndex;
        if (currentIdx === undefined || steps[currentIdx] !== 'waiting_tray_open') {
          currentIdx = steps.indexOf('waiting_tray_open', task.currentStepIndex ?? 0);
          if (currentIdx === -1) {
            currentIdx = steps.indexOf('waiting_tray_open');
          }
        }
        if (currentIdx >= 0 && currentIdx < steps.length - 1) {
          const nextStatus = steps[currentIdx + 1];
          task.currentStepIndex = currentIdx + 1;
          updateTaskStatus(taskId, nextStatus);
        }
      }
    }
  }
  return task || {
    taskId,
    jobId: 'UNKNOWN',
    status: 'completed',
    message: 'Tray opened confirmed',
    employeeId: '',
    type: 'return',
    createdAt: new Date().toISOString(),
  };
}

/** Execute status progression for Cover Head Installed */
export function executeCoverHeadInstalledProgression(task: TaskResponse): void {
  if (task.status === 'canceled') return;

  addAuditLog('CONFIRMATION', task.employeeId, `Confirmed Cover Head Installed for ${task.type.toUpperCase()} job (Job: ${task.jobId})`);

  if (task.type === 'move') {
    if (task.isOccupiedMove) {
      task.coverHeadInstalledConfirmed = true;
      const currentIndex = task.currentStepIndex ?? 0;
      if (currentIndex === 6) {
        task.currentStepIndex = 7;
        task.message = 'Cover Head installation for new FPC confirmed, AGV proceeding to destination';
        updateTaskStatus(task.taskId, 'moving_to_destination');
      } else if (currentIndex === 11) {
        task.currentStepIndex = 12;
        task.message = 'Cover Head installation for old FPC confirmed, preparing to install new FPC';
        updateTaskStatus(task.taskId, 'waiting_cover_head_remove');
      }
    } else {
      task.coverHeadInstalledConfirmed = true;
      task.currentStepIndex = 7; // Index of 'moving_to_destination' in MOVE_STEPS is 7
      task.message = 'Cover Head installation confirmed, AGV proceeding to destination';
      updateTaskStatus(task.taskId, 'moving_to_destination');
    }
  } else if (task.type === 'unload_load') {
    task.coverHeadInstalledConfirmed = true;
    task.currentStepIndex = 10; // Index of 'waiting_cover_head_remove' in UNLOAD_LOAD_STEPS is 10
    task.message = 'Cover Head installation confirmed, preparing to install new FPC';
    updateTaskStatus(task.taskId, 'waiting_cover_head_remove');
  } else {
    task.currentStepIndex = 7; // Index of 'moving_to_destination' in RETURN_STEPS is 7
    task.message = 'Cover Head installation confirmed, AGV proceeding to Smart Storage';
    updateTaskStatus(task.taskId, 'moving_to_destination');
  }
}

/** Execute status progression for Cover Head Removed */
export function executeCoverHeadRemovedProgression(task: TaskResponse): void {
  if (task.status === 'canceled') return;

  addAuditLog('CONFIRMATION', task.employeeId, `Confirmed Cover Head Removed for ${task.type.toUpperCase()} job (Job: ${task.jobId})`);

  if (task.type === 'unload_load') {
    task.currentStepIndex = 11; // Index of placing_fpc in UNLOAD_LOAD_STEPS is 11
    task.message = 'Cover Head removal confirmed, placing FPC';
    updateTaskStatus(task.taskId, 'placing_fpc');
  } else if (task.type === 'move' && task.isOccupiedMove) {
    task.currentStepIndex = 13; // Index of placing_fpc in MOVE_OCCUPIED_STEPS is 13
    task.message = 'Cover Head removal confirmed, placing new FPC';
    updateTaskStatus(task.taskId, 'placing_fpc');
  } else {
    const steps = getStepsForType(task);
    const completedIdx = steps.indexOf('completed');
    if (completedIdx >= 0) {
      task.currentStepIndex = completedIdx;
    }
    task.message = 'Cover Head removal confirmed, job completed';
    updateTaskStatus(task.taskId, 'completed');
  }
}

// Legacy wrappers (for compatibility if needed, though not used externally)
export async function confirmCoverHeadInstalled(taskId: string): Promise<TaskResponse> {
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    executeCoverHeadInstalledProgression(task);
  }
  return task || { taskId, jobId: 'UNKNOWN', status: 'completed', message: '', employeeId: '', type: 'return', createdAt: '' };
}
export async function confirmCoverHeadRemoved(taskId: string): Promise<TaskResponse> {
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    executeCoverHeadRemovedProgression(task);
  }
  return task || { taskId, jobId: 'UNKNOWN', status: 'completed', message: '', employeeId: '', type: 'return', createdAt: '' };
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

export function getMachineState(
  machine: Machine,
  fpcItems: FPCItem[],
  activeTasks: TaskResponse[]
): MachineState {
  if (!machine.available) {
    return 'unavailable';
  }
  const isReserved = activeTasks.some(task => {
    if (['completed', 'complete', 'canceled', 'failed', 'rejected', 'error'].includes(task.status)) {
      return false;
    }
    return task.sourceMachine === machine.name ||
           task.sourceMachine === machine.id ||
           task.destinationMachine === machine.name ||
           task.destinationMachine === machine.id;
  });
  if (isReserved) {
    return 'reserved';
  }
  const isOccupied = fpcItems.some(f => f.location === machine.id);
  if (isOccupied) {
    return 'occupied';
  }
  return 'empty';
}

export async function updateMachineAvailability(
  employeeId: string,
  machineId: string,
  available: boolean,
  reason?: string,
  comment?: string
): Promise<void> {
  await delay(300);
  const machine = mockMachines.find(m => m.id === machineId);
  if (!machine) {
    throw new Error('Machine not found');
  }
  machine.available = available;
  if (available) {
    delete machine.disableReason;
    delete machine.disableComment;
  } else {
    machine.disableReason = reason;
    machine.disableComment = comment;
  }
  saveMachines();

  const stateStr = available ? 'AVAILABLE' : 'UNAVAILABLE';
  const reasonStr = reason ? `Reason: ${reason}. ` : '';
  const commentStr = comment ? `Comment: ${comment}` : '';
  addAuditLog(
    'STATE_CHANGE',
    employeeId,
    `User manually set machine ${machineId} to ${stateStr}. ${reasonStr}${commentStr}`
  );
}

export async function getMachinesWithState(): Promise<MachineWithState[]> {
  const fpcItems = await getAllFPCs();
  const activeTasks = await getAllTasks();
  return mockMachines.map(m => ({
    ...m,
    state: getMachineState(m, fpcItems, activeTasks)
  }));
}

/** Update task status in-memory */
export function updateTaskStatus(taskId: string, status: TaskResponse['status']): void {
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    if (task.status === 'canceled' || task.status === 'blocked') return;
    task.status = status;

    // Assign AGV dynamically when the task is accepted / queued
    if (status !== 'submitted' && status !== 'canceled' && !task.agvId) {
      task.agvId = Math.random() > 0.5 ? 'AGV-01' : 'AGV-02';
    }

    addAuditLog('STATE_CHANGE', task.employeeId, `Job ${task.jobId} status updated to ${status}`);

    // Check if the assigned AGV is in ERROR — block immediately
    if (task.agvId) {
      const agvStatusVal = task.agvId === 'AGV-01' ? agv1Status : agv2Status;
      if (agvStatusVal !== 'Ok' && !isTerminal(status) && status !== 'submitted') {
        pauseTaskProgression(taskId, agvStatusVal);
        return;
      }
    }

    // Simulate AGV physical button confirmation after 5 seconds
    if (status === 'waiting_cover_head_install') {
      task.trayOpenedConfirmed = false;
      task.coverHeadPhysicalConfirmed = false;
      setTimeout(() => {
        const t = mockTaskQueue.find(tk => tk.taskId === taskId);
        if (t && t.status === 'waiting_cover_head_install') {
          t.coverHeadPhysicalConfirmed = true;
          addAuditLog('CONFIRMATION', t.employeeId, `Physical Cover Head Installation button confirmed on AGV (Job: ${t.jobId})`);
          setTimeout(() => {
            const t2 = mockTaskQueue.find(tk => tk.taskId === taskId);
            if (t2 && t2.status === 'waiting_cover_head_install') {
              executeCoverHeadInstalledProgression(t2);
            }
          }, 1500);
        }
      }, 5000);
    } else if (status === 'waiting_cover_head_remove') {
      task.trayOpenedConfirmed = false;
      task.coverHeadPhysicalConfirmed = false;
      setTimeout(() => {
        const t = mockTaskQueue.find(tk => tk.taskId === taskId);
        if (t && t.status === 'waiting_cover_head_remove') {
          t.coverHeadPhysicalConfirmed = true;
          addAuditLog('CONFIRMATION', t.employeeId, `Physical Cover Head Removal button confirmed on AGV (Job: ${t.jobId})`);
          setTimeout(() => {
            const t2 = mockTaskQueue.find(tk => tk.taskId === taskId);
            if (t2 && t2.status === 'waiting_cover_head_remove') {
              executeCoverHeadRemovedProgression(t2);
            }
          }, 1500);
        }
      }, 5000);
    } else if (status === 'waiting_tray_open') {
      task.trayOpenedConfirmed = false;
      // Do nothing, pause progression to wait for operator screen confirmation
    } else {
      const steps = getStepsForType(task);
      let currentIdx = steps.indexOf(status, task.currentStepIndex ?? 0);
      if (currentIdx === -1) {
        currentIdx = steps.indexOf(status);
      }
      if (currentIdx >= 0) {
        task.currentStepIndex = currentIdx;
      }

      if (task.type === 'unload_load') {
        const currentIndex = task.currentStepIndex ?? 0;
        if (currentIndex < UNLOAD_LOAD_STEPS.length - 1) {
          const nextIndex = currentIndex + 1;
          task.currentStepIndex = nextIndex;
          const nextStatus = UNLOAD_LOAD_STEPS[nextIndex];
          scheduleNextStep(taskId, nextStatus);
        } else if (status === 'completed') {
          // Perform location swapping in in-memory database
          const newFpc = mockFPCDatabase.find(f => f.id === task.fpcId);
          const oldFpc = mockFPCDatabase.find(f => f.location === task.destinationMachine);
          if (newFpc && oldFpc) {
            const originalNewFpcAddress = newFpc.address;
            const originalNewFpcLocation = newFpc.location;
            const originalOldFpcLocation = oldFpc.location;

            // 1. Move new FPC to target machine
            newFpc.location = originalOldFpcLocation;
            newFpc.address = '-';

            // 2. Move old FPC to storage slot vacated by new FPC
            oldFpc.location = originalNewFpcLocation; // 'Smart Storage'
            oldFpc.address = originalNewFpcAddress;

            addAuditLog(
              'STATE_CHANGE',
              'SYSTEM',
              `Swapped FPC locations: New FPC ${newFpc.id} is now on Machine ${newFpc.location}. Old FPC ${oldFpc.id} returned to Smart Storage Slot ${oldFpc.address}`
            );
          }
        }
      } else if (task.type === 'move' && task.isOccupiedMove) {
        const currentIndex = task.currentStepIndex ?? 0;
        if (currentIndex < MOVE_OCCUPIED_STEPS.length - 1) {
          const nextIndex = currentIndex + 1;
          task.currentStepIndex = nextIndex;
          const nextStatus = MOVE_OCCUPIED_STEPS[nextIndex];
          scheduleNextStep(taskId, nextStatus);
        } else if (status === 'completed') {
          const newFpc = mockFPCDatabase.find(f => f.location === task.sourceMachine);
          const oldFpc = mockFPCDatabase.find(f => f.id === task.oldFpcId);
          if (newFpc && oldFpc) {
            const occupiedSlots = mockFPCDatabase
              .filter(f => f.location === 'Smart Storage')
              .map(f => f.address);

            let emptySlot = '';
            for (let i = 1; i <= 50; i++) {
              const slotStr = String(i).padStart(3, '0');
              if (!occupiedSlots.includes(slotStr)) {
                emptySlot = slotStr;
                break;
              }
            }
            if (!emptySlot) {
              emptySlot = '099';
            }

            newFpc.location = task.destinationMachine || '';
            newFpc.address = '-';

            oldFpc.location = 'Smart Storage';
            oldFpc.address = emptySlot;

            addAuditLog(
              'STATE_CHANGE',
              'SYSTEM',
              `Swapped FPC locations (Move Occupied): New FPC ${newFpc.id} is now on Machine ${newFpc.location}. Old FPC ${oldFpc.id} returned to Smart Storage Slot ${oldFpc.address}`
            );
          }
        }
      } else {
        // Schedule next step in progression (for non-waiting statuses)
        if (currentIdx >= 0 && currentIdx < steps.length - 1) {
          const nextStatus = steps[currentIdx + 1];
          scheduleNextStep(taskId, nextStatus);
        }
      }
    }
  }
}

/** Cancel a task */
export async function cancelTask(taskId: string): Promise<TaskResponse | null> {
  await delay(500);
  const task = mockTaskQueue.find(t => t.taskId === taskId);
  if (task) {
    task.status = 'canceled';
    task.message = 'Job canceled by user';
    addAuditLog('CANCEL', task.employeeId, `Job ${task.jobId} was canceled`);
  }
  return task || null;
}

/** Optionally pre-populate queue for testing */
export function initializeMockQueue(): void {
  // Add sample tasks here for UI testing if needed
}
