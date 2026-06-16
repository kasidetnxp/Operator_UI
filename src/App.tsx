import { useState, useEffect } from 'react';
import { EmployeeLogin, EmployeeMenu } from '@/features/auth';
import { ModeSelection, ReturnFPCWorkflow, RequestFPCWorkflow, SwapFPCWorkflow, FPCSearchPage } from '@/features/workflow';
import { TaskQueuePage } from '@/features/queue';
import { AdminLogsPage } from '@/features/admin';
import { addAuditLog, getAGVSystemStatus } from '@/shared/utils/mockApi';
import { translations } from '@/shared/utils/translations';
import type { Language, OperationMode, Page } from '@/shared/types';

export default function App() {
  const [language] = useState<Language>('th');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<Page>('mode-selection');
  const [agvStatus, setAgvStatus] = useState<'OK' | 'ERROR'>('OK');

  useEffect(() => {
    const checkAGVStatus = () => {
      setAgvStatus(getAGVSystemStatus());
    };
    checkAGVStatus();
    const interval = setInterval(checkAGVStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (id: string) => {
    setEmployeeId(id);
    addAuditLog('LOGIN', id, 'Employee logged in successfully');
    if (id === '1111') {
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
    setCurrentPage('mode-selection');
  };

  const handleSelectMode = (mode: OperationMode) => {
    setCurrentPage(mode);
  };

  const handleBackToModeSelection = () => {
    setCurrentPage('mode-selection');
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
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-gray-900">NXP WT</h1>
            {employeeId && (
              <span
                className={`px-6 py-2 text-xl font-black rounded-full flex items-center gap-2 border shadow-sm transition-all duration-300 ${
                  agvStatus === 'OK'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    agvStatus === 'OK' ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'
                  }`}
                />
                AGV: {agvStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {employeeId && (
              <>
                {employeeId === '1111' && (
                  <button
                    onClick={handleGoToAdmin}
                    className={`px-8 py-3 text-xl font-bold rounded-lg transition-colors shadow-md ${
                      currentPage === 'admin'
                        ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                        : 'text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {translations[language].adminPanel}
                  </button>
                )}
                <button
                  onClick={handleGoToFPCSearch}
                  className="px-8 py-3 text-xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                >
                  {language === 'th' ? 'ค้นหา FPC' : 'FPC Search'}
                </button>
                <button
                  onClick={handleGoToQueue}
                  className="px-8 py-3 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
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
            language={language}
            onBack={handleBackToModeSelection}
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
        ) : currentPage === 'swap' ? (
          <SwapFPCWorkflow
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
