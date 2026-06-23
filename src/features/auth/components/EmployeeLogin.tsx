import { useState } from 'react';
import { TextField, Button, Card, CardContent, InputAdornment, IconButton, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { translations } from '@/shared/utils/translations';
import type { Language, Role } from '@/shared/types';
import { validateCredentials } from '@/shared/utils/mockApi';
import { Eye, EyeOff } from 'lucide-react';

interface EmployeeLoginProps {
  onLogin: (employeeId: string, role: Role, floor: string) => void;
  language: Language;
}

export function EmployeeLogin({ onLogin, language }: EmployeeLoginProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [floor, setFloor] = useState(() => localStorage.getItem('nxp_floor') || 'E4');
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
    if (!floor) {
      setError(t.floorRequired || 'Floor is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const validated = await validateCredentials(employeeId.trim(), password);
      if (validated) {
        onLogin(validated.employeeId, validated.role, floor);
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
            <div>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      fontSize: '1.5rem',
                      padding: '1.25rem',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.25rem',
                    transform: 'translate(14px, 22px) scale(1)',
                  },
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(14px, -11px) scale(0.75) !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    fontSize: '0.9375rem',
                  }
                }}
                inputProps={{
                  maxLength: 50
                }}
              />
            </div>

            <div>
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="large"
                        disabled={loading}
                        aria-label={showPassword ? t.hidePassword : t.showPassword}
                      >
                        {showPassword ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      fontSize: '1.5rem',
                      padding: '1.25rem',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.25rem',
                    transform: 'translate(14px, 22px) scale(1)',
                  },
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(14px, -11px) scale(0.75) !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    fontSize: '0.9375rem',
                  }
                }}
                inputProps={{
                  maxLength: 100
                }}
              />
            </div>

            <div>
              <FormControl
                fullWidth
                variant="outlined"
                disabled={loading}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '1.25rem',
                    transform: 'translate(14px, 22px) scale(1)',
                  },
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(14px, -11px) scale(0.75) !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    fontSize: '0.9375rem',
                  }
                }}
              >
                <InputLabel id="floor-select-label">
                  {t.floor}
                </InputLabel>
                <Select
                  labelId="floor-select-label"
                  id="floor-select"
                  value={floor}
                  label={t.floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="!text-2xl"
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: '1.5rem',
                      padding: '1.25rem',
                    },
                  }}
                >
                  <MenuItem value="E2" className="!text-xl !py-3">E2</MenuItem>
                  <MenuItem value="E3" className="!text-xl !py-3">E3</MenuItem>
                  <MenuItem value="E4" className="!text-xl !py-3">E4</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
