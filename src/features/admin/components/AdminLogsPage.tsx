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
} from '@mui/material';
import {
  Search,
  Clock,
  Shield,
  Activity,
  ArrowLeft,
  User,
  RefreshCw
} from 'lucide-react';
import { getAuditLogs, type AuditLog } from '@/shared/utils/mockApi';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

interface AdminLogsPageProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
}

export function AdminLogsPage({ language, onBack }: AdminLogsPageProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchOperator, setSearchOperator] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = translations[language];

  // Fetch logs function
  const fetchLogs = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      if (showSpinner) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Poll for logs every 1 second (so live simulator updates pop up automatically)
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => {
      fetchLogs();
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  // Filter logs based on search inputs
  const filteredLogs = logs.filter(log => {
    const matchesOperator = log.employeeId.toLowerCase().includes(searchOperator.toLowerCase());
    const matchesType = selectedEventType === 'ALL' || log.eventType === selectedEventType;
    return matchesOperator && matchesType;
  });

  // Calculate some simple stats for the dashboard layout
  const totalCount = logs.length;
  const loginCount = logs.filter(l => l.eventType === 'LOGIN').length;
  const taskSubmitCount = logs.filter(l => l.eventType === 'TASK_SUBMIT').length;
  const stateChangeCount = logs.filter(l => l.eventType === 'STATE_CHANGE').length;

  const getEventBadgeClass = (type: AuditLog['eventType']) => {
    switch (type) {
      case 'LOGIN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LOGOUT':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'TASK_SUBMIT':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'STATE_CHANGE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CONFIRMATION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCEL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SYSTEM':
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
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
              <Shield className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-extrabold text-gray-900">
                {t.adminPanel}
              </h2>
            </div>
            <p className="text-gray-500 text-lg mt-1">{t.systemLogs}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outlined"
            onClick={() => fetchLogs(true)}
            className="!py-3 !px-5 !text-lg !font-bold !border-2 !rounded-xl"
            startIcon={
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            }
          >
            {language === 'th' ? 'รีเฟรช' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md border-l-4 border-l-blue-600">
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

        <Card className="shadow-md border-l-4 border-l-emerald-600">
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

        <Card className="shadow-md border-l-4 border-l-sky-600">
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

        <Card className="shadow-md border-l-4 border-l-indigo-600">
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

      {/* Filter and Table Container */}
      <Card className="flex flex-col flex-1 min-h-0 shadow-lg border-2 border-gray-100 rounded-2xl">
        <CardContent className="flex flex-col h-full p-6 min-h-0 gap-6">
          
          {/* Filtering controls */}
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
              InputLabelProps={{
                className: '!text-lg'
              }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel className="!text-lg">
                {t.eventType}
              </InputLabel>
              <Select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                label={t.eventType}
                className="text-xl"
                sx={{ '& .MuiSelect-select': { fontSize: '1.25rem' } }}
              >
                <MenuItem value="ALL" className="!text-lg">
                  {t.allEvents}
                </MenuItem>
                <MenuItem value="LOGIN" className="!text-lg">
                  {language === 'th' ? 'LOGIN (เข้าสู่ระบบ)' : 'LOGIN'}
                </MenuItem>
                <MenuItem value="LOGOUT" className="!text-lg">
                  {language === 'th' ? 'LOGOUT (ออกจากระบบ)' : 'LOGOUT'}
                </MenuItem>
                <MenuItem value="TASK_SUBMIT" className="!text-lg">
                  {language === 'th' ? 'TASK_SUBMIT (สร้างงาน)' : 'TASK_SUBMIT'}
                </MenuItem>
                <MenuItem value="STATE_CHANGE" className="!text-lg">
                  {language === 'th' ? 'STATE_CHANGE (เปลี่ยนสถานะ AGV)' : 'STATE_CHANGE'}
                </MenuItem>
                <MenuItem value="CONFIRMATION" className="!text-lg">
                  {language === 'th' ? 'CONFIRMATION (การกดยืนยัน)' : 'CONFIRMATION'}
                </MenuItem>
                <MenuItem value="CANCEL" className="!text-lg">
                  {language === 'th' ? 'CANCEL (ยกเลิกงาน)' : 'CANCEL'}
                </MenuItem>
                <MenuItem value="SYSTEM" className="!text-lg">
                  {language === 'th' ? 'SYSTEM (ระบบ)' : 'SYSTEM'}
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Table list view */}
          <TableContainer component={Paper} className="flex-1 overflow-auto border border-gray-200 rounded-xl min-h-0">
            <Table stickyHeader className="min-w-[700px]">
              <TableHead>
                <TableRow>
                  <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '15%' }}>
                    {t.timestamp}
                  </TableCell>
                  <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '18%' }}>
                    {t.eventType}
                  </TableCell>
                  <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4" style={{ width: '15%' }}>
                    {t.operator}
                  </TableCell>
                  <TableCell className="!text-lg !font-bold !bg-gray-100 !text-gray-700 !py-4">
                    {t.message}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} hover className="transition-colors">
                      <TableCell className="!text-lg !text-gray-600 !py-4">
                        {formatTime(log.timestamp)}
                      </TableCell>
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
                      <TableCell className="!text-lg !text-gray-800 !py-4">
                        {log.message}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center !py-12 !text-xl !text-gray-400">
                      {t.noLogs}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
