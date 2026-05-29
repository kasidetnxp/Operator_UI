import { useState } from 'react';
import { TextField, Button, Card, CardContent } from '@mui/material';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';

interface EmployeeLoginProps {
  onLogin: (employeeId: string) => void;
  language: Language;
}

export function EmployeeLogin({ onLogin, language }: EmployeeLoginProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setError(t.employeeIdRequired);
      return;
    }
    onLogin(employeeId.trim());
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-12">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">
            NXP WT
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <TextField
              fullWidth
              label={t.enterEmployeeId}
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setError('');
              }}
              error={!!error}
              helperText={error}
              autoFocus
              variant="outlined"
              InputProps={{
                className: '!text-2xl',
              }}
              InputLabelProps={{
                className: '!text-xl',
              }}
              FormHelperTextProps={{
                className: '!text-lg',
              }}
              inputProps={{
                style: { fontSize: '1.5rem', padding: '1.25rem' }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              className="!py-6 !text-2xl !font-bold"
            >
              {t.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
