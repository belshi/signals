import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, DataTable, EmptyState, Icon, Card, Badge, AddBrandModal } from '../components';
import { useBrandsContext } from '../contexts';
import type { EnhancedBrandDetails, TableColumn } from '../types/enhanced';

const BrandsPage: React.FC = () => {
  const navigate = useNavigate();
  const { brands, isLoading, error, refreshBrands } = useBrandsContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRowClick = useCallback((brand: EnhancedBrandDetails) => {
    navigate(`/brands/${brand.id}`);
  }, [navigate]);

  const handleAddBrand = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleBrandCreated = useCallback(() => {
    // Refresh the brands list after successful creation
    refreshBrands();
  }, [refreshBrands]);



  const columns: TableColumn<EnhancedBrandDetails>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'w-1/3 min-w-[200px]',
      render: (brand) => (
        <div className="font-medium text-gray-900 truncate">{brand.name}</div>
      ),
    },
    {
      key: 'industry',
      label: 'Industry',
      className: 'w-1/6 min-w-[120px]',
      render: (brand) => (
        <Badge variant="primary" size="md">
          {brand.industry}
        </Badge>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      className: 'w-1/6 min-w-[120px]',
      render: (brand) => (
        <div className="text-sm text-gray-900">
          {brand.location || 'N/A'}
        </div>
      ),
    },
    {
      key: 'employeeCount',
      label: 'Employees',
      className: 'w-1/6 min-w-[100px]',
      render: (brand) => (
        <div className="text-sm text-gray-900">
          {brand.employeeCount ? brand.employeeCount.toLocaleString() : 'N/A'}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Page>
        <Page.Header title="Brands" />
        <Page.Content>
          <Page.Error onRetry={refreshBrands} />
        </Page.Content>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page>
        <Page.Header title="Brands" />
        <Page.Content>
          <Page.Loading message="Loading brands..." />
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header 
        title="Brands"
        // subtitle="Manage and view all your brands"
        buttons={[
          {
            label: 'Add Brand',
            onClick: handleAddBrand,
            variant: 'secondary'
          }
        ]}
      />
      
      <Page.Content>
        {brands.length === 0 ? (
          <EmptyState
            icon={<Icon name="building" size="lg" className="text-gray-400" />}
            title="No brands found"
            description="Get started by adding your first brand to track and manage."
            action={{
              label: 'Add Brand',
              onClick: handleAddBrand,
            }}
          />
        ) : (
          <Card noPadding={false}>
            <DataTable
              data={brands}
              columns={columns}
              keyField="id"
              onRowClick={handleRowClick}
              className="bg-white"
              emptyMessage="No brands available"
            />
          </Card>
        )}
      </Page.Content>
      
      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleBrandCreated}
      />
    </Page>
  );
};

export default BrandsPage;
