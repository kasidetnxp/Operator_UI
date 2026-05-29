import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { Language } from '@/shared/types';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={(_, newLanguage) => {
        if (newLanguage) onLanguageChange(newLanguage);
      }}
      size="large"
    >
      <ToggleButton value="en" className="!px-8 !py-3 !text-xl !font-semibold">
        EN
      </ToggleButton>
      <ToggleButton value="th" className="!px-8 !py-3 !text-xl !font-semibold">
        TH
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
