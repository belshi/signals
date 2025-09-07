import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, SignalsTable } from '../components';
import { Icon } from '../components';
import { useSignalsContext, BrandsProvider } from '../contexts';
import type { EnhancedSignal } from '../types/enhanced';

const SignalsPage: React.FC = () => {
  const { refreshSignals } = useSignalsContext();
  const navigate = useNavigate();

  const handleSignalClick = (signal: EnhancedSignal) => {
    navigate(`/signals/${signal.id}`);
  };

  return (
    <Page>
      <Page.Header 
        title="Signals" 
        buttons={[
          {
            label: 'New Signal',
            onClick: () => {
              // Button restored but without functionality
            },
            variant: 'primary',
            icon: <Icon name="plus" size="sm" />,
          },
        ]}
      />
      
      <Page.Content>
        <Page.Error onRetry={refreshSignals} />
        <Page.Loading message="Loading signals..." />
        
        <Card noPadding>
          <BrandsProvider>
            <SignalsTable onRowClick={handleSignalClick} />
          </BrandsProvider>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default SignalsPage;
