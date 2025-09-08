import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page, Card, SignalDetails, AIInsights, AIRecommendations, EditSignalModal } from '../components';
import { Icon } from '../components';
import { useSignalsContext } from '../contexts';
import { useBrandsContext } from '../contexts';
import { talkwalkerService, type TalkwalkerCopilot } from '../services/talkwalker';
import type { EnhancedSignal, EnhancedBrandDetails, SignalId, BrandId } from '../types/enhanced';

const SignalDetailPage: React.FC = () => {
  const { signalId } = useParams<{ signalId: string }>();
  const navigate = useNavigate();
  const { getSignal, refreshSignalInsights, deleteSignal } = useSignalsContext();
  const { getBrand } = useBrandsContext();
  const [signal, setSignal] = useState<EnhancedSignal | null>(null);
  const [brand, setBrand] = useState<EnhancedBrandDetails | null>(null);
  const [copilot, setCopilot] = useState<TalkwalkerCopilot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        
        // Get the copilot if available
        if (signalData.metadata?.copilotId) {
          try {
            const copilots = await talkwalkerService.listCopilots();
            const copilotData = copilots.find(c => c.id === signalData.metadata?.copilotId);
            setCopilot(copilotData || null);
          } catch (err) {
            console.warn('Failed to load copilot details:', err);
            setCopilot(null);
          }
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
    if (!signalId || !signal || !brand) return;
    
    try {
      setIsRefreshing(true);
      setRefreshProgress('');
      setError(null);
      
      const brandDetails = {
        name: brand.name,
        industry: brand.industry,
        description: '', // Brand description not available in current schema
      };
      
      const updatedSignal = await refreshSignalInsights(
        signalId as SignalId,
        brandDetails,
        (message) => setRefreshProgress(message)
      );
      
      setSignal(updatedSignal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh AI insights');
    } finally {
      setIsRefreshing(false);
      setRefreshProgress('');
    }
  }, [signalId, signal, brand, refreshSignalInsights]);

  const handleDeleteSignal = useCallback(async () => {
    if (!signal) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${signal.name}"? This action cannot be undone.`
    );
    
    if (confirmed) {
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

  const handleOpenEdit = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleEditSuccess = useCallback(async () => {
    await refreshSignalDetails();
  }, [refreshSignalDetails]);

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
              className="mt-4 text-nocturn hover:text-brand-500"
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
            label: 'Edit name',
            onClick: handleOpenEdit,
            variant: 'brandGray',
          },
          {
            label: refreshProgress || (!signal?.metadata?.copilotId ? 'No AI copilot' : 'Refresh'),
            onClick: refreshSignalDetails,
            variant: 'secondary',
            loading: isRefreshing,
            disabled: !brand || !signal?.metadata?.copilotId
          },
          {
            label: 'Delete',
            onClick: handleDeleteSignal,
            variant: 'primary',
            loading: isDeleting
          }
        ]}
      />
      
      <Page.Content>
        <div className="space-y-6">
          <Card
            title="Signal Details"
            description="Basic information about this signal"
            icon={<Icon name="building" className="text-nocturn" size="md" />}
          >
            <SignalDetails signal={signal} brand={brand || undefined} copilot={copilot} />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIInsights signal={signal} />
            <AIRecommendations signal={signal} />
          </div>
                  </div>
      </Page.Content>

      <EditSignalModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSuccess={handleEditSuccess}
        signal={signal}
      />
    </Page>
  );
};

export default SignalDetailPage;
