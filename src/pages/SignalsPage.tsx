import { PageHeader, Card, DataTable, ErrorMessage, LoadingSpinner, StatusBadge } from '../components';
import { Icons } from '../constants';
import { useSignals } from '../hooks';
import type { Signal } from '../types';
import type { TableColumn } from '../components';

const SignalsPage: React.FC = () => {
  const { signals, isLoading, error, createSignal, refreshSignals } = useSignals();

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

  const columns: TableColumn<Signal>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (signal) => (
        <div className="text-sm font-medium text-gray-900">
          {signal.name}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (signal) => (
        <div className="text-sm text-gray-500">{signal.type}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (signal) => <StatusBadge status={signal.status} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (signal) => (
        <div className="text-sm text-gray-500">
          {new Date(signal.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (signal) => (
        <div className="text-sm text-gray-500">
          {new Date(signal.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (signal) => (
        <button
          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
          type="button"
          aria-label={`Edit ${signal.name}`}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Signals" 
        buttons={[
          {
            label: 'New Signal',
            onClick: handleNewSignal,
            icon: <Icons.Plus className="w-4 h-4" />,
          },
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={refreshSignals}
            className="mb-4"
          />
        )}
        
        {isLoading && (
          <LoadingSpinner 
            message="Loading signals..." 
            className="mb-4"
          />
        )}
        
        <Card noPadding>
          <DataTable
            data={signals}
            columns={columns}
            keyField="id"
            emptyMessage="No signals found. Create your first signal to get started."
            loading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default SignalsPage;
