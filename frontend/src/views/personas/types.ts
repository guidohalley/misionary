// Re-export de tipos del módulo principal
export type {
  Persona,
  CreatePersonaDTO,
  UpdatePersonaDTO,
} from '@/modules/persona/types';

// Re-export de constantes del módulo principal
export {
  tipoPersonaOptions,
  rolUsuarioOptions,
} from '@/modules/persona/types';

// Tipos específicos para la vista de personas
export interface PersonaListViewState {
  searchTerm: string;
  selectedRows: number[];
  sortConfig: {
    key: keyof Persona;
    direction: 'asc' | 'desc';
  } | null;
  viewMode: 'table' | 'card';
  itemsPerPage: number;
  currentPage: number;
}

export interface PersonaFormViewState {
  isDirty: boolean;
  isSubmitting: boolean;
  showConfirmDialog: boolean;
  validationErrors: Record<string, string>;
}

// Tipos para componentes específicos
export interface PersonaListProps {
  personas: Persona[];
  loading: boolean;
  error: string | null;
  onEdit: (persona: Persona) => void;
  onDelete: (id: number) => void;
  onView?: (persona: Persona) => void;
  onBulkDelete?: (ids: number[]) => void;
  selectable?: boolean;
  viewMode?: 'table' | 'card';
}

export interface PersonaFormProps {
  initialValues?: Persona;
  onSubmit: (data: CreatePersonaDTO | UpdatePersonaDTO) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit' | 'view';
}

// Tipos para acciones
export interface PersonaActions {
  create: (data: CreatePersonaDTO) => Promise<void>;
  update: (id: number, data: UpdatePersonaDTO) => Promise<void>;
  delete: (id: number) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  export: (ids?: number[]) => Promise<void>;
  import: (file: File) => Promise<void>;
}
