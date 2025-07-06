import React from 'react';
import PersonasView from '../personas';
import { TipoPersona } from '../personas/schemas';

const ClientesView: React.FC = () => {
  return <PersonasView tipoFiltro={TipoPersona.CLIENTE} />;
};

export default ClientesView;
