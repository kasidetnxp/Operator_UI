import { Card, CardActionArea } from '@mui/material';
import { ArrowDownCircle, ArrowUpCircle, ArrowRight, RefreshCw } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-8">
        {/* Row 1 - Col 1: LOAD (คืน FPC) */}
        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('return')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <ArrowDownCircle className="w-20 h-20 text-info" />
              <h3 className="text-3xl font-bold text-foreground whitespace-pre-line">
                {t.returnFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.returnFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        {/* Row 1 - Col 2: ย้าย FPC */}
        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('move')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <ArrowRight className="w-20 h-20 text-primary" />
              <h3 className="text-3xl font-bold text-foreground whitespace-pre-line">
                {t.moveFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.moveFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        {/* Row 2 - Col 1: UNLOAD (เบิก FPC) */}
        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('request')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <ArrowUpCircle className="w-20 h-20 text-success" />
              <h3 className="text-3xl font-bold text-foreground whitespace-pre-line">
                {t.requestFPC}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t.requestFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        {/* Row 2 - Col 2: UNLOAD & LOAD (เปลี่ยน FPC) */}
        <Card className="hover:shadow-xl transition-shadow bg-card border border-border">
          <CardActionArea onClick={() => onSelectMode('unload_load')} className="!p-8 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center text-center space-y-4">
              <RefreshCw className="w-20 h-20 text-warning" />
              <h3 className="text-3xl font-bold text-foreground whitespace-pre-line">
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

