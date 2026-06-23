import { useState, useMemo } from 'react';
import { TextField } from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

export interface Machine {
  id: string;
  name: string;
  available: boolean;
}

interface MachineSelectorProps {
  machines: Machine[];
  selectedMachine: string | null;
  onSelectMachine: (machineId: string) => void;
  language: Language;
  title: string;
}

export function MachineSelector({
  machines,
  selectedMachine,
  onSelectMachine,
  language,
  title,
}: MachineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[language];

  const filteredMachines = useMemo(() => {
    if (!searchQuery.trim()) return machines;
    const lowerQuery = searchQuery.toLowerCase();
    return machines.filter(
      machine =>
        machine.id.toLowerCase().includes(lowerQuery) ||
        machine.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, machines]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-3xl font-bold mb-6 text-foreground">{title}</h3>

      <TextField
        fullWidth
        placeholder={t.searchMachinePlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        className="!mb-6"
        InputProps={{
          className: '!text-2xl !py-4',
        }}
        inputProps={{
          style: { fontSize: '1.5rem', padding: '1rem' },
          'aria-label': t.searchMachine,
          maxLength: 100
        }}
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
          {filteredMachines.map((machine) => (
            <button
              key={machine.id}
              onClick={() => machine.available && onSelectMachine(machine.id)}
              disabled={!machine.available}
              aria-pressed={selectedMachine === machine.id}
              className={`
                relative p-6 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-inset
                ${!machine.available
                  ? 'bg-muted border-border opacity-50 cursor-not-allowed'
                  : selectedMachine === machine.id
                  ? 'bg-info-background border-info shadow-lg'
                  : 'bg-card border-border hover:border-info hover:shadow-md cursor-pointer'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  {machine.name}
                </div>
                <div className="text-lg text-muted-foreground font-mono">
                  {machine.id}
                </div>
                <div
                  className={`
                    px-4 py-2 rounded-full text-lg font-medium border
                    ${machine.available
                      ? 'bg-success-background text-success-foreground border-success'
                      : 'bg-muted text-muted-foreground border-border'
                    }
                  `}
                >
                  {machine.available ? t.available : t.unavailable}
                </div>
                {selectedMachine === machine.id && (
                  <CheckCircle className="w-7 h-7 text-info absolute top-3 right-3" />
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <p className="text-2xl text-muted-foreground">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
