import React from 'react';
import EmpresaList from './EmpresaList/EmpresaList';

const EmpresasView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <EmpresaList />
    </div>
  );
};

export default EmpresasView;
