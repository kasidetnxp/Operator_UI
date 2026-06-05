import { useState, useMemo } from 'react';
import { Button, Card, CardContent, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { MachineSelector } from './MachineSelector';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';
import { mockMachines, submitSwapFPCJob } from '@/shared/utils/mockApi';

interface SwapFPCWorkflowProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
  onTaskSubmitted: () => void;
}

export function SwapFPCWorkflow({ employeeId, language, onBack, onTaskSubmitted }: SwapFPCWorkflowProps) {
  const [selectedSourceMachine, setSelectedSourceMachine] = useState<string | null>(null);
  const [selectedDestinationMachine, setSelectedDestinationMachine] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const t = translations[language];

  // Modify destination machine list to disable the selected source machine
  const destinationMachines = useMemo(() => {
    return mockMachines.map(m => {
      if (m.id === selectedSourceMachine) {
        return { ...m, available: false };
      }
      return m;
    });
  }, [selectedSourceMachine]);

  const handleSubmitClick = () => {
    if (!selectedSourceMachine) {
      setError(t.selectMachineFirst); // Or custom source machine validation message
      return;
    }
    if (!selectedDestinationMachine) {
      setError(t.selectMachineFirst); // Or custom destination machine validation message
      return;
    }
    if (selectedSourceMachine === selectedDestinationMachine) {
      setError(language === 'th' ? 'กรุณาเลือกเครื่องจักรต้นทางและปลายทางที่ต่างกัน' : 'Source and destination machines must be different');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setError('');

    try {
      await submitSwapFPCJob(employeeId, selectedSourceMachine!, selectedDestinationMachine!);
      onTaskSubmitted();
    } catch {
      setError(t.error_network);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceMachineName = mockMachines.find(m => m.id === selectedSourceMachine)?.name;
  const destinationMachineName = mockMachines.find(m => m.id === selectedDestinationMachine)?.name;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
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
          {t.swapFPC}
        </h2>
        <div className="w-40" />
      </div>

      {/* Two-column layout */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        {/* Left Column — Source Machine Selector */}
        <Card className="flex flex-col overflow-hidden">
          <CardContent className="p-8 flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0">
              <MachineSelector
                machines={mockMachines}
                selectedMachine={selectedSourceMachine}
                onSelectMachine={setSelectedSourceMachine}
                language={language}
                title={t.selectSourceMachine}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column — Destination Machine Selector */}
        <Card className="flex flex-col overflow-hidden">
          <CardContent className="p-8 flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0">
              <MachineSelector
                machines={destinationMachines}
                selectedMachine={selectedDestinationMachine}
                onSelectMachine={setSelectedDestinationMachine}
                language={language}
                title={t.selectDestinationMachine}
              />
            </div>

            <div className="space-y-4 mt-6">
              {error && (
                <Alert severity="error" className="!text-xl !py-4">
                  {error}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmitClick}
                disabled={!selectedSourceMachine || !selectedDestinationMachine || isSubmitting}
                className="!py-6 !text-2xl !font-bold"
              >
                {isSubmitting ? t.processing : t.submit}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <span className="text-gray-600">{t.source}:</span>
                <span className="font-bold text-gray-900">{sourceMachineName}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-gray-600">{t.destination}:</span>
                <span className="font-bold text-gray-900">{destinationMachineName}</span>
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
