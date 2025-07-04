import React from 'react';
import ProductoList from './ProductoList/ProductoList';

const ProductosView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductoList />
    </div>
  );
};

export default ProductosView;
