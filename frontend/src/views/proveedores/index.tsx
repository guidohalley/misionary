import React from 'react';
import PersonasView from '../personas';
import { TipoPersona } from '../personas/schemas';

const ProveedoresView: React.FC = () => {
  return <PersonasView tipoFiltro={TipoPersona.PROVEEDOR} />;
};

export default ProveedoresView;
