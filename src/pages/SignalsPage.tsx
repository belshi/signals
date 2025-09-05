import React from 'react';
import { Page, Card, SignalsTable } from '../components';
import { Icons } from '../constants';
import { useSignalsContext } from '../contexts';

const SignalsPage: React.FC = () => {
  const { createSignal, refreshSignals } = useSignalsContext();

  const handleNewSignal = async (): Promise<void> => {
    try {
      await createSignal({
        name: 'New Signal',
        type: 'Analytics',
      });
    } catch (err) {
      console.error('Failed to create signal:', err);
    }
  };

  return (
    <Page>
      <Page.Header 
        title="Signals" 
        buttons={[
          {
            label: 'New Signal',
            onClick: handleNewSignal,
            icon: <Icons.Plus className="w-4 h-4" />,
          },
        ]}
      />
      
      <Page.Content>
        <Page.Error onRetry={refreshSignals} />
        <Page.Loading message="Loading signals..." />
        
        <Card noPadding>
          <SignalsTable />
        </Card>
      </Page.Content>
    </Page>
  );
};

export default SignalsPage;
