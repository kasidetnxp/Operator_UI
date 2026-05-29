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
      <h3 className="text-3xl font-bold mb-6 text-gray-900">{title}</h3>

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
          style: { fontSize: '1.5rem', padding: '1rem' }
        }}
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
          {filteredMachines.map((machine) => (
            <button
              key={machine.id}
              onClick={() => machine.available && onSelectMachine(machine.id)}
              disabled={!machine.available}
              className={`
                relative p-6 rounded-lg border-2 transition-all
                ${!machine.available
                  ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                  : selectedMachine === machine.id
                  ? 'bg-blue-50 border-blue-500 shadow-lg'
                  : 'bg-white border-gray-300 hover:border-blue-300 hover:shadow-md cursor-pointer'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="text-2xl font-bold text-gray-900">
                  {machine.name}
                </div>
                <div className="text-lg text-gray-600">
                  {machine.id}
                </div>
                <div
                  className={`
                    px-4 py-2 rounded-full text-lg font-medium
                    ${machine.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {machine.available ? t.available : t.unavailable}
                </div>
                {selectedMachine === machine.id && (
                  <CheckCircle className="w-7 h-7 text-blue-600 absolute top-3 right-3" />
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <p className="text-2xl text-gray-500">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
