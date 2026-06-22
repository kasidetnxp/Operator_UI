import { useState } from 'react';
import { TextField, Button, Card, CardContent, InputAdornment, IconButton, Alert } from '@mui/material';
import { translations } from '@/shared/utils/translations';
import type { Language, Role } from '@/shared/types';
import { validateCredentials } from '@/shared/utils/mockApi';
import { Eye, EyeOff } from 'lucide-react';

interface EmployeeLoginProps {
  onLogin: (employeeId: string, role: Role) => void;
  language: Language;
}

export function EmployeeLogin({ onLogin, language }: EmployeeLoginProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setError(t.employeeIdRequired);
      return;
    }
    if (!password) {
      setError(t.passwordRequired);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const validated = await validateCredentials(employeeId.trim(), password);
      if (validated) {
        onLogin(validated.employeeId, validated.role);
      } else {
        setError(t.invalidCredentials);
      }
    } catch (err) {
      console.error(err);
      setError(t.error_server);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 sm:p-12">
          <h2 className="text-4xl font-bold text-center mb-10 text-foreground">
            NXP WT
          </h2>

          {error && (
            <Alert severity="error" className="mb-6 !text-lg !py-3">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <TextField
              fullWidth
              label={t.enterEmployeeId}
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setError('');
              }}
              error={!!error && !employeeId.trim()}
              autoFocus
              variant="outlined"
              disabled={loading}
              InputProps={{
                className: '!text-2xl',
              }}
              InputLabelProps={{
                className: '!text-xl',
              }}
              inputProps={{
                style: { fontSize: '1.5rem', padding: '1.25rem' }
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label={t.password}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              error={!!error && !password}
              variant="outlined"
              disabled={loading}
              InputProps={{
                className: '!text-2xl',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="large"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                className: '!text-xl',
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
              disabled={loading}
              className="!py-6 !text-2xl !font-bold"
            >
              {loading ? t.processing : t.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
