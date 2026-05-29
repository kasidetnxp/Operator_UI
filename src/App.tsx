import { useState } from 'react';
import { EmployeeLogin, EmployeeMenu } from '@/features/auth';
import { ModeSelection, ReturnFPCWorkflow, RequestFPCWorkflow } from '@/features/workflow';
import { TaskQueuePage } from '@/features/queue';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import type { Language, OperationMode, Page } from '@/shared/types';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<Page>('mode-selection');

  const handleLogout = () => {
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

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="px-8 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">NXP WT</h1>

          <div className="flex items-center gap-6">
            <LanguageSwitcher language={language} onLanguageChange={setLanguage} />

            {employeeId && (
              <>
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
          <EmployeeLogin onLogin={setEmployeeId} language={language} />
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
