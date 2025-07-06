import React from 'react';
import PersonaNew from '../personas/PersonaNew';
import { TipoPersona } from '../personas/schemas';

const ProveedorNew: React.FC = () => {
  return <PersonaNew tipoPreestablecido={TipoPersona.PROVEEDOR} />;
};

export default ProveedorNew;
