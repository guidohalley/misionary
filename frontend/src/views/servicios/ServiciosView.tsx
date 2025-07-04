import React from 'react';
import ServicioList from './ServicioList/ServicioList';

const ServiciosView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ServicioList />
    </div>
  );
};

export default ServiciosView;
