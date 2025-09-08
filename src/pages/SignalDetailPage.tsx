import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page, Card, SignalDetails, AIInsights, AIRecommendations, CSVDataBlock } from '../components';
import { Icon } from '../components';
import { useSignalsContext } from '../contexts';
import { useBrandsContext } from '../contexts';
import type { EnhancedSignal, EnhancedBrandDetails, SignalId, BrandId } from '../types/enhanced';

const SignalDetailPage: React.FC = () => {
  const { signalId } = useParams<{ signalId: string }>();
  const navigate = useNavigate();
  const { getSignal, refreshSignals, deleteSignal } = useSignalsContext();
  const { getBrand } = useBrandsContext();
  const [signal, setSignal] = useState<EnhancedSignal | null>(null);
  const [brand, setBrand] = useState<EnhancedBrandDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadSignal = async () => {
      if (!signalId) {
        setError('Signal ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Get the specific signal
        const signalData = getSignal(signalId as SignalId);
        if (!signalData) {
          setError('Signal not found');
          navigate('/signals', { replace: true });
          return;
        }
        
        setSignal(signalData);
        
        // Get the linked brand if available
        if (signalData.brandId) {
          const brandData = getBrand(signalData.brandId as BrandId);
          setBrand(brandData || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load signal');
      } finally {
        setIsLoading(false);
      }
    };

    loadSignal();
  }, [signalId, getSignal, getBrand, navigate]);

  const refreshSignalDetails = useCallback(async () => {
    if (!signalId) return;
    
    try {
      setIsRefreshing(true);
      await refreshSignals();
      const signalData = getSignal(signalId as SignalId);
      if (signalData) {
        setSignal(signalData);
        
        // Update brand data as well
        if (signalData.brandId) {
          const brandData = getBrand(signalData.brandId as BrandId);
          setBrand(brandData || null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh signal details');
    } finally {
      setIsRefreshing(false);
    }
  }, [signalId, getSignal, getBrand, refreshSignals]);

  const handleDeleteSignal = useCallback(async () => {
    if (!signal) return;
    
    if (window.confirm(`Are you sure you want to delete "${signal.name}"? This action cannot be undone.`)) {
      try {
        setIsDeleting(true);
        await deleteSignal(signal.id);
        // After successful deletion, navigate back to signals list
        navigate('/signals');
      } catch (error) {
        console.error('Failed to delete signal:', error);
        setError('Failed to delete signal. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  }, [signal, deleteSignal, navigate]);

  if (error) {
    return (
      <Page>
        <Page.Header 
          title="Signal Details" 
          breadcrumbs={[
            { label: 'Signals', href: '/signals' },
            { label: 'Signal Details' }
          ]}
        />
        <Page.Content>
          <Page.Error onRetry={refreshSignalDetails} />
        </Page.Content>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page>
        <Page.Header 
          title="Signal Details" 
          breadcrumbs={[
            { label: 'Signals', href: '/signals' },
            { label: 'Signal Details' }
          ]}
        />
        <Page.Content>
          <Page.Loading message="Loading signal details..." />
        </Page.Content>
      </Page>
    );
  }

  if (!signal) {
    return (
      <Page>
        <Page.Header 
          title="Signal Details" 
          breadcrumbs={[
            { label: 'Signals', href: '/signals' },
            { label: 'Signal Details' }
          ]}
        />
        <Page.Content>
          <div className="text-center py-12">
            <p className="text-gray-500">Signal not found</p>
            <button
              onClick={() => navigate('/signals')}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Back to Signals
            </button>
          </div>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header 
        title={signal.name}
        breadcrumbs={[
          { label: 'Signals', href: '/signals' },
          { label: signal.name }
        ]}
        buttons={[
          {
            label: 'Refresh',
            onClick: refreshSignalDetails,
            icon: <Icon name="building" size="sm" />,
            variant: 'secondary',
            loading: isRefreshing
          },
          {
            label: 'Delete',
            onClick: handleDeleteSignal,
            icon: <Icon name="trash" size="sm" />,
            variant: 'secondary',
            loading: isDeleting
          }
        ]}
      />
      
      <Page.Content>
        <div className="space-y-6">
          <Card
            title="Signal Details"
            description="Basic information about this signal"
            icon={<Icon name="building" className="text-indigo-600" size="md" />}
          >
            <SignalDetails signal={signal} brand={brand || undefined} />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIInsights signal={signal} />
            <AIRecommendations signal={signal} />
          </div>
          
          <CSVDataBlock signal={signal} />
        </div>
      </Page.Content>
    </Page>
  );
};

export default SignalDetailPage;
