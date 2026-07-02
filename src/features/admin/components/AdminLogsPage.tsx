import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert
} from '@mui/material';
import {
  Search,
  Clock,
  Shield,
  Activity,
  ArrowLeft,
  User,
  RefreshCw,
  Edit,
  AlertTriangle,
  Database,
  Monitor
} from 'lucide-react';
import {
  getAuditLogs,
  getAllFPCs,
  updateFPCLocation,
  swapFPCLocations,
  mockMachines,
  type AuditLog,
  type FPCItem,
  getAGV1Status,
  getAGV2Status,
  setAGV1Status,
  setAGV2Status,
  clearAuditLogs,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  type AGVStatus,
  getMachinesWithState,
  updateMachineAvailability,
  type MachineWithState
} from '@/shared/utils/mockApi';
import { translations } from '@/shared/utils/translations';
import type { Language, Role, UserAccount } from '@/shared/types';

interface AdminLogsPageProps {
  employeeId: string;
  userRole: Role;
  language: Language;
  onBack: () => void;
}

export function AdminLogsPage({ employeeId, userRole, language, onBack }: AdminLogsPageProps) {
  // Page Tab state (logs, location, users, machines)
  const [activeTab, setActiveTab] = useState<string>('logs');
  const [agv1Status, setLocalAgv1Status] = useState<AGVStatus>(getAGV1Status());
  const [agv2Status, setLocalAgv2Status] = useState<AGVStatus>(getAGV2Status());

  // Machines state
  const [machinesList, setMachinesList] = useState<MachineWithState[]>([]);
  const [machineSearchQuery, setMachineSearchQuery] = useState('');
  const [machineFilterTab, setMachineFilterTab] = useState<'ALL' | 'empty' | 'occupied' | 'reserved' | 'unavailable'>('ALL');

  // Toggle Machine Confirmation Dialog state
  const [isToggleMachineDialogOpen, setIsToggleMachineDialogOpen] = useState(false);
  const [targetMachineId, setTargetMachineId] = useState<string | null>(null);
  const [targetMachineAvailable, setTargetMachineAvailable] = useState<boolean>(true);
  const [toggleReason, setToggleReason] = useState<string>('');
  const [toggleComment, setToggleComment] = useState<string>('');
  const [toggleError, setToggleError] = useState<string>('');

  // Audit Logs state
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchOperator, setSearchOperator] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');

  // FPCs state
  const [fpcItems, setFpcItems] = useState<FPCItem[]>([]);
  const [fpcSearchQuery, setFpcSearchQuery] = useState('');
  const [fpcCategoryFilter, setFpcCategoryFilter] = useState<string>('ALL');

  // User Management state
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'store' | 'operator'>('operator');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const t = translations[language];

  // Dialog state for Edit Location
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFpc, setSelectedFpc] = useState<FPCItem | null>(null);
  const [newLocationType, setNewLocationType] = useState<'storage' | 'machine'>('storage');
  const [targetMachine, setTargetMachine] = useState('');
  const [targetSlot, setTargetSlot] = useState('');
  const [displacedAction, setDisplacedAction] = useState<'swap' | 'evict'>('swap');
  const [evictSlot, setEvictSlot] = useState('');

  // Dialog state for Clear Logs and Delete User
  const [isClearLogsConfirmOpen, setIsClearLogsConfirmOpen] = useState(false);
  const [isUserDeleteConfirmOpen, setIsUserDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Dialog state for Edit User
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'store' | 'operator'>('operator');

  // Fetch all admin data (logs, FPCs and machines)
  const fetchData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const promises: Promise<AuditLog[] | FPCItem[] | MachineWithState[]>[] = [getAuditLogs()];
      if (userRole === 'admin' || userRole === 'store') {
        promises.push(getAllFPCs());
        promises.push(getMachinesWithState());
      }
      
      const results = await Promise.all(promises);
      setLogs(results[0] as AuditLog[]);
      if (userRole === 'admin' || userRole === 'store') {
        setFpcItems(results[1] as FPCItem[]);
        setMachinesList(results[2] as MachineWithState[]);
      }
      setLocalAgv1Status(getAGV1Status());
      setLocalAgv2Status(getAGV2Status());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      if (showSpinner) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [userRole]);

  // Fetch users (Admin only)
  const fetchUsersList = useCallback(async () => {
    if (userRole !== 'admin') return;
    try {
      const usersData = await getUsers();
      setUsersList(usersData);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [userRole]);

  // Poll for live data every 3 seconds
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (isMounted) {
        await fetchData();
      }
    };
    run();
    const interval = setInterval(() => {
      run();
    }, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  // Fetch users list when users tab is active
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (isMounted && activeTab === 'users') {
        await fetchUsersList();
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [activeTab, fetchUsersList]);

  const handleToggleMachine = (machineId: string, currentAvailable: boolean) => {
    setTargetMachineId(machineId);
    setTargetMachineAvailable(!currentAvailable);
    setToggleReason('');
    setToggleComment('');
    setToggleError('');
    setIsToggleMachineDialogOpen(true);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Filter logs (memoized to avoid recalculation on every polling tick)
  const filteredLogs = useMemo(() => {
    const lowerOperator = searchOperator.toLowerCase();
    return logs.filter(log => {
      const matchesOperator = log.employeeId.toLowerCase().includes(lowerOperator);
      const matchesType = selectedEventType === 'ALL' || log.eventType === selectedEventType;
      return matchesOperator && matchesType;
    });
  }, [logs, searchOperator, selectedEventType]);

  // Filter FPCs (memoized to avoid recalculation on every polling tick)
  const filteredFpcs = useMemo(() => {
    const lowerQuery = fpcSearchQuery.toLowerCase();
    return fpcItems.filter(fpc => {
      const matchesCategory = fpcCategoryFilter === 'ALL' || fpc.category === fpcCategoryFilter;
      const matchesSearch =
        fpc.id.toLowerCase().includes(lowerQuery) ||
        fpc.address.toLowerCase().includes(lowerQuery) ||
        fpc.label.toLowerCase().includes(lowerQuery) ||
        fpc.location.toLowerCase().includes(lowerQuery) ||
        (fpc.comment && fpc.comment.toLowerCase().includes(lowerQuery));
      return matchesCategory && matchesSearch;
    });
  }, [fpcItems, fpcCategoryFilter, fpcSearchQuery]);

  // Filter machines (memoized)
  const filteredMachinesList = useMemo(() => {
    let list = machinesList;
    if (machineSearchQuery.trim()) {
      const lower = machineSearchQuery.toLowerCase();
      list = list.filter(m => m.id.toLowerCase().includes(lower) || m.name.toLowerCase().includes(lower));
    }
    if (machineFilterTab !== 'ALL') {
      list = list.filter(m => m.state === machineFilterTab);
    }
    return list;
  }, [machinesList, machineSearchQuery, machineFilterTab]);

  // Calculate stats for Audit tab (optimized to run in a single-pass O(N) loop and memoized)
  const { totalCount, loginCount, taskSubmitCount, stateChangeCount } = useMemo(() => {
    const total = logs.length;
    let logins = 0;
    let taskSubmits = 0;
    let stateChanges = 0;

    for (let i = 0; i < logs.length; i++) {
      const type = logs[i].eventType;
      if (type === 'LOGIN') logins++;
      else if (type === 'TASK_SUBMIT') taskSubmits++;
      else if (type === 'STATE_CHANGE') stateChanges++;
    }

    return {
      totalCount: total,
      loginCount: logins,
      taskSubmitCount: taskSubmits,
      stateChangeCount: stateChanges
    };
  }, [logs]);

  const getEventBadgeClass = (type: AuditLog['eventType']) => {
    switch (type) {
      case 'LOGIN': return 'bg-success-background text-success-foreground border-success/30';
      case 'LOGOUT': return 'bg-canceled-background text-canceled-foreground border-canceled/30';
      case 'TASK_SUBMIT': return 'bg-info-background text-info-foreground border-info/30';
      case 'STATE_CHANGE': return 'bg-info-background text-info-foreground border-info/30';
      case 'CONFIRMATION': return 'bg-warning-background text-warning-foreground border-warning/30';
      case 'CANCEL': return 'bg-error-background text-error-foreground border-error/30';
      case 'SYSTEM':
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getEventTypeName = (type: AuditLog['eventType']) => {
    if (language === 'th') {
      switch (type) {
        case 'LOGIN': return 'เข้าสู่ระบบ';
        case 'LOGOUT': return 'ออกจากระบบ';
        case 'TASK_SUBMIT': return 'ส่งงานใหม่';
        case 'STATE_CHANGE': return 'เปลี่ยนสถานะ';
        case 'CONFIRMATION': return 'ยืนยันงาน';
        case 'CANCEL': return 'ยกเลิกงาน';
        case 'SYSTEM': return 'ระบบ';
      }
    }
    return type;
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  // Open Location edit
  const handleOpenEdit = (fpc: FPCItem) => {
    setSelectedFpc(fpc);
    setNewLocationType(fpc.location === 'Smart Storage' ? 'storage' : 'machine');
    if (fpc.location === 'Smart Storage') {
      setTargetSlot(fpc.address);
      setTargetMachine(mockMachines[0].id);
    } else {
      setTargetSlot('');
      setTargetMachine(fpc.location);
    }
    setDisplacedAction('swap');
    setEvictSlot('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditOpen(true);
  };

  // Validation logic for Edit Location dialog
  const getEditValidation = () => {
    if (!selectedFpc) return { isValid: false, error: '' };

    if (newLocationType === 'storage') {
      if (!targetSlot.trim()) {
        return { isValid: false, error: t.errorSlotRequired };
      }
      // Check if slot is occupied by ANOTHER FPC
      const occupant = fpcItems.find(
        f => f.id !== selectedFpc.id && f.location === 'Smart Storage' && f.address === targetSlot.trim()
      );
      if (occupant) {
        return {
          isValid: false,
          error: t.errorSlotOccupied
            .replace('{slot}', targetSlot.trim())
            .replace('{fpcId}', occupant.id)
        };
      }
      return { isValid: true, error: '' };
    } else {
      if (!targetMachine) {
        return { isValid: false, error: t.errorMachineRequired };
      }
      // Check if target machine is occupied by ANOTHER FPC
      const occupant = fpcItems.find(
        f => f.id !== selectedFpc.id && f.location === targetMachine
      );
      if (occupant) {
        if (displacedAction === 'evict') {
          if (!evictSlot.trim()) {
            return { isValid: false, error: t.errorSlotRequired };
          }
          // Check if evict slot is occupied by ANOTHER FPC (must not be selectedFpc or occupant)
          const slotOccupant = fpcItems.find(
            f =>
              f.id !== selectedFpc.id &&
              f.id !== occupant.id &&
              f.location === 'Smart Storage' &&
              f.address === evictSlot.trim()
          );
          if (slotOccupant) {
            return {
              isValid: false,
              error: t.errorSlotOccupied
                .replace('{slot}', evictSlot.trim())
                .replace('{fpcId}', slotOccupant.id)
            };
          }
        }
      }
      return { isValid: true, error: '' };
    }
  };

  const editValidation = getEditValidation();

  // Save location edit
  const handleSaveEdit = async () => {
    if (!selectedFpc || !editValidation.isValid || isUpdating) return;
    setIsUpdating(true);
    try {
      if (newLocationType === 'storage') {
        await updateFPCLocation(employeeId, selectedFpc.id, 'Smart Storage', targetSlot.trim());
      } else {
        // Target is a machine
        const occupant = fpcItems.find(
          f => f.id !== selectedFpc.id && f.location === targetMachine
        );

        if (occupant) {
          if (displacedAction === 'swap') {
            // Swap places
            await swapFPCLocations(employeeId, selectedFpc.id, occupant.id);
          } else {
            // Evict occupant to storage slot first, then move selectedFpc to machine
            await updateFPCLocation(employeeId, occupant.id, 'Smart Storage', evictSlot.trim());
            await updateFPCLocation(employeeId, selectedFpc.id, targetMachine, null);
          }
        } else {
          // Direct move to machine
          await updateFPCLocation(employeeId, selectedFpc.id, targetMachine, null);
        }
      }

      setSuccessMsg(t.locationUpdatedSuccessfully);
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating location');
    } finally {
      setIsUpdating(false);
    }
  };

  // Clear audit logs (Admin only)
  const handleClearLogs = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      clearAuditLogs(employeeId);
      setIsClearLogsConfirmOpen(false);
      setSuccessMsg(language === 'th' ? 'ล้างบันทึกประวัติการทำงานสำเร็จ' : 'Logs cleared successfully');
      fetchData();
    } catch {
      setErrorMsg('Error clearing logs');
    } finally {
      setIsUpdating(false);
    }
  };

  // Add user (Admin only)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;
    setErrorMsg('');
    setSuccessMsg('');
    if (!newEmployeeId.trim() || !newPassword.trim()) {
      setErrorMsg(t.error_validation);
      return;
    }
    setIsUpdating(true);
    try {
      await addUser(employeeId, newEmployeeId.trim(), newPassword.trim(), newRole);
      setSuccessMsg(t.userAddedSuccessfully);
      setNewEmployeeId('');
      setNewPassword('');
      setNewRole('operator');
      fetchUsersList();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error adding user');
    } finally {
      setIsUpdating(false);
    }
  };

  // Click Delete User (Admin only)
  const handleDeleteUserClick = (targetEmpId: string) => {
    if (targetEmpId === employeeId) {
      setErrorMsg(language === 'th' ? 'ไม่สามารถลบตัวเองได้' : 'Cannot delete yourself');
      return;
    }
    setUserToDelete(targetEmpId);
    setIsUserDeleteConfirmOpen(true);
  };

  // Confirm delete user
  const handleConfirmDeleteUser = async () => {
    if (!userToDelete || isUpdating) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsUpdating(true);
    try {
      await deleteUser(employeeId, userToDelete);
      setSuccessMsg(t.userDeletedSuccessfully);
      setIsUserDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsersList();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error deleting user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditUserClick = (user: UserAccount) => {
    setEditEmployeeId(user.employeeId);
    setEditPassword('');
    setEditRole(user.role as 'admin' | 'store' | 'operator');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditUserOpen(true);
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;
    setErrorMsg('');
    setSuccessMsg('');
    const currentUser = usersList.find(u => u.employeeId === editEmployeeId);
    if (!currentUser) {
      setErrorMsg('User not found');
      return;
    }
    const finalPassword = editPassword.trim() || currentUser.passwordHash;
    const finalRole = editEmployeeId === employeeId ? currentUser.role : editRole;
    setIsUpdating(true);
    try {
      await updateUser(employeeId, editEmployeeId, finalPassword, finalRole);
      setSuccessMsg(t.userUpdatedSuccessfully);
      setIsEditUserOpen(false);
      fetchUsersList();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating user');
    } finally {
      setIsUpdating(false);
    }
  };

  // Find occupant of target machine (if any)
  const targetMachineOccupant = selectedFpc && newLocationType === 'machine'
    ? fpcItems.find(f => f.id !== selectedFpc.id && f.location === targetMachine)
    : null;

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      {/* Page Title Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Button
            startIcon={<ArrowLeft className="w-6 h-6" />}
            onClick={onBack}
            variant="outlined"
            size="large"
            className="!px-6 !py-3 !text-lg w-full sm:w-auto shrink-0"
          >
            {t.back}
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                {userRole === 'admin' 
                  ? t.adminPanel 
                  : userRole === 'store' 
                    ? t.managementPanel 
                    : t.adminLogsTab}
              </h2>
            </div>
            <p className="text-muted-foreground text-base mt-1">
              {activeTab === 'logs' ? t.systemLogs : activeTab === 'location' ? t.adminLocationTab : t.userManagement}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
           {userRole === 'admin' && (
             <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-2 rounded-xl border border-border">
               {/* AGV 1 Status Selector */}
               <FormControl variant="outlined" size="small" className="w-[210px] shrink-0">
                 <InputLabel id="agv1-status-label" className="!text-sm !font-bold">AGV 1 Status</InputLabel>
                 <Select
                   labelId="agv1-status-label"
                   value={agv1Status}
                   label="AGV 1 Status"
                   onChange={(e) => {
                     const val = e.target.value as AGVStatus;
                     setAGV1Status(val);
                     setLocalAgv1Status(val);
                   }}
                   sx={{
                     '& .MuiSelect-select': {
                       fontSize: '1rem',
                       fontWeight: '700',
                       py: 1.5,
                     }
                   }}
                   className={`!rounded-xl transition-all ${
                     agv1Status === 'Ok'
                       ? '!text-emerald-600 bg-emerald-50 border-emerald-200'
                       : agv1Status === 'Engineering Use'
                       ? '!text-blue-600 bg-blue-50 border-blue-200'
                       : agv1Status === 'PM'
                       ? '!text-amber-600 bg-amber-50 border-amber-200'
                       : '!text-red-600 bg-red-50 border-red-200'
                   }`}
                 >
                   <MenuItem value="Ok" className="!text-base !font-semibold !text-emerald-600">{translations[language].agvStatusOk}</MenuItem>
                   <MenuItem value="Engineering Use" className="!text-base !font-semibold !text-blue-600">{translations[language].agvStatusEngineering}</MenuItem>
                   <MenuItem value="PM" className="!text-base !font-semibold !text-amber-600">{translations[language].agvStatusPM}</MenuItem>
                   <MenuItem value="Error" className="!text-base !font-semibold !text-red-600">{translations[language].agvStatusError}</MenuItem>
                 </Select>
               </FormControl>

               {/* AGV 2 Status Selector */}
               <FormControl variant="outlined" size="small" className="w-[210px] shrink-0">
                 <InputLabel id="agv2-status-label" className="!text-sm !font-bold">AGV 2 Status</InputLabel>
                 <Select
                   labelId="agv2-status-label"
                   value={agv2Status}
                   label="AGV 2 Status"
                   onChange={(e) => {
                     const val = e.target.value as AGVStatus;
                     setAGV2Status(val);
                     setLocalAgv2Status(val);
                   }}
                   sx={{
                     '& .MuiSelect-select': {
                       fontSize: '1rem',
                       fontWeight: '700',
                       py: 1.5,
                     }
                   }}
                   className={`!rounded-xl transition-all ${
                     agv2Status === 'Ok'
                       ? '!text-emerald-600 bg-emerald-50 border-emerald-200'
                       : agv2Status === 'Engineering Use'
                       ? '!text-blue-600 bg-blue-50 border-blue-200'
                       : agv2Status === 'PM'
                       ? '!text-amber-600 bg-amber-50 border-amber-200'
                       : '!text-red-600 bg-red-50 border-red-200'
                   }`}
                 >
                   <MenuItem value="Ok" className="!text-base !font-semibold !text-emerald-600">{translations[language].agvStatusOk}</MenuItem>
                   <MenuItem value="Engineering Use" className="!text-base !font-semibold !text-blue-600">{translations[language].agvStatusEngineering}</MenuItem>
                   <MenuItem value="PM" className="!text-base !font-semibold !text-amber-600">{translations[language].agvStatusPM}</MenuItem>
                   <MenuItem value="Error" className="!text-base !font-semibold !text-red-600">{translations[language].agvStatusError}</MenuItem>
                 </Select>
               </FormControl>
             </div>
           )}

          <Button
            variant="outlined"
            onClick={() => fetchData(true)}
            className="!py-3 !px-5 !text-lg !font-semibold !border !rounded-xl"
            startIcon={
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            }
          >
            {language === 'th' ? 'รีเฟรช' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <Box className="border-b border-border bg-card rounded-xl shadow-sm px-4">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.05rem',
              fontWeight: '600',
              py: 2,
              textTransform: 'none',
            }
          }}
        >
          <Tab value="logs" label={t.adminLogsTab} icon={<Clock className="w-5 h-5 mr-1" />} iconPosition="start" />
          
          {(userRole === 'admin' || userRole === 'store') && (
            <Tab value="location" label={t.adminLocationTab} icon={<Database className="w-5 h-5 mr-1" />} iconPosition="start" />
          )}

          {(userRole === 'admin' || userRole === 'store') && (
            <Tab value="machines" label={t.machineTab} icon={<Monitor className="w-5 h-5 mr-1" />} iconPosition="start" />
          )}

          {userRole === 'admin' && (
            <Tab value="users" label={t.userManagement} icon={<User className="w-5 h-5 mr-1" />} iconPosition="start" />
          )}
        </Tabs>
      </Box>

      {/* Success and Error messages */}
      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg('')} className="!text-lg !py-3">
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg('')} className="!text-lg !py-3">
          {errorMsg}
        </Alert>
      )}

      {/* Tab Contents */}
      {activeTab === 'logs' && (
        // ──────────────────────── AUDIT LOGS TAB ────────────────────────
        <div className="flex flex-col flex-1 min-h-0 gap-6">
          {/* Summary Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-sm border border-border transition-all hover:border-muted-foreground/40 bg-card">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {language === 'th' ? 'Log ทั้งหมด' : 'Total Logs'}
                  </p>
                  <h3 className="text-3xl font-semibold text-foreground mt-1">{totalCount}</h3>
                </div>
                <div className="p-4 bg-info-background text-info-foreground rounded-2xl">
                  <Activity className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border transition-all hover:border-muted-foreground/40 bg-card">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {language === 'th' ? 'การเข้าใช้งาน' : 'Logins'}
                  </p>
                  <h3 className="text-3xl font-semibold text-foreground mt-1">{loginCount}</h3>
                </div>
                <div className="p-4 bg-success-background text-success-foreground rounded-2xl">
                  <User className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border transition-all hover:border-muted-foreground/40 bg-card">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {language === 'th' ? 'ส่งคำขอเคลื่อนย้าย' : 'Tasks Submitted'}
                  </p>
                  <h3 className="text-3xl font-semibold text-foreground mt-1">{taskSubmitCount}</h3>
                </div>
                <div className="p-4 bg-info-background text-info-foreground rounded-2xl">
                  <Activity className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border transition-all hover:border-muted-foreground/40 bg-card">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {language === 'th' ? 'เปลี่ยนสถานะ AGV' : 'State Changes'}
                  </p>
                  <h3 className="text-3xl font-semibold text-foreground mt-1">{stateChangeCount}</h3>
                </div>
                <div className="p-4 bg-accent text-primary rounded-2xl">
                  <Clock className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logs Table Container */}
          <Card className="flex flex-col flex-1 min-h-0 shadow-sm border border-border rounded-2xl bg-card">
            <CardContent className="flex flex-col h-full p-6 min-h-0 gap-6">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                  <TextField
                    fullWidth
                    label={language === 'th' ? 'ค้นหาด้วยรหัสพนักงาน' : 'Filter by Employee ID'}
                    placeholder={t.searchByOperator}
                    value={searchOperator}
                    onChange={(e) => setSearchOperator(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search className="w-5 h-5 text-muted-foreground" />
                        </InputAdornment>
                      ),
                      className: '!text-xl'
                    }}
                    InputLabelProps={{ className: '!text-lg' }}
                  />

                  <FormControl fullWidth variant="outlined">
                    <InputLabel className="!text-lg">{t.eventType}</InputLabel>
                    <Select
                      value={selectedEventType}
                      onChange={(e) => setSelectedEventType(e.target.value)}
                      label={t.eventType}
                      className="text-xl"
                      sx={{ '& .MuiSelect-select': { fontSize: '1.25rem' } }}
                    >
                      <MenuItem value="ALL" className="!text-lg">{t.allEvents}</MenuItem>
                      <MenuItem value="LOGIN" className="!text-lg">{language === 'th' ? 'LOGIN (เข้าสู่ระบบ)' : 'LOGIN'}</MenuItem>
                      <MenuItem value="LOGOUT" className="!text-lg">{language === 'th' ? 'LOGOUT (ออกจากระบบ)' : 'LOGOUT'}</MenuItem>
                      <MenuItem value="TASK_SUBMIT" className="!text-lg">{language === 'th' ? 'TASK_SUBMIT (สร้างงาน)' : 'TASK_SUBMIT'}</MenuItem>
                      <MenuItem value="STATE_CHANGE" className="!text-lg">{language === 'th' ? 'STATE_CHANGE (เปลี่ยนสถานะ)' : 'STATE_CHANGE'}</MenuItem>
                      <MenuItem value="CONFIRMATION" className="!text-lg">{language === 'th' ? 'CONFIRMATION (การกดยืนยัน)' : 'CONFIRMATION'}</MenuItem>
                      <MenuItem value="CANCEL" className="!text-lg">{language === 'th' ? 'CANCEL (ยกเลิกงาน)' : 'CANCEL'}</MenuItem>
                      <MenuItem value="SYSTEM" className="!text-lg">{language === 'th' ? 'SYSTEM (ระบบ)' : 'SYSTEM'}</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                
                {userRole === 'admin' && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setIsClearLogsConfirmOpen(true)}
                    className="!py-4 !px-6 !text-lg !font-semibold !rounded-xl self-end md:self-auto shrink-0"
                  >
                    {t.clearLogs}
                  </Button>
                )}
              </div>

              <TableContainer component={Paper} className="flex-1 overflow-auto border border-border rounded-xl min-h-0 bg-card">
                <Table stickyHeader className="min-w-[700px]">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '15%' }}>{t.timestamp}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '18%' }}>{t.eventType}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '15%' }}>{t.operator}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3">{t.message}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} hover className="transition-colors">
                          <TableCell className="!text-base !text-muted-foreground !py-3">{formatTime(log.timestamp)}</TableCell>
                          <TableCell className="!py-3">
                            <span className={`px-4 py-1.5 text-base font-semibold rounded-full border ${getEventBadgeClass(log.eventType)}`}>
                              {getEventTypeName(log.eventType)}
                            </span>
                          </TableCell>
                          <TableCell className="!text-base !font-semibold !text-foreground !py-3">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-muted-foreground" />
                              {log.employeeId}
                            </div>
                          </TableCell>
                          <TableCell className="!text-base !text-foreground !py-3">{log.message}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center !py-12 !text-xl !text-muted-foreground">{t.noLogs}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'location' && (userRole === 'admin' || userRole === 'store') && (
        // ──────────────────────── LOCATION CORRECTION TAB ────────────────────────
        <div className="flex flex-col flex-1 min-h-0 gap-6">
          <Card className="flex flex-col flex-1 min-h-0 shadow-sm border border-border rounded-xl bg-card">
            <CardContent className="flex flex-col h-full p-6 min-h-0 gap-6">
              
              {/* Search & Category tabs */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <TextField
                  fullWidth
                  placeholder={t.searchFPCs}
                  value={fpcSearchQuery}
                  onChange={(e) => setFpcSearchQuery(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="w-5 h-5 text-muted-foreground" />
                      </InputAdornment>
                    ),
                    className: '!text-xl'
                  }}
                  className="max-w-md"
                />

                <FormControl className="min-w-[200px]">
                  <InputLabel className="!text-lg">{language === 'th' ? 'ประเภท FPC' : 'FPC Category'}</InputLabel>
                  <Select
                    value={fpcCategoryFilter}
                    onChange={(e) => setFpcCategoryFilter(e.target.value)}
                    label={language === 'th' ? 'ประเภท FPC' : 'FPC Category'}
                    className="text-xl"
                  >
                    <MenuItem value="ALL" className="!text-lg">{t.allTab}</MenuItem>
                    <MenuItem value="Storage" className="!text-lg">{t.storageTab}</MenuItem>
                    <MenuItem value="Service" className="!text-lg">{t.serviceTab}</MenuItem>
                    <MenuItem value="Deposit PM" className="!text-lg">{t.depositPMTab}</MenuItem>
                    <MenuItem value="Deposit Production" className="!text-lg">{t.depositProductionTab}</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* FPC Items Table */}
              <TableContainer component={Paper} className="flex-1 overflow-auto border border-border rounded-xl min-h-0 shadow-inner bg-card">
                <Table stickyHeader className="min-w-[800px]">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '20%' }}>{t.fpcId}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '15%' }}>{language === 'th' ? 'ประเภท' : 'Category'}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '35%' }}>{t.currentLocation}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3" style={{ width: '15%' }}>{t.slotAddress}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3 !text-center">{language === 'th' ? 'การกระทำ' : 'Actions'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFpcs.length > 0 ? (
                      filteredFpcs.map((fpc) => (
                        <TableRow key={fpc.id} hover className="transition-colors">
                          <TableCell className="!text-base !font-mono !font-semibold !text-foreground !py-3">{fpc.id}</TableCell>
                          <TableCell className="!text-base !text-muted-foreground !py-3">{fpc.location === 'Smart Storage' ? fpc.category : '-'}</TableCell>
                          <TableCell className="!text-base !py-3">
                            <div className="flex items-center gap-2">
                              {fpc.location === 'Smart Storage' ? (
                                <>
                                  <Database className="w-5 h-5 text-info" />
                                  <span className="font-semibold text-info-foreground">{t.smartStorage}</span>
                                </>
                              ) : (
                                <>
                                  <Monitor className="w-5 h-5 text-primary" />
                                  <span className="font-semibold text-foreground">{fpc.location}</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="!text-base !font-medium !text-muted-foreground !py-3">{fpc.address}</TableCell>
                          <TableCell className="!py-3 !text-center">
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenEdit(fpc)}
                              startIcon={<Edit className="w-4 h-4" />}
                              className="!font-semibold !rounded-lg !text-base"
                            >
                              {t.editLocation}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center !py-12 !text-base !text-muted-foreground">
                          {language === 'th' ? 'ไม่พบข้อมูล FPC' : 'No FPC items found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'machines' && (userRole === 'admin' || userRole === 'store') && (
        // ──────────────────────── MACHINES MANAGEMENT TAB ────────────────────────
        <div className="flex flex-col flex-1 min-h-0 gap-6">
          <Card className="flex flex-col flex-1 min-h-0 shadow-sm border border-border rounded-xl bg-card">
            <CardContent className="flex flex-col h-full p-6 min-h-0 gap-6">
              
              {/* Search & Category tabs */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <TextField
                  fullWidth
                  placeholder={translations[language].searchMachinePlaceholder}
                  value={machineSearchQuery}
                  onChange={(e) => setMachineSearchQuery(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="w-5 h-5 text-muted-foreground" />
                      </InputAdornment>
                    ),
                    className: '!text-xl'
                  }}
                  className="max-w-md"
                />

                <div className="border-b border-border w-full md:w-auto">
                  <Tabs
                    value={machineFilterTab}
                    onChange={(_e, val) => setMachineFilterTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                      },
                    }}
                  >
                    <Tab value="ALL" label={<div className="flex items-center gap-2"><span>{t.filterAll}</span><span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-bold">{machinesList.length}</span></div>} />
                    <Tab value="empty" label={<div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" /><span>{t.filterEmpty}</span><span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{machinesList.filter(m => m.state === 'empty').length}</span></div>} />
                    <Tab value="occupied" label={<div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" /><span>{t.filterOccupied}</span><span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{machinesList.filter(m => m.state === 'occupied').length}</span></div>} />
                    <Tab value="reserved" label={<div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" /><span>{t.filterReserved}</span><span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{machinesList.filter(m => m.state === 'reserved').length}</span></div>} />
                    <Tab value="unavailable" label={<div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" /><span>{t.filterUnavailable}</span><span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{machinesList.filter(m => m.state === 'unavailable').length}</span></div>} />
                  </Tabs>
                </div>
              </div>

              {/* Grid List */}
              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
                  {filteredMachinesList.map((machine) => {
                    let badgeClass: string;
                    let dotClass: string;
                    let labelText: string;

                    switch (machine.state) {
                      case 'empty':
                        badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                        dotClass = 'bg-emerald-500';
                        labelText = t.machineStateEmpty;
                        break;
                      case 'occupied':
                        badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                        dotClass = 'bg-blue-500';
                        labelText = t.machineStateOccupied;
                        break;
                      case 'reserved':
                        badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                        dotClass = 'bg-amber-500';
                        labelText = t.machineStateReserved;
                        break;
                      case 'unavailable':
                      default:
                        badgeClass = 'bg-gray-100 text-gray-600 border-gray-200';
                        dotClass = 'bg-gray-400';
                        if (machine.disableReason === 'PM / Maintenance') {
                          labelText = language === 'th' ? 'PM / ซ่อมบำรุง' : 'PM / Maintenance';
                        } else if (machine.disableReason === 'Breakdown / Error') {
                          labelText = language === 'th' ? 'เครื่องเสีย (Breakdown)' : 'Breakdown / Error';
                        } else if (machine.disableReason === 'Engineering Use') {
                          labelText = language === 'th' ? 'งานวิศวกรรม (Engineering)' : 'Engineering Use';
                        } else {
                          labelText = t.machineStateUnavailable;
                        }
                        break;
                    }

                    return (
                      <Card key={machine.id} className="border border-border rounded-xl bg-card hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center space-y-4">
                          <div className="text-2xl font-bold text-foreground">{machine.name}</div>
                          <div className="text-lg text-muted-foreground font-mono">{machine.id}</div>
                          
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium border ${badgeClass}`}>
                            <span className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
                            <span>{labelText}</span>
                          </div>

                          <Button
                            variant={machine.available ? 'contained' : 'outlined'}
                            onClick={() => handleToggleMachine(machine.id, machine.available)}
                            className={`!w-full !py-2 !rounded-xl !font-bold ${
                              machine.available
                                ? '!bg-emerald-600 hover:!bg-emerald-700 text-white'
                                : '!border-red-500 !text-red-500 hover:!bg-red-55'
                            }`}
                          >
                            {machine.available
                              ? (language === 'th' ? 'เปิดใช้งานอยู่' : 'Enabled')
                              : (language === 'th' ? 'ปิดใช้งานอยู่' : 'Disabled')}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredMachinesList.length === 0 && (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-2xl text-muted-foreground">{t.noResults}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && userRole === 'admin' && (
        // ──────────────────────── USER MANAGEMENT TAB ────────────────────────
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Add User Form Card */}
          <Card className="shadow-sm border border-border rounded-xl h-fit bg-card">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">{t.addUser}</h3>
              <form onSubmit={handleAddUser} className="space-y-6">
                <div>
                  <TextField
                    fullWidth
                    label={t.enterNewEmployeeId}
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    variant="outlined"
                    disabled={isUpdating}
                    InputProps={{ className: '!text-lg' }}
                    InputLabelProps={{ className: '!text-md' }}
                  />
                </div>
                
                <div>
                  <TextField
                    fullWidth
                    type="password"
                    label={t.enterNewPassword}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    disabled={isUpdating}
                    InputProps={{ className: '!text-lg' }}
                    InputLabelProps={{ className: '!text-md' }}
                  />
                </div>

                <div>
                  <FormControl fullWidth variant="outlined" disabled={isUpdating}>
                    <InputLabel className="!text-md">{t.selectRole}</InputLabel>
                    <Select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as 'admin' | 'store' | 'operator')}
                      label={t.selectRole}
                      className="text-lg"
                    >
                      <MenuItem value="admin" className="!text-lg">{t.admin}</MenuItem>
                      <MenuItem value="store" className="!text-lg">{t.store}</MenuItem>
                      <MenuItem value="operator" className="!text-lg">{t.operatorRole}</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isUpdating}
                  className="!py-4 !text-base !font-semibold !bg-primary hover:!bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  {isUpdating ? t.processing : t.addUser}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* User List Table Card */}
          <Card className="lg:col-span-2 flex flex-col flex-1 min-h-0 shadow-sm border border-border rounded-xl bg-card">
            <CardContent className="flex flex-col h-full p-6 min-h-0 gap-6">
              <h3 className="text-xl font-semibold text-foreground">{t.userManagement}</h3>
              <TableContainer component={Paper} className="flex-1 overflow-auto border border-border rounded-xl min-h-0 shadow-inner bg-card">
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3">{t.employeeId}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3">{t.role}</TableCell>
                      <TableCell className="!text-base !font-semibold !bg-background !text-muted-foreground !py-3 !text-center">{language === 'th' ? 'การกระทำ' : 'Actions'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersList.map((user) => (
                      <TableRow key={user.employeeId} hover>
                        <TableCell className="!text-base !font-semibold !text-foreground !py-3">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-muted-foreground" />
                            {user.employeeId}
                          </div>
                        </TableCell>
                        <TableCell className="!text-base !py-3">
                          <span className={`px-4 py-1 text-base font-semibold rounded-full border ${
                            user.role === 'admin'
                              ? 'bg-error-background text-error-foreground border-error/30'
                              : user.role === 'store'
                              ? 'bg-warning-background text-warning-foreground border-warning/30'
                              : 'bg-success-background text-success-foreground border-success/30'
                          }`}>
                            {user.role === 'admin' ? t.admin : user.role === 'store' ? t.store : t.operatorRole}
                          </span>
                        </TableCell>
                        <TableCell className="!py-3 !text-center">
                          <div className="flex justify-center gap-3">
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleEditUserClick(user)}
                              className="!font-semibold !rounded-lg !text-base"
                            >
                              {language === 'th' ? 'แก้ไข' : 'Edit'}
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              disabled={user.employeeId === employeeId}
                              onClick={() => handleDeleteUserClick(user.employeeId)}
                              className="!font-semibold !rounded-lg !text-base"
                            >
                              {language === 'th' ? 'ลบ' : 'Delete'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ──────────────────────── EDIT LOCATION DIALOG ──────────────────────── */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: '!p-4 !rounded-xl shadow-md !bg-card !text-foreground' }}
      >
        <DialogTitle className="!text-xl !font-semibold !pb-2">
          {t.editLocation} ({selectedFpc?.id})
        </DialogTitle>
        <DialogContent className="!pt-4 space-y-6">
          {/* Target Location Type Picker */}
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={newLocationType}
              onChange={(e) => setNewLocationType(e.target.value as 'storage' | 'machine')}
            >
              <FormControlLabel
                value="storage"
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} disabled={isUpdating} />}
                label={<span className="text-base font-medium">{t.smartStorageOption}</span>}
                className="!mr-8"
              />
              <FormControlLabel
                value="machine"
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} disabled={isUpdating} />}
                label={<span className="text-base font-medium">{t.machineOption}</span>}
              />
            </RadioGroup>
          </FormControl>

          {/* Conditional Inputs */}
          {newLocationType === 'storage' ? (
            <div className="space-y-2">
              <TextField
                fullWidth
                label={t.enterAddress}
                placeholder="e.g. 015"
                value={targetSlot}
                onChange={(e) => setTargetSlot(e.target.value)}
                variant="outlined"
                disabled={isUpdating}
                error={!editValidation.isValid && targetSlot.trim() !== ''}
                helperText={!editValidation.isValid && targetSlot.trim() !== '' ? editValidation.error : ''}
                InputProps={{ className: '!text-lg' }}
                InputLabelProps={{ className: '!text-md' }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <FormControl fullWidth variant="outlined" disabled={isUpdating}>
                <InputLabel className="!text-md">{t.selectMachine}</InputLabel>
                <Select
                  value={targetMachine}
                  onChange={(e) => setTargetMachine(e.target.value)}
                  label={t.selectMachine}
                  className="text-lg"
                >
                  {mockMachines.map((m) => (
                    <MenuItem key={m.id} value={m.id} className="!text-lg">
                      {m.name} {!m.available ? `(${t.unavailable})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Target Machine Occupancy Alert & Displaced Options */}
              {targetMachineOccupant && (
                <div className="space-y-4 p-4 border border-error/30 bg-error-background rounded-xl">
                  <div className="flex items-start gap-2 text-error-foreground">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-base">
                        {t.errorMachineOccupied
                          .replace('{machineId}', targetMachine)
                          .replace('{fpcId}', targetMachineOccupant.id)}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">{t.displacedActionDesc}</p>
                    </div>
                  </div>

                  <RadioGroup
                    value={displacedAction}
                    onChange={(e) => setDisplacedAction(e.target.value as 'swap' | 'evict')}
                    className="!pl-2"
                  >
                    <FormControlLabel
                      value="swap"
                      control={<Radio size="small" disabled={isUpdating} />}
                      label={
                        <span className="text-sm font-medium text-foreground">
                          {t.swapWithOccupant} ({selectedFpc?.id} ↔ {targetMachineOccupant.id})
                        </span>
                      }
                    />
                    <FormControlLabel
                      value="evict"
                      control={<Radio size="small" disabled={isUpdating} />}
                      label={
                        <span className="text-sm font-medium text-foreground">
                          {t.moveDisplacedToStorage}
                        </span>
                      }
                    />
                  </RadioGroup>

                  {/* Evict target slot address validation */}
                  {displacedAction === 'evict' && (
                    <div className="pt-2">
                      <TextField
                        fullWidth
                        size="small"
                        label={t.selectEmptySlot}
                        placeholder="e.g. 016"
                        value={evictSlot}
                        onChange={(e) => setEvictSlot(e.target.value)}
                        variant="outlined"
                        disabled={isUpdating}
                        error={!editValidation.isValid && evictSlot.trim() !== ''}
                        helperText={!editValidation.isValid && evictSlot.trim() !== '' ? editValidation.error : ''}
                        InputProps={{ className: '!text-base' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Validation Alert (if input is invalid but fields not empty) */}
          {!editValidation.isValid && editValidation.error && (
            <Alert severity="warning" className="!py-2 !text-base">
              {editValidation.error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions className="!p-6 !pt-2">
          <Button
            onClick={() => setIsEditOpen(false)}
            variant="outlined"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            size="large"
            disabled={!editValidation.isValid || isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl !bg-primary hover:!bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            {isUpdating ? t.processing : t.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ──────────────────────── CLEAR LOGS CONFIRM DIALOG ──────────────────────── */}
      <Dialog
        open={isClearLogsConfirmOpen}
        onClose={() => setIsClearLogsConfirmOpen(false)}
        PaperProps={{ className: '!p-4 !rounded-xl shadow-md !bg-card !text-foreground' }}
      >
        <DialogTitle className="!text-xl !font-semibold !pb-2">
          {t.confirmClearLogsTitle}
        </DialogTitle>
        <DialogContent>
          <p className="text-base text-foreground">
            {t.confirmClearLogsMessage}
          </p>
        </DialogContent>
        <DialogActions className="!p-6 !pt-2">
          <Button
            onClick={() => setIsClearLogsConfirmOpen(false)}
            variant="outlined"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleClearLogs}
            variant="contained"
            color="error"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl disabled:opacity-50"
          >
            {isUpdating ? t.processing : t.confirm}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ──────────────────────── USER DELETE CONFIRM DIALOG ──────────────────────── */}
      <Dialog
        open={isUserDeleteConfirmOpen}
        onClose={() => setIsUserDeleteConfirmOpen(false)}
        PaperProps={{ className: '!p-4 !rounded-xl shadow-md !bg-card !text-foreground' }}
      >
        <DialogTitle className="!text-xl !font-semibold !pb-2">
          {t.deleteUser}
        </DialogTitle>
        <DialogContent>
          <p className="text-base text-foreground">
            {t.confirmDeleteUser.replace('{employeeId}', userToDelete || '')}
          </p>
        </DialogContent>
        <DialogActions className="!p-6 !pt-2">
          <Button
            onClick={() => setIsUserDeleteConfirmOpen(false)}
            variant="outlined"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleConfirmDeleteUser}
            variant="contained"
            color="error"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl disabled:opacity-50"
          >
            {isUpdating ? t.processing : (language === 'th' ? 'ยืนยันการลบ' : 'Confirm Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ──────────────────────── EDIT USER DIALOG ──────────────────────── */}
      <Dialog
        open={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: '!p-4 !rounded-xl shadow-md !bg-card !text-foreground' }}
      >
        <DialogTitle className="!text-xl !font-semibold !pb-2">
          {t.editUser} ({editEmployeeId})
        </DialogTitle>
        <form onSubmit={handleSaveEditUser}>
          <DialogContent className="!pt-4 space-y-6">
            <div>
              <TextField
                fullWidth
                disabled
                label={t.employeeId}
                value={editEmployeeId}
                variant="outlined"
                InputProps={{ className: '!text-lg' }}
                InputLabelProps={{ className: '!text-md' }}
              />
            </div>
            
            <div>
              <TextField
                fullWidth
                type="password"
                label={t.password}
                placeholder={t.enterNewPasswordPlaceholder}
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                variant="outlined"
                disabled={isUpdating}
                InputProps={{ className: '!text-lg' }}
                InputLabelProps={{ className: '!text-md' }}
              />
            </div>

            <div>
              <FormControl fullWidth variant="outlined" disabled={editEmployeeId === employeeId || isUpdating}>
                <InputLabel className="!text-md">{t.selectRole}</InputLabel>
                <Select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'admin' | 'store' | 'operator')}
                  label={t.selectRole}
                  className="text-lg"
                >
                  <MenuItem value="admin" className="!text-lg">{t.admin}</MenuItem>
                  <MenuItem value="store" className="!text-lg">{t.store}</MenuItem>
                  <MenuItem value="operator" className="!text-lg">{t.operatorRole}</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions className="!p-6 !pt-2">
            <Button
              onClick={() => setIsEditUserOpen(false)}
              variant="outlined"
              size="large"
              disabled={isUpdating}
              className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isUpdating}
              className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl !bg-primary hover:!bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {isUpdating ? t.processing : t.save}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── TOGGLE MACHINE STATUS CONFIRMATION DIALOG ── */}
      <Dialog
        open={isToggleMachineDialogOpen}
        onClose={() => !isUpdating && setIsToggleMachineDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        className="!rounded-2xl"
      >
        <DialogTitle className="!text-2xl !font-bold !pb-2">
          {targetMachineAvailable ? t.confirmToggleActiveTitle : t.confirmToggleMachineTitle}
        </DialogTitle>
        <DialogContent className="!pt-4 space-y-6">
          <p className="text-xl text-muted-foreground">
            {targetMachineAvailable
              ? t.confirmToggleActiveMessage.replace('{machineId}', targetMachineId || '')
              : t.confirmToggleMachineMessage.replace('{machineId}', targetMachineId || '')}
          </p>

          {!targetMachineAvailable && (
            <div className="space-y-4">
              <FormControl fullWidth variant="outlined" error={!!toggleError}>
                <InputLabel className="!text-lg">{t.reasonLabel}</InputLabel>
                <Select
                  value={toggleReason}
                  onChange={(e) => {
                    setToggleReason(e.target.value);
                    setToggleError('');
                  }}
                  label={t.reasonLabel}
                  className="text-lg"
                >
                  <MenuItem value="pm" className="!text-lg">{t.reasonMaintenance}</MenuItem>
                  <MenuItem value="breakdown" className="!text-lg">{t.reasonBreakdown}</MenuItem>
                  <MenuItem value="engineering" className="!text-lg">{t.reasonEngineering}</MenuItem>
                  <MenuItem value="other" className="!text-lg">{t.reasonOther}</MenuItem>
                </Select>
                {toggleError && <p className="text-red-500 text-sm mt-1">{toggleError}</p>}
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label={t.commentLabel}
                placeholder={t.overrideCommentPlaceholder}
                value={toggleComment}
                onChange={(e) => setToggleComment(e.target.value)}
                variant="outlined"
                InputProps={{ className: '!text-lg' }}
                InputLabelProps={{ className: '!text-md' }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions className="!p-6 !pt-2">
          <Button
            onClick={() => setIsToggleMachineDialogOpen(false)}
            variant="outlined"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl"
          >
            {t.cancelBtn}
          </Button>
          <Button
            onClick={async () => {
              if (!targetMachineAvailable && !toggleReason) {
                setToggleError(t.reasonRequiredError);
                return;
              }
              setIsUpdating(true);
              try {
                let reasonLabel = '';
                if (!targetMachineAvailable) {
                  if (toggleReason === 'pm') reasonLabel = 'PM / Maintenance';
                  else if (toggleReason === 'breakdown') reasonLabel = 'Breakdown / Error';
                  else if (toggleReason === 'engineering') reasonLabel = 'Engineering Use';
                  else reasonLabel = 'Other';
                }
                await updateMachineAvailability(
                  employeeId,
                  targetMachineId!,
                  targetMachineAvailable,
                  reasonLabel,
                  toggleComment
                );
                setSuccessMsg(t.commentUpdatedSuccessfully || 'Status updated successfully');
                setIsToggleMachineDialogOpen(false);
                setToggleReason('');
                setToggleComment('');
                fetchData();
              } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update machine availability';
                setErrorMsg(message);
              } finally {
                setIsUpdating(false);
              }
            }}
            variant="contained"
            size="large"
            disabled={isUpdating}
            className="!py-2.5 !px-6 !text-base !font-semibold !rounded-xl !bg-primary hover:!bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            {isUpdating ? t.processing : t.confirmBtn}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
