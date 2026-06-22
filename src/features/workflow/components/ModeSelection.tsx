import { Card, CardActionArea } from '@mui/material';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language, OperationMode } from '@/shared/types';

interface ModeSelectionProps {
  onSelectMode: (mode: OperationMode) => void;
  language: Language;
}

export function ModeSelection({ onSelectMode, language }: ModeSelectionProps) {
  const t = translations[language];

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2 className="text-5xl font-bold text-center mb-12 text-foreground">
        {t.selectMode}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-8">
        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('return')} className="!p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <ArrowDownCircle className="w-28 h-28 text-info" />
              <h3 className="text-4xl font-bold text-foreground">
                {t.returnFPC}
              </h3>
              <p className="text-xl text-muted-foreground">
                {t.returnFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('request')} className="!p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <ArrowUpCircle className="w-28 h-28 text-success" />
              <h3 className="text-4xl font-bold text-foreground">
                {t.requestFPC}
              </h3>
              <p className="text-xl text-muted-foreground">
                {t.requestFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('swap')} className="!p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <ArrowLeftRight className="w-28 h-28 text-primary" />
              <h3 className="text-4xl font-bold text-foreground">
                {t.swapFPC}
              </h3>
              <p className="text-xl text-muted-foreground">
                {t.swapFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}

