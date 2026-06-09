import { useState, useEffect } from 'react';
import { Card, CardContent, Button, Alert, Chip } from '@mui/material';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { TaskStatus } from './TaskStatus';
import type { TaskStatusType } from './TaskStatus';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';
import {
  getAllTasks,
  confirmCoverHeadInstalled,
  confirmCoverHeadRemoved,
  updateTaskStatus,
} from '@/shared/utils/mockApi';
import type { TaskResponse } from '@/shared/utils/mockApi';

interface TaskQueuePageProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
  onNewTask: () => void;
}

export function TaskQueuePage({ employeeId, language, onBack, onNewTask }: TaskQueuePageProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language];

  // Load tasks and refresh every 3 seconds
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const allTasks = await getAllTasks();
        setTasks(allTasks);

        if (selectedTask) {
          const updated = allTasks.find(t => t.taskId === selectedTask.taskId);
          if (updated) setSelectedTask(updated);
        } else if (allTasks.length > 0) {
          setSelectedTask(allTasks[0]);
        }
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };

    loadTasks();
    const interval = setInterval(loadTasks, 1000);
    return () => clearInterval(interval);
  }, [selectedTask]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return t.submitted;
      case 'queued': return t.queued;
      case 'starting': return t.starting;
      case 'moving_to_source': return t.movingToSource;
      case 'arrived_at_source': return t.arrivedAtSource;
      case 'picking_up_fpc': return t.pickingUpFPC;
      case 'waiting_cover_head_install': return t.waitingCoverHeadInstall;
      case 'moving_to_destination': return t.movingToDestination;
      case 'arrived_at_destination': return t.arrivedAtDestination;
      case 'placing_fpc': return t.placingFPC;
      case 'waiting_cover_head_remove': return t.waitingCoverHeadRemove;
      case 'completed': return t.completed;
      case 'rejected': return t.rejected;
      case 'blocked': return t.blocked;
      case 'failed': return t.failedStatus;
      case 'canceled': return t.canceled;
      // Legacy
      case 'in_progress': return t.inProgress;
      case 'arrived': return t.arrived;
      case 'waiting_confirmation': return t.waitingConfirmation;
      case 'complete': return t.complete;
      case 'error': return t.error;
      default: return status;
    }
  };

  const handleConfirmCoverHead = async () => {
    if (!selectedTask) return;

    setIsConfirming(true);
    setError('');

    try {
      if (selectedTask.type === 'return') {
        await confirmCoverHeadInstalled(selectedTask.taskId);
        if (selectedTask.status === 'waiting_confirmation') {
          setTimeout(() => {
            updateTaskStatus(selectedTask.taskId, 'complete');
          }, 3000);
        }
      } else if (selectedTask.type === 'request') {
        await confirmCoverHeadRemoved(selectedTask.taskId);
        if (selectedTask.status === 'waiting_confirmation') {
          setTimeout(() => {
            updateTaskStatus(selectedTask.taskId, 'complete');
          }, 3000);
        }
      } else if (selectedTask.type === 'swap') {
        if (selectedTask.status === 'waiting_cover_head_install' || !selectedTask.coverHeadInstalledConfirmed) {
          await confirmCoverHeadInstalled(selectedTask.taskId);
        } else {
          await confirmCoverHeadRemoved(selectedTask.taskId);
          if (selectedTask.status === 'waiting_confirmation') {
            setTimeout(() => {
              updateTaskStatus(selectedTask.taskId, 'complete');
            }, 3000);
          }
        }
      }
    } catch {
      setError(t.error_network);
    } finally {
      setIsConfirming(false);
    }
  };

  const isMyTask = (task: TaskResponse) => task.employeeId === employeeId;

  const canConfirm = (task: TaskResponse) =>
    (task.status === 'waiting_confirmation' ||
      task.status === 'waiting_cover_head_install' ||
      task.status === 'waiting_cover_head_remove') &&
    isMyTask(task);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(language === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button
          startIcon={<ArrowLeft className="w-7 h-7" />}
          onClick={onBack}
          variant="outlined"
          size="large"
          className="!px-8 !py-4 !text-xl"
        >
          {t.back}
        </Button>
        <h2 className="text-4xl font-bold text-gray-900">
          {t.taskQueuePage}
        </h2>
        <Button
          onClick={onNewTask}
          variant="contained"
          size="large"
          className="!px-10 !py-4 !text-2xl !font-bold"
        >
          + {t.new}
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left — Queue list */}
        <Card className="w-1/3 flex flex-col overflow-hidden">
          <CardContent className="p-6 flex flex-col flex-1 min-h-0">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">{t.taskQueue}</h3>

            <div className="flex-1 overflow-auto space-y-3">
              {tasks.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-xl text-gray-500">{t.noTasksInQueue}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <button
                    key={task.taskId}
                    onClick={() => setSelectedTask(task)}
                    className={`
                      w-full text-left p-5 rounded-lg border-2 transition-all
                      ${selectedTask?.taskId === task.taskId
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white border-gray-300 hover:border-blue-300 hover:shadow-sm'
                      }
                      ${isMyTask(task) ? 'ring-2 ring-green-400' : ''}
                    `}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {task.jobId}
                          </div>
                          <div className="text-sm text-gray-600">
                            {task.type === 'return' ? t.returnFPC : task.type === 'request' ? t.requestFPC : t.swapFPC}
                          </div>
                        </div>
                        {isMyTask(task) && (
                          <Chip
                            label={t.myTask}
                            color="success"
                            size="small"
                            className="!font-semibold"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(task.status === 'complete' || task.status === 'completed') ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-600" />
                        )}
                        <span className={`text-sm font-medium ${(task.status === 'complete' || task.status === 'completed') ? 'text-green-700' : 'text-blue-700'
                          }`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right — Task details */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-8 h-full flex flex-col">
            {selectedTask ? (
              <>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">{t.taskDetails}</h3>

                <div className="flex-1 overflow-auto space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between text-xl border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-semibold">{t.jobId}:</span>
                      <span className="font-bold text-gray-900">{selectedTask.jobId}</span>
                    </div>
                    <div className="flex justify-between text-xl border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-semibold">{t.type}:</span>
                      <span className="font-bold text-gray-900">
                        {selectedTask.type === 'return' ? t.returnFPC : selectedTask.type === 'request' ? t.requestFPC : t.swapFPC}
                      </span>
                    </div>
                    {selectedTask.fpcId && (
                      <div className="flex justify-between text-xl border-b border-gray-200 pb-3">
                        <span className="text-gray-600 font-semibold">{t.fpcId}:</span>
                        <span className="font-bold text-gray-900">{selectedTask.fpcId}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-semibold">{t.source}:</span>
                      <span className="font-bold text-gray-900">{selectedTask.sourceMachine}</span>
                    </div>
                    <div className="flex justify-between text-xl border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-semibold">{t.destination}:</span>
                      <span className="font-bold text-gray-900">{selectedTask.destinationMachine}</span>
                    </div>
                    <div className="flex justify-between text-xl border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-semibold">{t.submittedBy}:</span>
                      <span className="font-bold text-gray-900">{selectedTask.employeeId}</span>
                    </div>
                    <div className="flex justify-between text-xl">
                      <span className="text-gray-600 font-semibold">{t.createdAt}:</span>
                      <span className="font-bold text-gray-900">{formatDateTime(selectedTask.createdAt)}</span>
                    </div>
                  </div>

                  <TaskStatus
                    status={selectedTask.status as TaskStatusType}
                    language={language}
                    errorMessage={error}
                  />

                  {canConfirm(selectedTask) && (
                    <Alert severity="warning" className="!items-start !text-xl !py-6">
                      <div className="space-y-6">
                        <p className="text-xl">
                          {selectedTask.type === 'return'
                            ? t.coverHeadInstallationConfirm
                            : selectedTask.type === 'request'
                              ? t.coverHeadRemovalConfirm
                              : !selectedTask.coverHeadInstalledConfirmed
                                ? t.coverHeadInstallationConfirm
                                : t.coverHeadRemovalConfirm}
                        </p>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={handleConfirmCoverHead}
                          disabled={isConfirming}
                          fullWidth
                          className="!py-6 !text-2xl !font-bold"
                        >
                          {isConfirming
                            ? t.processing
                            : selectedTask.type === 'return'
                              ? t.confirmCoverHeadInstalled
                              : selectedTask.type === 'request'
                                ? t.confirmCoverHeadRemoved
                                : !selectedTask.coverHeadInstalledConfirmed
                                  ? t.confirmCoverHeadInstalled
                                  : t.confirmCoverHeadRemoved}
                        </Button>
                      </div>
                    </Alert>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl text-gray-500">{t.noTasksInQueue}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
