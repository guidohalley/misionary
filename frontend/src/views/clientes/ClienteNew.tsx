import React from 'react';
import PersonaNew from '../personas/PersonaNew';
import { TipoPersona } from '../personas/schemas';

const ClienteNew: React.FC = () => {
  return <PersonaNew tipoPreestablecido={TipoPersona.CLIENTE} />;
};

export default ClienteNew;
