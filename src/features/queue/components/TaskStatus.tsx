import { Alert, LinearProgress, Chip } from '@mui/material';
import { CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

export type TaskStatusType =
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

interface TaskStatusProps {
  status: TaskStatusType;
  language: Language;
  errorMessage?: string;
}

export function TaskStatus({ status, language, errorMessage }: TaskStatusProps) {
  const t = translations[language];

  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return { label: t.submitted, color: 'default' as const, icon: <Clock className="w-5 h-5" />, severity: 'info' as const };
      case 'queued':
        return { label: t.queued, color: 'default' as const, icon: <Clock className="w-5 h-5" />, severity: 'info' as const };
      case 'starting':
        return { label: t.starting, color: 'primary' as const, icon: <Loader className="w-5 h-5 animate-spin" />, severity: 'info' as const };
      case 'moving_to_source':
        return { label: t.movingToSource, color: 'primary' as const, icon: <Loader className="w-5 h-5 animate-spin" />, severity: 'info' as const };
      case 'arrived_at_source':
        return { label: t.arrivedAtSource, color: 'primary' as const, icon: <CheckCircle className="w-5 h-5" />, severity: 'info' as const };
      case 'picking_up_fpc':
        return { label: t.pickingUpFPC, color: 'primary' as const, icon: <Loader className="w-5 h-5 animate-spin" />, severity: 'info' as const };
      case 'waiting_cover_head_install':
        return { label: t.waitingCoverHeadInstall, color: 'warning' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'warning' as const };
      case 'moving_to_destination':
        return { label: t.movingToDestination, color: 'primary' as const, icon: <Loader className="w-5 h-5 animate-spin" />, severity: 'info' as const };
      case 'arrived_at_destination':
        return { label: t.arrivedAtDestination, color: 'primary' as const, icon: <CheckCircle className="w-5 h-5" />, severity: 'info' as const };
      case 'placing_fpc':
        return { label: t.placingFPC, color: 'primary' as const, icon: <Loader className="w-5 h-5 animate-spin" />, severity: 'info' as const };
      case 'waiting_cover_head_remove':
        return { label: t.waitingCoverHeadRemove, color: 'warning' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'warning' as const };
      case 'completed':
        return { label: t.completed, color: 'success' as const, icon: <CheckCircle className="w-5 h-5" />, severity: 'success' as const };
      case 'rejected':
        return { label: t.rejected, color: 'error' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'error' as const };
      case 'blocked':
        return { label: t.blocked, color: 'warning' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'warning' as const };
      case 'failed':
        return { label: t.failedStatus, color: 'error' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'error' as const };
      case 'canceled':
        return { label: t.canceled, color: 'error' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'error' as const };
      
      // Legacy states for compatibility
      case 'in_progress':
        return { label: t.inProgress, color: 'primary' as const, icon: <Loader className="w-5 h-5 animate-spin" />, severity: 'info' as const };
      case 'arrived':
        return { label: t.arrived, color: 'primary' as const, icon: <CheckCircle className="w-5 h-5" />, severity: 'info' as const };
      case 'waiting_confirmation':
        return { label: t.waitingConfirmation, color: 'warning' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'warning' as const };
      case 'complete':
        return { label: t.complete, color: 'success' as const, icon: <CheckCircle className="w-5 h-5" />, severity: 'success' as const };
      case 'error':
        return { label: t.error, color: 'error' as const, icon: <AlertCircle className="w-5 h-5" />, severity: 'error' as const };
    }
  };

  const config = getStatusConfig() || { label: status, color: 'default' as const, icon: <Clock className="w-5 h-5" />, severity: 'info' as const };

  const isPending =
    status === 'submitted' ||
    status === 'queued' ||
    status === 'starting' ||
    status === 'moving_to_source' ||
    status === 'picking_up_fpc' ||
    status === 'moving_to_destination' ||
    status === 'placing_fpc' ||
    status === 'in_progress';

  const isCompleted = status === 'completed' || status === 'complete';
  const isFailed = status === 'failed' || status === 'error' || status === 'rejected' || status === 'canceled';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-2xl text-foreground">{t.status}:</span>
          <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            size="medium"
            className="!text-xl !py-6 !px-4 !h-auto"
            sx={{
              '& .MuiChip-icon': { fontSize: '1.5rem' },
              '& .MuiChip-label': { fontSize: '1.25rem', padding: '8px 12px' },
            }}
          />
        </div>
      </div>

      {isPending && (
        <LinearProgress className="!h-2 !rounded-full" />
      )}

      {isFailed && (
        <Alert severity="error" className="!text-xl !py-4">
          {errorMessage || config.label}
        </Alert>
      )}

      {isCompleted && (
        <Alert severity="success" className="!text-xl !py-4">
          {config.label}
        </Alert>
      )}
    </div>
  );
}
