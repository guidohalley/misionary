// Re-exports desde modules/servicio + tipos específicos de UI
export * from '../../modules/servicio/types';
export * from './schemas';

// Tipos específicos de UI para servicios
export interface ServicioListProps {
  servicios: Servicio[];
  loading: boolean;
  error: string | null;
  onEdit: (servicio: Servicio) => void;
  onDelete: (id: number) => void;
  onView?: (servicio: Servicio) => void;
}

export interface ServicioFormProps {
  initialValues?: Partial<Servicio>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}
