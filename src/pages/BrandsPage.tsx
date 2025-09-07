import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, DataTable, EmptyState, Icon, IconButton, DropdownMenu, Card } from '../components';
import { useBrandsContext } from '../contexts';
import type { EnhancedBrandDetails, TableColumn } from '../types/enhanced';
import type { DropdownMenuItem } from '../components/DropdownMenu';

const BrandsPage: React.FC = () => {
  const navigate = useNavigate();
  const { brands, isLoading, error, refreshBrands, deleteBrand } = useBrandsContext();

  const handleRowClick = useCallback((brand: EnhancedBrandDetails) => {
    navigate(`/brands/${brand.id}`);
  }, [navigate]);

  const handleAddBrand = useCallback(() => {
    console.log('Add new brand');
    // TODO: Implement add brand functionality
  }, []);

  const handleOpenBrand = useCallback((brand: EnhancedBrandDetails) => {
    navigate(`/brands/${brand.id}`);
  }, [navigate]);

  const handleEditBrand = useCallback((brand: EnhancedBrandDetails) => {
    console.log('Edit brand:', brand.id);
    // TODO: Implement edit functionality
  }, []);

  const handleDeleteBrand = useCallback(async (brand: EnhancedBrandDetails) => {
    if (window.confirm(`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`)) {
      try {
        await deleteBrand(brand.id);
        console.log('Brand deleted:', brand.id);
      } catch (error) {
        console.error('Failed to delete brand:', error);
        // TODO: Show error toast
      }
    }
  }, [deleteBrand]);

  const getActionItems = useCallback((brand: EnhancedBrandDetails): DropdownMenuItem[] => [
    {
      id: 'open',
      label: 'Open',
      icon: 'external-link',
      variant: 'default',
      onClick: () => handleOpenBrand(brand)
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => handleEditBrand(brand)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: () => handleDeleteBrand(brand)
    }
  ], [handleOpenBrand, handleEditBrand, handleDeleteBrand]);

  const columns: TableColumn<EnhancedBrandDetails>[] = [
    {
      key: 'name',
      label: 'Name',
      className: 'w-1/4 min-w-[200px]',
      render: (brand, value) => (
        <div className="flex items-center space-x-3">
          {brand.logo && (
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div className="font-medium text-gray-900 truncate">{brand.name}</div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      className: 'w-full min-w-[400px]',
      render: (brand, value) => (
        <div>
          <p className="text-sm text-gray-900 whitespace-normal">
            {brand.description}
          </p>
        </div>
      ),
    },
    {
      key: 'industry',
      label: 'Industry',
      className: 'w-1/6 min-w-[120px]',
      render: (brand, value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {brand.industry}
        </span>
      ),
    },
    {
      key: 'employeeCount',
      label: 'Employees',
      className: 'w-1/6 min-w-[100px]',
      render: (brand, value) => (
        <div className="text-sm text-gray-900">
          {brand.employeeCount ? brand.employeeCount.toLocaleString() : 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-20',
      render: (brand, value) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu
              items={getActionItems(brand)}
              trigger={
                <IconButton
                  icon="more-vertical"
                  variant="secondary"
                  size="sm"
                  ariaLabel={`More options for ${brand.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('More button clicked for:', brand.name);
                  }}
                />
              }
              className="relative z-50"
            />
          </div>
        );
      },
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
        subtitle="Manage and view all your brands"
        buttons={[
          {
            label: 'Add Brand',
            onClick: handleAddBrand,
            icon: <Icon name="plus" size="sm" />,
            variant: 'primary'
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
          <Card noPadding={true}>
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
    </Page>
  );
};

export default BrandsPage;
