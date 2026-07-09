import { useState, useMemo } from 'react';
import { TextField, Button, Menu, MenuItem } from '@mui/material';
import { CheckCircle, Filter } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';
import type { MachineWithState, MachineState } from '@/shared/utils/mockApi';

interface MachineSelectorProps {
  machines: MachineWithState[];
  selectedMachine: string | null;
  onSelectMachine: (machineId: string) => void;
  language: Language;
  title: string;
  isMachineSelectable?: (machineId: string, state: MachineState) => boolean;
}

export function MachineSelector({
  machines,
  selectedMachine,
  onSelectMachine,
  language,
  title,
  isMachineSelectable,
}: MachineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SELECTABLE' | MachineState>('SELECTABLE');
  const t = translations[language];

  // Menu anchor element state for dropdown filter menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectFilter = (val: typeof statusFilter) => {
    setStatusFilter(val);
    handleMenuClose();
  };

  const counts = useMemo(() => {
    const res = { ALL: 0, selectable: 0, empty: 0, occupied: 0, reserved: 0, unavailable: 0 };
    machines.forEach(m => {
      res.ALL++;
      
      const isSelectable = isMachineSelectable
        ? isMachineSelectable(m.id, m.state)
        : m.state !== 'unavailable' && m.state !== 'reserved';
      
      if (isSelectable) {
        res.selectable++;
      }
      
      if (m.state in res) {
        res[m.state as keyof typeof res]++;
      }
    });
    return res;
  }, [machines, isMachineSelectable]);

  const filteredMachines = useMemo(() => {
    let list = machines;
    if (statusFilter === 'SELECTABLE') {
      list = list.filter(m => {
        return isMachineSelectable
          ? isMachineSelectable(m.id, m.state)
          : m.state !== 'unavailable' && m.state !== 'reserved';
      });
    } else if (statusFilter !== 'ALL') {
      list = list.filter(machine => machine.state === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter(
        machine =>
          machine.id.toLowerCase().includes(lowerQuery) ||
          machine.name.toLowerCase().includes(lowerQuery)
      );
    }
    return list;
  }, [searchQuery, statusFilter, machines, isMachineSelectable]);

  const getActiveFilterLabel = () => {
    switch (statusFilter) {
      case 'SELECTABLE':
        return `${t.filterSelectable} (${counts.selectable})`;
      case 'ALL':
        return `${t.filterAll} (${counts.ALL})`;
      case 'empty':
        return `${t.filterEmpty} (${counts.empty})`;
      case 'occupied':
        return `${t.filterOccupied} (${counts.occupied})`;
      case 'reserved':
        return `${t.filterReserved} (${counts.reserved})`;
      case 'unavailable':
        return `${t.filterUnavailable} (${counts.unavailable})`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-3xl font-bold mb-6 text-foreground">{title}</h3>

      <div className="flex gap-4 items-center !mb-6 w-full">
        <TextField
          placeholder={t.searchMachinePlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          className="flex-1"
          InputProps={{
            className: '!text-xl !py-2',
          }}
          inputProps={{
            style: { fontSize: '1.25rem', padding: '0.75rem' },
            'aria-label': t.searchMachine,
            maxLength: 100
          }}
        />

        <Button
          variant="outlined"
          onClick={handleMenuClick}
          startIcon={<Filter className="w-5 h-5 text-muted-foreground" />}
          className="!py-4 !px-6 !text-lg !font-semibold !rounded-xl border-border bg-card hover:bg-muted text-foreground flex gap-2 items-center normal-case shrink-0"
        >
          {getActiveFilterLabel()}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          slotProps={{
            paper: {
              className: 'shadow-lg border border-border rounded-xl mt-1 min-w-[200px]'
            }
          }}
        >
          <MenuItem onClick={() => handleSelectFilter('SELECTABLE')} className="!text-lg !py-3 !px-5">
            <div className="flex items-center justify-between gap-6 w-full">
              <span>{t.filterSelectable}</span>
              <span className="bg-info-background text-info-foreground px-2.5 py-0.5 rounded-full text-xs font-bold">{counts.selectable}</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleSelectFilter('ALL')} className="!text-lg !py-3 !px-5">
            <div className="flex items-center justify-between gap-6 w-full">
              <span>{t.filterAll}</span>
              <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-bold">{counts.ALL}</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleSelectFilter('empty')} className="!text-lg !py-3 !px-5">
            <div className="flex items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
                <span>{t.filterEmpty}</span>
              </div>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{counts.empty}</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleSelectFilter('occupied')} className="!text-lg !py-3 !px-5">
            <div className="flex items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span>{t.filterOccupied}</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{counts.occupied}</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleSelectFilter('reserved')} className="!text-lg !py-3 !px-5">
            <div className="flex items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                <span>{t.filterReserved}</span>
              </div>
              <span className="bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{counts.reserved}</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleSelectFilter('unavailable')} className="!text-lg !py-3 !px-5">
            <div className="flex items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
                <span>{t.filterUnavailable}</span>
              </div>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{counts.unavailable}</span>
            </div>
          </MenuItem>
        </Menu>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
          {filteredMachines.map((machine) => {
            const isSelectable = isMachineSelectable
              ? isMachineSelectable(machine.id, machine.state)
              : machine.state !== 'unavailable' && machine.state !== 'reserved';

            // Style configuration based on state
            let badgeClass: string;
            let dotClass: string;
            let labelText: string;

            switch (machine.state) {
              case 'empty':
                badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
                dotClass = 'bg-gray-400';
                labelText = t.machineStateEmpty;
                break;
              case 'occupied':
                badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                dotClass = 'bg-emerald-500';
                labelText = t.machineStateOccupied;
                break;
              case 'reserved':
                badgeClass = 'bg-orange-50 text-orange-700 border-orange-200';
                dotClass = 'bg-orange-500';
                labelText = t.machineStateReserved;
                break;
              case 'unavailable':
              default:
                if (machine.disableReason === 'PM / Maintenance') {
                  badgeClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  dotClass = 'bg-yellow-500';
                  labelText = language === 'th' ? 'PM' : 'PM';
                } else if (machine.disableReason === 'Breakdown / Error') {
                  badgeClass = 'bg-red-50 text-red-700 border-red-200';
                  dotClass = 'bg-red-500';
                  labelText = language === 'th' ? 'Breakdown / Down' : 'Breakdown / Down';
                } else if (machine.disableReason === 'Engineering Use') {
                  badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                  dotClass = 'bg-blue-500';
                  labelText = language === 'th' ? 'Engineering Use' : 'Engineering Use';
                } else {
                  badgeClass = 'bg-gray-800 text-gray-100 border-gray-700';
                  dotClass = 'bg-gray-900';
                  labelText = language === 'th' ? 'อื่น ๆ' : 'Other';
                }
                break;
            }

            return (
              <button
                key={machine.id}
                onClick={() => isSelectable && onSelectMachine(machine.id)}
                disabled={!isSelectable}
                aria-pressed={selectedMachine === machine.id}
                className={`
                  relative p-6 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-inset
                  ${!isSelectable
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
                      flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium border
                      ${badgeClass}
                    `}
                  >
                    <span className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
                    <span>{labelText}</span>
                  </div>
                  {machine.state === 'occupied' && machine.fpcId && (
                    <div className="text-base text-muted-foreground font-mono mt-1.5">
                      {/* ponytail: render probe card ID for occupied machine */}
                      {t.machineProbeLabel || 'Probe'}: {machine.fpcId}
                    </div>
                  )}
                  {selectedMachine === machine.id && (
                    <CheckCircle className="w-7 h-7 text-info absolute top-3 right-3" />
                  )}
                </div>
              </button>
            );
          })}
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
