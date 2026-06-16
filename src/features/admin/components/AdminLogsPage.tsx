import { useState, useEffect } from 'react';
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
  Alert,
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
  type FPCItem
} from '@/shared/utils/mockApi';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

interface AdminLogsPageProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
}

export function AdminLogsPage({ employeeId, language, onBack }: AdminLogsPageProps) {
  // Page Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Audit Logs state
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchOperator, setSearchOperator] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');

  // FPCs state
  const [fpcItems, setFpcItems] = useState<FPCItem[]>([]);
  const [fpcSearchQuery, setFpcSearchQuery] = useState('');
  const [fpcCategoryFilter, setFpcCategoryFilter] = useState<string>('ALL');

  const [isRefreshing, setIsRefreshing] = useState(false);
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


  // Fetch all admin data (logs and FPCs)
  const fetchData = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const [logsData, fpcsData] = await Promise.all([
        getAuditLogs(),
        getAllFPCs()
      ]);
      setLogs(logsData);
      setFpcItems(fpcsData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      if (showSpinner) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Poll for live data every 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesOperator = log.employeeId.toLowerCase().includes(searchOperator.toLowerCase());
    const matchesType = selectedEventType === 'ALL' || log.eventType === selectedEventType;
    return matchesOperator && matchesType;
  });

  // Filter FPCs
  const filteredFpcs = fpcItems.filter(fpc => {
    const matchesCategory = fpcCategoryFilter === 'ALL' || fpc.category === fpcCategoryFilter;
    const lowerQuery = fpcSearchQuery.toLowerCase();
    const matchesSearch =
      fpc.id.toLowerCase().includes(lowerQuery) ||
      fpc.address.toLowerCase().includes(lowerQuery) ||
      fpc.label.toLowerCase().includes(lowerQuery) ||
      fpc.location.toLowerCase().includes(lowerQuery) ||
      (fpc.comment && fpc.comment.toLowerCase().includes(lowerQuery));
    return matchesCategory && matchesSearch;
  });

  // Calculate stats for Audit tab
  const totalCount = logs.length;
  const loginCount = logs.filter(l => l.eventType === 'LOGIN').length;
  const taskSubmitCount = logs.filter(l => l.eventType === 'TASK_SUBMIT').length;
  const stateChangeCount = logs.filter(l => l.eventType === 'STATE_CHANGE').length;

  const getEventBadgeClass = (type: AuditLog['eventType']) => {
    switch (type) {
      case 'LOGIN': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LOGOUT': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'TASK_SUBMIT': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'STATE_CHANGE': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CONFIRMATION': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCEL': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SYSTEM':
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
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
    if (!selectedFpc || !editValidation.isValid) return;

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
    }
  };



  // Find occupant of target machine (if any)
  const targetMachineOccupant = selectedFpc && newLocationType === 'machine'
    ? fpcItems.find(f => f.id !== selectedFpc.id && f.location === targetMachine)
    : null;

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      {/* Page Title Panel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 text-gray-600 hover:text-gray-900 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600 animate-pulse" />
              <h2 className="text-3xl font-extrabold text-gray-900">
                {t.adminPanel}
              </h2>
            </div>
            <p className="text-gray-500 text-lg mt-1">
              {activeTab === 0 ? t.systemLogs : t.adminLocationTab}
            </p>
          </div>
        </div>

        <div className="flex gap-4">

          <Button
            variant="outlined"
            onClick={() => fetchData(true)}
            className="!py-3 !px-5 !text-lg !font-bold !border-2 !rounded-xl"
            startIcon={
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            }
          >
            {language === 'th' ? 'รีเฟรช' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <Box className="border-b border-gray-200 bg-white rounded-xl shadow-sm px-4">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.2rem',
              fontWeight: 'bold',
              py: 2,
              textTransform: 'none',
            }
          }}
        >
          <Tab label={t.adminLogsTab} icon={<Clock className="w-5 h-5 mr-1" />} iconPosition="start" />
          <Tab label={t.adminLocationTab} icon={<Database className="w-5 h-5 mr-1" />} iconPosition="start" />
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
      {activeTab === 0 ? (
        // ──────────────────────── AUDIT LOGS TAB ────────────────────────
        <div className="flex flex-col flex-1 min-h-0 gap-6">
          {/* Summary Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-md border-l-4 border-l-blue-600 transition-all hover:scale-[1.02]">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'th' ? 'Log ทั้งหมด' : 'Total Logs'}
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-950 mt-1">{totalCount}</h3>
                </div>
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                  <Activity className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-l-4 border-l-emerald-600 transition-all hover:scale-[1.02]">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'th' ? 'การเข้าใช้งาน' : 'Logins'}
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-950 mt-1">{loginCount}</h3>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <User className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-l-4 border-l-sky-600 transition-all hover:scale-[1.02]">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'th' ? 'ส่งคำขอเคลื่อนย้าย' : 'Tasks Submitted'}
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-950 mt-1">{taskSubmitCount}</h3>
                </div>
                <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
                  <Activity className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-l-4 border-l-indigo-600 transition-all hover:scale-[1.02]">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'th' ? 'เปลี่ยนสถานะ AGV' : 'State Changes'}
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-950 mt-1">{stateChangeCount}</h3>
                </div>
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Clock className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logs Table Container */}
          <Card className="flex flex-col flex-1 min-h-0 shadow-lg border-2 border-gray-100 rounded-2xl">
            <CardContent className="flex flex-col h-full p-6 min-h-0 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Search className="w-5 h-5 text-gray-400" />
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

              <TableContainer component={Paper} className="flex-1 overflow-auto border border-gray-200 rounded-xl min-h-0 shadow-inner">
                <Table stickyHeader className="min-w-[700px]">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '15%' }}>{t.timestamp}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '18%' }}>{t.eventType}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '15%' }}>{t.operator}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4">{t.message}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} hover className="transition-colors">
                          <TableCell className="!text-lg !text-gray-600 !py-4">{formatTime(log.timestamp)}</TableCell>
                          <TableCell className="!py-4">
                            <span className={`px-4 py-1.5 text-base font-bold rounded-full border ${getEventBadgeClass(log.eventType)}`}>
                              {getEventTypeName(log.eventType)}
                            </span>
                          </TableCell>
                          <TableCell className="!text-lg !font-bold !text-gray-900 !py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-gray-400" />
                              {log.employeeId}
                            </div>
                          </TableCell>
                          <TableCell className="!text-lg !text-gray-800 !py-4">{log.message}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center !py-12 !text-xl !text-gray-400">{t.noLogs}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        // ──────────────────────── LOCATION CORRECTION TAB ────────────────────────
        <div className="flex flex-col flex-1 min-h-0 gap-6">
          <Card className="flex flex-col flex-1 min-h-0 shadow-lg border-2 border-gray-100 rounded-2xl">
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
                        <Search className="w-5 h-5 text-gray-400" />
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
              <TableContainer component={Paper} className="flex-1 overflow-auto border border-gray-200 rounded-xl min-h-0 shadow-inner">
                <Table stickyHeader className="min-w-[800px]">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '20%' }}>{t.fpcId}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '15%' }}>{language === 'th' ? 'ประเภท' : 'Category'}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '35%' }}>{t.currentLocation}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '15%' }}>{t.slotAddress}</TableCell>
                      <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4 !text-center">{language === 'th' ? 'การกระทำ' : 'Actions'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFpcs.length > 0 ? (
                      filteredFpcs.map((fpc) => (
                        <TableRow key={fpc.id} hover className="transition-colors">
                          <TableCell className="!text-lg !font-mono !font-bold !text-gray-900 !py-4">{fpc.id}</TableCell>
                          <TableCell className="!text-lg !text-gray-600 !py-4">{fpc.location === 'Smart Storage' ? fpc.category : '-'}</TableCell>
                          <TableCell className="!text-lg !py-4">
                            <div className="flex items-center gap-2">
                              {fpc.location === 'Smart Storage' ? (
                                <>
                                  <Database className="w-5 h-5 text-sky-600" />
                                  <span className="font-semibold text-sky-800">{t.smartStorage}</span>
                                </>
                              ) : (
                                <>
                                  <Monitor className="w-5 h-5 text-indigo-600" />
                                  <span className="font-bold text-indigo-800">{fpc.location}</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="!text-lg !font-semibold !text-gray-700 !py-4">{fpc.address}</TableCell>
                          <TableCell className="!py-4 !text-center">
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenEdit(fpc)}
                              startIcon={<Edit className="w-4 h-4" />}
                              className="!font-bold !rounded-lg !text-base"
                            >
                              {t.editLocation}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center !py-12 !text-xl !text-gray-400">
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

      {/* ──────────────────────── EDIT LOCATION DIALOG ──────────────────────── */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: '!p-4 !rounded-2xl shadow-xl' }}
      >
        <DialogTitle className="!text-2xl !font-extrabold !pb-2">
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
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                label={<span className="text-lg font-semibold">{t.smartStorageOption}</span>}
                className="!mr-8"
              />
              <FormControlLabel
                value="machine"
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                label={<span className="text-lg font-semibold">{t.machineOption}</span>}
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
                error={!editValidation.isValid && targetSlot.trim() !== ''}
                helperText={!editValidation.isValid && targetSlot.trim() !== '' ? editValidation.error : ''}
                InputProps={{ className: '!text-lg' }}
                InputLabelProps={{ className: '!text-md' }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <FormControl fullWidth variant="outlined">
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
                <div className="space-y-4 p-4 border border-rose-200 bg-rose-50 rounded-xl">
                  <div className="flex items-start gap-2 text-rose-800">
                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-lg">
                        {t.errorMachineOccupied
                          .replace('{machineId}', targetMachine)
                          .replace('{fpcId}', targetMachineOccupant.id)}
                      </p>
                      <p className="text-sm mt-1">{t.displacedActionDesc}</p>
                    </div>
                  </div>

                  <RadioGroup
                    value={displacedAction}
                    onChange={(e) => setDisplacedAction(e.target.value as 'swap' | 'evict')}
                    className="!pl-2"
                  >
                    <FormControlLabel
                      value="swap"
                      control={<Radio size="small" />}
                      label={
                        <span className="text-base font-semibold text-rose-950">
                          {t.swapWithOccupant} ({selectedFpc?.id} ↔ {targetMachineOccupant.id})
                        </span>
                      }
                    />
                    <FormControlLabel
                      value="evict"
                      control={<Radio size="small" />}
                      label={
                        <span className="text-base font-semibold text-rose-950">
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
            className="!py-3 !px-8 !text-lg !rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            size="large"
            disabled={!editValidation.isValid}
            className="!py-3 !px-8 !text-lg !rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:!bg-gray-300"
          >
            {t.save}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
