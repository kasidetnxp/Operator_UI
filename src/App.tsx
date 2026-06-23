import { useState, useEffect } from 'react';
import { EmployeeLogin, EmployeeMenu } from '@/features/auth';
import { ModeSelection, ReturnFPCWorkflow, RequestFPCWorkflow, MoveFPCWorkflow, FPCSearchPage, UnloadLoadWorkflow } from '@/features/workflow';
import { TaskQueuePage } from '@/features/queue';
import { AdminLogsPage } from '@/features/admin';
import { addAuditLog, getAGV1Status, getAGV2Status } from '@/shared/utils/mockApi';
import { translations } from '@/shared/utils/translations';
import type { Language, OperationMode, Page, Role } from '@/shared/types';

export default function App() {
  const [language] = useState<Language>('th');
  const [employeeId, setEmployeeId] = useState<string>(() => localStorage.getItem('nxp_employee_id') || '');
  const [role, setRole] = useState<Role | null>(() => localStorage.getItem('nxp_role') as Role | null);
  const [floor, setFloor] = useState<string>(() => localStorage.getItem('nxp_floor') || 'E4');
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedRole = localStorage.getItem('nxp_role');
    if (savedRole === 'admin' || savedRole === 'store') {
      return 'admin';
    }
    return 'mode-selection';
  });
  const [agv1Status, setAgv1StatusLocal] = useState<'OK' | 'ERROR'>('OK');
  const [agv2Status, setAgv2StatusLocal] = useState<'OK' | 'ERROR'>('OK');

  useEffect(() => {
    const checkAGVStatus = () => {
      setAgv1StatusLocal(getAGV1Status());
      setAgv2StatusLocal(getAGV2Status());
    };
    checkAGVStatus();
    const interval = setInterval(checkAGVStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (id: string, userRole: Role, selectedFloor: string) => {
    setEmployeeId(id);
    setRole(userRole);
    setFloor(selectedFloor);
    localStorage.setItem('nxp_employee_id', id);
    localStorage.setItem('nxp_role', userRole);
    localStorage.setItem('nxp_floor', selectedFloor);
    addAuditLog('LOGIN', id, `Employee logged in successfully as ${userRole} on Floor ${selectedFloor}`);
    if (userRole === 'admin' || userRole === 'store') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('mode-selection');
    }
  };

  const handleLogout = () => {
    if (employeeId) {
      addAuditLog('LOGOUT', employeeId, 'Employee logged out');
    }
    setEmployeeId('');
    setRole(null);
    setFloor('E4');
    localStorage.removeItem('nxp_employee_id');
    localStorage.removeItem('nxp_role');
    localStorage.removeItem('nxp_floor');
    setCurrentPage('mode-selection');
  };

  const handleSelectMode = (mode: OperationMode) => {
    setCurrentPage(mode);
  };

  const handleBackToModeSelection = () => {
    if (role === 'admin' || role === 'store') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('mode-selection');
    }
  };

  const handleGoToQueue = () => {
    setCurrentPage('queue');
  };

  const handleGoToFPCSearch = () => {
    setCurrentPage('fpc-search');
  };

  const handleGoToAdmin = () => {
    setCurrentPage('admin');
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* ── Header ── */}
      <header className="bg-card shadow-sm border-b-2 border-border">
        <div className="px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-foreground">NXP WT</h1>
            {employeeId && (
              <div className="flex flex-col sm:flex-row gap-2">
                {/* AGV 1 Badge */}
                <span
                  className={`px-4 py-2 text-lg font-black rounded-full flex items-center gap-2 border shadow-sm transition-all duration-300 ${
                    agv1Status === 'OK'
                      ? 'bg-success-background text-success-foreground border-success'
                      : 'bg-error-background text-error-foreground border-error animate-pulse'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      agv1Status === 'OK' ? 'bg-success' : 'bg-error animate-ping'
                    }`}
                  />
                  AGV 1: {agv1Status}
                </span>
                {/* AGV 2 Badge */}
                <span
                  className={`px-4 py-2 text-lg font-black rounded-full flex items-center gap-2 border shadow-sm transition-all duration-300 ${
                    agv2Status === 'OK'
                      ? 'bg-success-background text-success-foreground border-success'
                      : 'bg-error-background text-error-foreground border-error animate-pulse'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      agv2Status === 'OK' ? 'bg-success' : 'bg-error animate-ping'
                    }`}
                  />
                  AGV 2: {agv2Status}
                </span>
                {/* Floor Badge */}
                <span
                  className="px-4 py-2 text-lg font-black rounded-full flex items-center gap-2 border shadow-sm bg-info-background text-info-foreground border-info"
                >
                  <span className="w-3 h-3 rounded-full bg-info" />
                  {translations[language].floor}: {floor}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {employeeId && (
              <>
                {(role === 'admin' || role === 'store') && (
                  <button
                    onClick={handleGoToAdmin}
                    className={`px-8 py-3 text-xl font-bold rounded-lg transition-colors shadow-md ${
                      currentPage === 'admin'
                        ? 'text-primary-foreground bg-primary hover:bg-primary/90'
                        : 'text-primary bg-card border-2 border-primary hover:bg-accent'
                    }`}
                  >
                    {role === 'admin' ? translations[language].adminPanel : translations[language].managementPanel}
                  </button>
                )}

                {role === 'operator' && (
                  <button
                    onClick={handleGoToAdmin}
                    className={`px-8 py-3 text-xl font-bold rounded-lg transition-colors shadow-md ${
                      currentPage === 'admin'
                        ? 'text-primary-foreground bg-primary hover:bg-primary/90'
                        : 'text-primary bg-card border-2 border-primary hover:bg-accent'
                    }`}
                  >
                    {translations[language].adminLogsTab}
                  </button>
                )}

                <button
                  onClick={handleGoToFPCSearch}
                  className="px-8 py-3 text-xl font-bold text-info bg-card border-2 border-info rounded-lg hover:bg-info-background transition-colors shadow-sm"
                >
                  {language === 'th' ? 'ค้นหา FPC' : 'FPC Search'}
                </button>
                <button
                  onClick={handleGoToQueue}
                  className="px-8 py-3 text-xl font-bold text-info-foreground bg-info rounded-lg hover:bg-info/90 transition-colors shadow-md"
                >
                  {language === 'th' ? 'ดูคิว' : 'View Queue'}
                </button>
                <EmployeeMenu
                  employeeId={employeeId}
                  onLogout={handleLogout}
                  language={language}
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="h-[calc(100vh-88px)] px-8 py-6">
        {!employeeId ? (
          <EmployeeLogin onLogin={handleLogin} language={language} />
        ) : currentPage === 'admin' ? (
          <AdminLogsPage
            employeeId={employeeId}
            userRole={role || 'operator'}
            language={language}
            onBack={() => {
              setCurrentPage('mode-selection');
            }}
          />
        ) : currentPage === 'mode-selection' ? (
          <ModeSelection onSelectMode={handleSelectMode} language={language} />
        ) : currentPage === 'return' ? (
          <ReturnFPCWorkflow
            employeeId={employeeId}
            language={language}
            onBack={handleBackToModeSelection}
            onTaskSubmitted={handleGoToQueue}
          />
        ) : currentPage === 'request' ? (
          <RequestFPCWorkflow
            employeeId={employeeId}
            language={language}
            onBack={handleBackToModeSelection}
            onTaskSubmitted={handleGoToQueue}
          />
        ) : currentPage === 'move' ? (
          <MoveFPCWorkflow
            employeeId={employeeId}
            language={language}
            onBack={handleBackToModeSelection}
            onTaskSubmitted={handleGoToQueue}
          />
        ) : currentPage === 'unload_load' ? (
          <UnloadLoadWorkflow
            employeeId={employeeId}
            language={language}
            onBack={handleBackToModeSelection}
            onTaskSubmitted={handleGoToQueue}
          />
        ) : currentPage === 'fpc-search' ? (
          <FPCSearchPage
            employeeId={employeeId}
            language={language}
            onBack={handleBackToModeSelection}
          />
        ) : (
          <TaskQueuePage
            employeeId={employeeId}
            language={language}
            onBack={handleBackToModeSelection}
            onNewTask={handleBackToModeSelection}
          />
        )}
      </main>
    </div>
  );
}
