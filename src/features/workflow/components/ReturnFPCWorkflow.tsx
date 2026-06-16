import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { MachineSelector } from './MachineSelector';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';
import { mockMachines, submitReturnFPCJob, getAllFPCs } from '@/shared/utils/mockApi';
import type { FPCItem } from '@/shared/utils/mockApi';

interface ReturnFPCWorkflowProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
  onTaskSubmitted: () => void;
}

export function ReturnFPCWorkflow({ employeeId, language, onBack, onTaskSubmitted }: ReturnFPCWorkflowProps) {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [allFPCs, setAllFPCs] = useState<FPCItem[]>([]);

  useEffect(() => {
    const loadFPCs = async () => {
      try {
        const items = await getAllFPCs();
        setAllFPCs(items);
      } catch (err) {
        console.error('Failed to load FPCs for Return workflow', err);
      }
    };
    loadFPCs();
  }, []);

  const currentFPC = allFPCs.find(f => f.location === selectedMachine);

  const t = translations[language];

  const handleSubmitClick = () => {
    if (!selectedMachine) {
      setError(t.selectMachineFirst);
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setError('');

    try {
      await submitReturnFPCJob(employeeId, selectedMachine!);
      onTaskSubmitted();
    } catch {
      setError(t.error_network);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMachineName = mockMachines.find(m => m.id === selectedMachine)?.name;

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
          {t.returnFPC}
        </h2>
        <div className="w-40" />
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <MachineSelector
              machines={mockMachines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine}
              language={language}
              title={t.selectSourceMachine}
            />
          </div>

          <div className="space-y-4 mt-6">
            {error && (
              <Alert severity="error" className="!text-xl !py-4">{error}</Alert>
            )}
            <div className="flex justify-end">
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitClick}
                disabled={!selectedMachine || isSubmitting}
                className="!py-6 !px-12 !text-2xl !font-bold"
              >
                {isSubmitting ? t.processing : t.submit}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: '!p-4' }}
      >
        <DialogTitle className="!text-3xl !font-bold !pb-4">
          {t.confirmSubmit}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 py-4">
            <p className="text-2xl text-gray-700 mb-6">
              {t.confirmSubmitMessage}
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-xl">
                <span className="text-gray-600">{t.probecardToSend}:</span>
                <span className="font-bold text-blue-600">{currentFPC ? currentFPC.id : '-'}</span>
              </div>
              <div className="flex justify-between text-xl border-t border-gray-200 pt-3">
                <span className="text-gray-600">{t.source}:</span>
                <span className="font-bold text-gray-900">{selectedMachineName}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-gray-600">{t.destination}:</span>
                <span className="font-bold text-gray-900">{t.smartStorage}</span>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="!p-6 !pt-2">
          <Button
            onClick={() => setShowConfirmDialog(false)}
            variant="outlined"
            size="large"
            className="!py-4 !px-10 !text-xl !min-w-[140px]"
          >
            {t.no}
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            size="large"
            autoFocus
            className="!py-4 !px-10 !text-xl !min-w-[140px]"
          >
            {t.yes}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
