import { Card, CardActionArea } from '@mui/material';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, RefreshCw } from 'lucide-react';
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full px-8">
        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('return')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <ArrowDownCircle className="w-20 h-20 text-info" />
              <h3 className="text-3xl font-bold text-foreground">
                {t.returnFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.returnFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('request')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <ArrowUpCircle className="w-20 h-20 text-success" />
              <h3 className="text-3xl font-bold text-foreground">
                {t.requestFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.requestFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('swap')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <ArrowLeftRight className="w-20 h-20 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">
                {t.swapFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.swapFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('unload_load')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <RefreshCw className="w-20 h-20 text-warning" />
              <h3 className="text-3xl font-bold text-foreground">
                {t.unloadLoadFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.unloadLoadFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}

