import { Card, CardActionArea } from '@mui/material';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
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
      <h2 className="text-5xl font-bold text-center mb-12 text-gray-900">
        {t.selectMode}
      </h2>

      <div className="grid grid-cols-2 gap-10 max-w-5xl w-full px-8">
        <Card className="hover:shadow-xl transition-shadow">
          <CardActionArea onClick={() => onSelectMode('return')} className="!p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <ArrowDownCircle className="w-28 h-28 text-blue-600" />
              <h3 className="text-4xl font-bold text-gray-900">
                {t.returnFPC}
              </h3>
              <p className="text-xl text-gray-600">
                {t.returnFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardActionArea onClick={() => onSelectMode('request')} className="!p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <ArrowUpCircle className="w-28 h-28 text-green-600" />
              <h3 className="text-4xl font-bold text-gray-900">
                {t.requestFPC}
              </h3>
              <p className="text-xl text-gray-600">
                {t.requestFPCDesc}
              </p>
            </div>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}
