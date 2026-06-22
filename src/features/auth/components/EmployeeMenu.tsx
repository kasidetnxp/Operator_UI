import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { User, LogOut } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

interface EmployeeMenuProps {
  employeeId: string;
  onLogout: () => void;
  language: Language;
}

export function EmployeeMenu({ employeeId, onLogout, language }: EmployeeMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const t = translations[language];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-3 px-6 py-3 text-lg font-semibold text-muted-foreground bg-card border-2 border-border rounded-lg hover:bg-accent transition-colors"
      >
        <User className="w-6 h-6" />
        <span className="text-xl font-bold text-foreground">{employeeId}</span>
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            marginTop: '8px',
            minWidth: '200px',
          },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          className="!py-4 !px-6 !text-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {t.logout}
        </MenuItem>
      </Menu>
    </>
  );
}
