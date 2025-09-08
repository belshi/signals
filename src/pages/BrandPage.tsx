import React, { useCallback, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page, Card, BrandDetails, BrandGoals, Competitors, EditBrandModal, type BrandGoalsRef, type CompetitorsRef } from '../components';
import { Icon } from '../components';
import { useBrandsContext } from '../contexts';
import { brandService } from '../services/database';
import { createBrandId } from '../utils/typeUtils';

const BrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const { isLoading, error, refreshBrands, getBrand } = useBrandsContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const brandGoalsRef = useRef<BrandGoalsRef>(null);
  const competitorsRef = useRef<CompetitorsRef>(null);

  // Convert string brandId to BrandId type and find the brand from the loaded list
  const brandIdTyped = brandId ? createBrandId(parseInt(brandId)) : undefined;
  const brand = useMemo(() => {
    return brandIdTyped ? getBrand(brandIdTyped) : undefined;
  }, [brandIdTyped, getBrand]);

  // Handle navigation if brand is not found
  React.useEffect(() => {
    if (brandId && !isLoading && !error && !brand) {
      // Brand not found, navigate back to brands list
      navigate('/brands', { replace: true });
    }
  }, [brandId, isLoading, error, brand, navigate]);



  const handleAddGoal = useCallback(() => {
    brandGoalsRef.current?.openAddModal();
  }, []);

  const handleAddCompetitor = useCallback(() => {
    competitorsRef.current?.openAddModal();
  }, []);

  const handleEditBrandDetails = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // Create a wrapper function that matches the expected signature for EditBrandModal
  const handleUpdateBrand = useCallback(async (_id: any, updates: any) => {
    if (!brand) return;
    // The updateBrand function from useBrandsContext will handle the update
    // and automatically update the brands list
    await brandService.updateBrand(brand.id, updates);
  }, [brand]);

  const handleBrandUpdated = useCallback(() => {
    // Refresh the brands list to keep it in sync
    refreshBrands();
  }, [refreshBrands]);

  const handleDeleteBrand = useCallback(async () => {
    if (!brand) return;
    
    if (window.confirm(`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`)) {
      try {
        await brandService.deleteBrand(brand.id);
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
          <Page.Error onRetry={refreshBrands} />
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
              className="mt-4 text-nocturn hover:text-brand-500"
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
        breadcrumbs={[
          { label: 'Brands', href: '/brands' },
          { label: brand.name }
        ]}
        buttons={[
          {
            label: 'Edit',
            onClick: handleEditBrandDetails,
            variant: 'brandGray'
          },
          {
            label: 'Delete',
            onClick: handleDeleteBrand,
            variant: 'primary'
          }
        ]}
      />
      
      <Page.Content>
        <div className="space-y-6">
          <Card
            title="Brand Details"
            description="Basic information about this brand"
            icon={<Icon name="building" className="text-nocturn" size="md" />}
          >
            <BrandDetails brand={brand} />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Brand Goals"
              description="Track your brand objectives and milestones"
              icon={<Icon name="target" className="text-nocturn" size="md" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Goal',
                  onClick: handleAddGoal,
                  variant: 'brandGray'
                }
              ]}
            >
              <BrandGoals ref={brandGoalsRef} brandId={brand.id} />
            </Card>
            
            <Card
              title="Competitors"
              description="Monitor your competitive landscape"
              icon={<Icon name="users" className="text-nocturn" size="md" />}
              noPadding={true}
              buttons={[
                {
                  label: 'Add Competitor',
                  onClick: handleAddCompetitor,
                  variant: 'brandGray'
                }
              ]}
            >
              <Competitors ref={competitorsRef} brandId={brand.id} />
            </Card>
          </div>
        </div>
      </Page.Content>
      
      <EditBrandModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleBrandUpdated}
        brand={brand}
        updateBrand={handleUpdateBrand}
      />
    </Page>
  );
};

export default BrandPage;
