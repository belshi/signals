import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, SignalsTable, AddSignalModal } from '../components';
import { Icon } from '../components';
import { useSignalsContext, BrandsProvider } from '../contexts';
import type { EnhancedSignal } from '../types/enhanced';

const SignalsPage: React.FC = () => {
  const { refreshSignals } = useSignalsContext();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSignalClick = (signal: EnhancedSignal) => {
    navigate(`/signals/${signal.id}`);
  };

  const handleAddSignal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleSignalCreated = useCallback(() => {
    // No need to refresh signals as the hook already updates the state optimistically
    // The signals list will automatically reflect the new signal
  }, []);

  return (
    <Page>
      <Page.Header 
        title="Signals" 
        buttons={[
          {
            label: 'New Signal',
            onClick: handleAddSignal,
            variant: 'secondary',
          },
        ]}
      />
      
      <Page.Content>
        <Page.Error onRetry={refreshSignals} />
        <Page.Loading message="Loading signals..." />
        
        <Card noPadding={false}>
          <BrandsProvider>
            <SignalsTable onRowClick={handleSignalClick} />
          </BrandsProvider>
        </Card>
      </Page.Content>
      
      <BrandsProvider>
        <AddSignalModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSignalCreated}
        />
      </BrandsProvider>
    </Page>
  );
};

export default SignalsPage;
