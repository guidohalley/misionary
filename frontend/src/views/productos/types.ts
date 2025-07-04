// Re-exports desde modules/producto + tipos específicos de UI
export * from '../../modules/producto/types';
export * from './schemas';

// Tipos específicos de UI para productos
export interface ProductoListProps {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView?: (producto: Producto) => void;
}

export interface ProductoFormProps {
  initialValues?: Partial<Producto>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

// Options para selects (similar a personas)
export const estadoProductoOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
  { value: 'DESCONTINUADO', label: 'Descontinuado' }
];
