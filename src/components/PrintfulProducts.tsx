
import React from 'react';
import ProductCard from './printful/ProductCard';
import ProductsSkeleton from './printful/ProductsSkeleton';
import ErrorState from './printful/ErrorState';
import EmptyState from './printful/EmptyState';
import usePrintfulProducts from './printful/hooks/usePrintfulProducts';

const PrintfulProducts = () => {
  const { products, loading, error, selectedVariants, handleSelectVariant } = usePrintfulProducts();

  if (loading) {
    return <ProductsSkeleton />;
  }

  if (error) {
    return <ErrorState message="Error Loading Products" subMessage={error} />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          variant={selectedVariants[product.id]}
          onSelectVariant={(variantId) => handleSelectVariant(product.id, variantId)}
        />
      ))}
    </div>
  );
};

export default PrintfulProducts;
