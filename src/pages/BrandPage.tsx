import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page, Card, BrandDetails, BrandGoals, Competitors, EditBrandModal } from '../components';
import { Icon } from '../components';
import { useBrandsContext } from '../contexts';
import type { EnhancedBrandDetails, BrandId } from '../types/enhanced';

const BrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const { getBrand, refreshBrands } = useBrandsContext();
  const [brand, setBrand] = useState<EnhancedBrandDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadBrand = async () => {
      if (!brandId) {
        setError('Brand ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Refresh brands data first
        await refreshBrands();
        
        // Get the specific brand
        const brandData = getBrand(brandId as BrandId);
        if (!brandData) {
          setError('Brand not found');
          navigate('/brands', { replace: true });
          return;
        }
        
        setBrand(brandData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand');
      } finally {
        setIsLoading(false);
      }
    };

    loadBrand();
  }, [brandId, getBrand, refreshBrands, navigate]);

  const refreshBrandDetails = useCallback(async () => {
    if (!brandId) return;
    
    try {
      await refreshBrands();
      const brandData = getBrand(brandId as BrandId);
      if (brandData) {
        setBrand(brandData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh brand details');
    }
  }, [brandId, getBrand, refreshBrands]);

  const handleAddGoal = useCallback(() => {
    console.log('Add new goal');
    // TODO: Implement add functionality
  }, []);

  const handleAddCompetitor = useCallback(() => {
    console.log('Add new competitor');
    // TODO: Implement add functionality
  }, []);

  const handleEditBrandDetails = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleBrandUpdated = useCallback(() => {
    // Refresh the brand details after successful update
    refreshBrandDetails();
  }, [refreshBrandDetails]);

  const handleDeleteBrand = useCallback(async () => {
    if (!brand) return;
    
    if (window.confirm(`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`)) {
      try {
        // TODO: Implement delete functionality
        console.log('Delete brand:', brand.id);
        // After successful deletion, navigate back to brands list
        navigate('/brands');
      } catch (error) {
        console.error('Failed to delete brand:', error);
        // TODO: Show error toast
      }
    }
  }, [brand, navigate]);

  if (error) {
    return (
      <Page>
        <Page.Header 
          title="Brand Details" 
          breadcrumbs={[
            { label: 'Brands', href: '/brands' },
            { label: 'Brand Details' }
          ]}
        />
        <Page.Content>
          <Page.Error onRetry={refreshBrandDetails} />
        </Page.Content>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page>
        <Page.Header 
          title="Brand Details" 
          breadcrumbs={[
            { label: 'Brands', href: '/brands' },
            { label: 'Brand Details' }
          ]}
        />
        <Page.Content>
          <Page.Loading message="Loading brand details..." />
        </Page.Content>
      </Page>
    );
  }

  if (!brand) {
    return (
      <Page>
        <Page.Header 
          title="Brand Details" 
          breadcrumbs={[
            { label: 'Brands', href: '/brands' },
            { label: 'Brand Details' }
          ]}
        />
        <Page.Content>
          <div className="text-center py-12">
            <p className="text-gray-500">Brand not found</p>
            <button
              onClick={() => navigate('/brands')}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Back to Brands
            </button>
          </div>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header 
        title={brand.name}
        subtitle={brand.description}
        breadcrumbs={[
          { label: 'Brands', href: '/brands' },
          { label: brand.name }
        ]}
        buttons={[
          {
            label: 'Edit',
            onClick: handleEditBrandDetails,
            icon: <Icon name="edit" size="sm" />,
            variant: 'secondary'
          },
          {
            label: 'Delete',
            onClick: handleDeleteBrand,
            icon: <Icon name="trash" size="sm" />,
            variant: 'secondary'
          }
        ]}
      />
      
      <Page.Content>
        <div className="space-y-6">
          <Card
            title="Brand Details"
            description="Basic information about this brand"
            icon={<Icon name="building" className="text-indigo-600" size="md" />}
          >
            <BrandDetails brand={brand} />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Brand Goals"
              description="Track your brand objectives and milestones"
              icon={<Icon name="target" className="text-indigo-600" size="md" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Goal',
                  onClick: handleAddGoal,
                  icon: <Icon name="plus" size="sm" />,
                  variant: 'secondary'
                }
              ]}
            >
              <BrandGoals brandId={brand.id} />
            </Card>
            
            <Card
              title="Competitors"
              description="Monitor your competitive landscape"
              icon={<Icon name="users" className="text-indigo-600" size="md" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Competitor',
                  onClick: handleAddCompetitor,
                  icon: <Icon name="plus" size="sm" />,
                  variant: 'secondary'
                }
              ]}
            >
              <Competitors brandId={brand.id} />
            </Card>
          </div>
        </div>
      </Page.Content>
      
      <EditBrandModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleBrandUpdated}
        brand={brand}
      />
    </Page>
  );
};

export default BrandPage;
