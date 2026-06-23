import { useState, useMemo, useEffect } from 'react';
import { Button, Card, CardContent, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { MachineSelector } from './MachineSelector';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';
import { mockMachines, submitMoveFPCJob, getAllFPCs } from '@/shared/utils/mockApi';
import type { FPCItem } from '@/shared/utils/mockApi';

interface MoveFPCWorkflowProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
  onTaskSubmitted: () => void;
}

export function MoveFPCWorkflow({ employeeId, language, onBack, onTaskSubmitted }: MoveFPCWorkflowProps) {
  const [selectedSourceMachine, setSelectedSourceMachine] = useState<string | null>(null);
  const [selectedDestinationMachine, setSelectedDestinationMachine] = useState<string | null>(null);
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
        console.error('Failed to load FPCs for Move workflow', err);
      }
    };
    loadFPCs();
  }, []);

  const sourceFPC = allFPCs.find(f => f.location === selectedSourceMachine);
  const destFPC = allFPCs.find(f => f.location === selectedDestinationMachine);

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

  // Dynamic validation warning/error
  const validationError = useMemo(() => {
    if (selectedSourceMachine && !sourceFPC) {
      return t.errorMachineHasNoFPC;
    }
    if (selectedDestinationMachine && destFPC) {
      return t.errorMachineAlreadyHasFPC;
    }
    if (selectedSourceMachine && selectedDestinationMachine && selectedSourceMachine === selectedDestinationMachine) {
      return language === 'th' ? 'กรุณาเลือกเครื่องจักรต้นทางและปลายทางที่ต่างกัน' : 'Source and destination machines must be different';
    }
    return '';
  }, [selectedSourceMachine, selectedDestinationMachine, sourceFPC, destFPC, language, t.errorMachineHasNoFPC, t.errorMachineAlreadyHasFPC]);

  const handleSubmitClick = () => {
    if (!selectedSourceMachine) {
      setError(t.selectMachineFirst);
      return;
    }
    if (!selectedDestinationMachine) {
      setError(t.selectMachineFirst);
      return;
    }
    if (validationError) {
      setError(validationError);
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setError('');

    try {
      await submitMoveFPCJob(employeeId, selectedSourceMachine!, selectedDestinationMachine!);
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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <Button
          startIcon={<ArrowLeft className="w-6 h-6" />}
          onClick={onBack}
          variant="outlined"
          size="large"
          className="!px-6 !py-3 !text-lg w-full sm:w-auto shrink-0"
        >
          {t.back}
        </Button>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center truncate">
          {t.moveFPC}
        </h2>
        <div className="hidden sm:block w-24 sm:w-32 md:w-40 shrink-0" />
      </div>

      {/* Two-column layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Column — Source Machine Selector */}
        <Card className="flex flex-col overflow-hidden bg-card border border-border">
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
        <Card className="flex flex-col overflow-hidden bg-card border border-border">
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
              {validationError && (
                <Alert severity="error" className="!text-xl !py-4">
                  {validationError}
                </Alert>
              )}
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
                disabled={!selectedSourceMachine || !selectedDestinationMachine || !!validationError || isSubmitting}
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
        PaperProps={{ className: '!p-4 !bg-card !text-foreground' }}
      >
        <DialogTitle className="!text-3xl !font-bold !pb-4">
          {t.confirmSubmit}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 py-4">
            <p className="text-2xl text-foreground mb-6">
              {t.confirmSubmitMessage}
            </p>
            <div className="bg-background rounded-lg p-6 space-y-3 border border-border">
              <div className="flex justify-between text-xl">
                <span className="text-muted-foreground">{t.probecardToSendFromSource}:</span>
                <span className="font-bold text-info">{sourceFPC ? sourceFPC.id : '-'}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-muted-foreground">{t.probecardToReceiveFromDest}:</span>
                <span className="font-bold text-success">{destFPC ? destFPC.id : '-'}</span>
              </div>
              <div className="flex justify-between text-xl border-t border-border pt-3">
                <span className="text-muted-foreground">{t.source}:</span>
                <span className="font-bold text-foreground">{sourceMachineName}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-muted-foreground">{t.destination}:</span>
                <span className="font-bold text-foreground">{destinationMachineName}</span>
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
