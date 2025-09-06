import React from 'react';
import { Page, Card, SignalsTable } from '../components';
import { Icon } from '../components';
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
            icon: <Icon name="plus" size="sm" />,
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
