import { useState, useMemo, useEffect } from 'react';
import { Button, Card, CardContent, TextField, Alert, Table, TableBody, TableCell, TableHead, TableRow, Radio, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { MachineSelector } from './MachineSelector';
import { mockMachines, searchFPC, submitRequestFPCJob } from '@/shared/utils/mockApi';
import type { FPCItem } from '@/shared/utils/mockApi';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

interface RequestFPCWorkflowProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
  onTaskSubmitted: () => void;
}

export function RequestFPCWorkflow({ employeeId, language, onBack, onTaskSubmitted }: RequestFPCWorkflowProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allFPCItems, setAllFPCItems] = useState<FPCItem[]>([]);
  const [selectedFPC, setSelectedFPC] = useState<FPCItem | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language];

  // Load all FPC items on mount
  useEffect(() => {
    const loadAllFPC = async () => {
      setIsLoading(true);
      try {
        const results = await searchFPC('');
        const inStorageItems = results.filter(
          item => item.location === 'Smart Storage' && item.address && item.address !== '-'
        );
        setAllFPCItems(inStorageItems);
      } catch {
        setError(t.error_network);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllFPC();
  }, [t.error_network]);

  // Real-time filter
  const filteredFPCItems = useMemo(() => {
    if (!searchQuery.trim()) return allFPCItems;
    const lowerQuery = searchQuery.toLowerCase();
    return allFPCItems.filter(
      fpc =>
        fpc.address.toLowerCase().includes(lowerQuery) ||
        fpc.functionName.toLowerCase().includes(lowerQuery) ||
        fpc.label.toLowerCase().includes(lowerQuery) ||
        (fpc.comment && fpc.comment.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, allFPCItems]);

  const handleSubmitClick = () => {
    if (!selectedFPC) {
      setError(t.selectFPCFirst);
      return;
    }
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
      await submitRequestFPCJob(employeeId, selectedFPC!.id, selectedMachine!);
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
        <h2 className="text-4xl font-bold text-foreground">
          {t.requestFPC}
        </h2>
        <div className="w-40" />
      </div>

      {/* Two-column layout */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        {/* Left — FPC Search */}
        <Card className="flex flex-col bg-card border border-border">
          <CardContent className="p-8 flex flex-col flex-1 min-h-0">
            <h3 className="text-3xl font-bold mb-6 text-foreground">{t.searchFPC}</h3>

            <TextField
              fullWidth
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              className="!mb-6"
              InputProps={{ className: '!text-2xl !py-4' }}
              inputProps={{ style: { fontSize: '1.5rem', padding: '1rem' } }}
            />

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl text-muted-foreground">{t.pleaseWait}</p>
              </div>
            ) : filteredFPCItems.length === 0 ? (
              <Alert severity="info" className="!text-xl !py-4">
                {t.noResults}
              </Alert>
            ) : (
              <div className="flex-1 overflow-auto border border-border rounded-lg bg-card">
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" className="!bg-background" />
                      <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4">{t.address}</TableCell>
                      <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4">{t.function}</TableCell>
                      <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4">{t.label}</TableCell>
                      <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4">{t.comment}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFPCItems.map((fpc) => (
                      <TableRow
                        key={fpc.id}
                        hover
                        onClick={() => setSelectedFPC(fpc)}
                        className="cursor-pointer"
                        selected={selectedFPC?.id === fpc.id}
                        sx={{
                          '&.Mui-selected': { backgroundColor: 'var(--info-background)' },
                          '&.Mui-selected:hover': { backgroundColor: 'var(--info-background)' },
                        }}
                      >
                        <TableCell padding="checkbox" className="!py-4">
                          <Radio
                            checked={selectedFPC?.id === fpc.id}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
                          />
                        </TableCell>
                        <TableCell className="!text-xl !py-4 text-foreground">{fpc.address}</TableCell>
                        <TableCell className="!text-xl !py-4 text-foreground">{fpc.functionName}</TableCell>
                        <TableCell className="!text-xl !py-4 text-info">{fpc.label}</TableCell>
                        <TableCell className="!text-xl !py-4 text-muted-foreground">{fpc.comment || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right — Destination Machine */}
        <Card className="flex flex-col overflow-hidden bg-card border border-border">
          <CardContent className="p-8 flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0">
              <MachineSelector
                machines={mockMachines}
                selectedMachine={selectedMachine}
                onSelectMachine={setSelectedMachine}
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
                disabled={!selectedFPC || !selectedMachine || isSubmitting}
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
                <span className="text-muted-foreground">{t.probecardToReceive}:</span>
                <span className="font-bold text-info">{selectedFPC?.id}</span>
              </div>
              <div className="flex justify-between text-xl border-t border-border pt-3">
                <span className="text-muted-foreground">{t.source}:</span>
                <span className="font-bold text-foreground">{t.smartStorage}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-muted-foreground">{t.destination}:</span>
                <span className="font-bold text-foreground">{selectedMachineName}</span>
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
