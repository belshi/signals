import React from 'react';
import { Page, Card, SignalsTable } from '../components';
import { Icons } from '../constants';
import { useSignalsContext } from '../contexts';

const SignalsPage: React.FC = () => {
  const { refreshSignals } = useSignalsContext();

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
