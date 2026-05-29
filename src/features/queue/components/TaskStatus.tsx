import { Alert, LinearProgress, Chip } from '@mui/material';
import { CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

export type TaskStatusType =
  | 'queued'
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
      case 'queued':
        return { label: t.queued, color: 'default' as const, icon: <Clock className="w-5 h-5" />, severity: 'info' as const };
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

  const config = getStatusConfig();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-2xl text-gray-900">{t.status}:</span>
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

      {(status === 'in_progress' || status === 'queued') && (
        <LinearProgress className="!h-2 !rounded-full" />
      )}

      {status === 'error' && errorMessage && (
        <Alert severity="error" className="!text-xl !py-4">
          {errorMessage}
        </Alert>
      )}

      {status === 'complete' && (
        <Alert severity="success" className="!text-xl !py-4">
          {t.complete}
        </Alert>
      )}
    </div>
  );
}
