import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, Button, TextField, Alert, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { translations } from '@/shared/utils/translations';
import type { Language } from '@/shared/types';
import { searchFPC } from '@/shared/utils/mockApi';
import type { FPCItem } from '@/shared/utils/mockApi';

interface FPCSearchPageProps {
  employeeId: string;
  language: Language;
  onBack: () => void;
}

export function FPCSearchPage({ language, onBack }: FPCSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allFPCItems, setAllFPCItems] = useState<FPCItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'Storage' | 'Service' | 'Deposit PM' | 'Deposit Production'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const t = translations[language];

  // Load FPC items on mount
  useEffect(() => {
    const loadFPCData = async () => {
      setIsLoading(true);
      try {
        const data = await searchFPC('');
        setAllFPCItems(data);
      } catch (err) {
        console.error(err);
        setError(t.error_network);
      } finally {
        setIsLoading(false);
      }
    };
    loadFPCData();
  }, [t.error_network]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: typeof activeTab) => {
    setActiveTab(newValue);
  };

  // Filter items by tab and search query
  const filteredItems = useMemo(() => {
    let result = allFPCItems;
    if (activeTab !== 'ALL') {
      result = result.filter(item => item.category === activeTab);
    }
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.address.toLowerCase().includes(lowerQuery) ||
          item.functionName.toLowerCase().includes(lowerQuery) ||
          item.label.toLowerCase().includes(lowerQuery) ||
          (item.comment && item.comment.toLowerCase().includes(lowerQuery))
      );
    }
    return result;
  }, [allFPCItems, activeTab, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <Button
          startIcon={<ArrowLeft className="w-6 h-6" />}
          onClick={onBack}
          variant="outlined"
          size="large"
          className="!px-6 !py-3 !text-lg w-full sm:w-auto shrink-0"
        >
          {t.back}
        </Button>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center truncate">
          {t.searchFPC}
        </h2>
        <div className="hidden sm:block w-24 sm:w-32 md:w-40 shrink-0" />
      </div>
 
      {/* Main Content Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card border border-border">
        <CardContent className="p-8 flex flex-col flex-1 min-h-0">
          {/* Tabs Filter */}
          <div className="border-b border-border mb-6">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  py: 2,
                  px: 4,
                  minWidth: 120,
                  textTransform: 'none',
                },
              }}
            >
              <Tab value="ALL" label={t.allTab} />
              <Tab value="Storage" label={t.storageTab} />
              <Tab value="Service" label={t.serviceTab} />
              <Tab value="Deposit PM" label={t.depositPMTab} />
              <Tab value="Deposit Production" label={t.depositProductionTab} />
            </Tabs>
          </div>
 
          {/* Search bar */}
          <TextField
            fullWidth
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            className="!mb-6"
            InputProps={{ className: '!text-2xl !py-4' }}
            inputProps={{ style: { fontSize: '1.5rem', padding: '1rem' } }}
          />
 
          {error && (
            <Alert severity="error" className="!text-xl !py-4 !mb-6">
              {error}
            </Alert>
          )}
 
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl text-muted-foreground">{t.pleaseWait}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border border-border rounded-lg bg-background">
              <p className="text-2xl text-muted-foreground">{t.noResults}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto border border-border rounded-lg shadow-inner bg-card">
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4 !pl-8">{t.address}</TableCell>
                    <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4">{t.function}</TableCell>
                    <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4">{t.label}</TableCell>
                    <TableCell className="!text-xl !font-bold !bg-background !text-muted-foreground !py-4 !pr-8">{t.comment}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((fpc) => (
                    <TableRow
                      key={fpc.id}
                      hover
                      className="transition-colors hover:bg-info-background/40"
                    >
                      <TableCell className="!text-xl !py-5 !pl-8 font-medium text-foreground">{fpc.address}</TableCell>
                      <TableCell className="!text-xl !py-5 font-semibold text-foreground">{fpc.functionName}</TableCell>
                      <TableCell className="!text-xl !py-5 font-mono text-info">{fpc.label}</TableCell>
                      <TableCell className="!text-xl !py-5 !pr-8 text-muted-foreground">{fpc.comment || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
