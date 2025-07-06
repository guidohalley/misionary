// Re-export de tipos del módulo principal
export type {
  Moneda,
  TipoCambio,
  ConversionRequest,
  ConversionResponse,
  TipoCambioRequest,
  CodigoMoneda
} from '@/modules/moneda/types';

// Re-export de schemas
export * from './schemas';

// Importaciones necesarias para usar en tipos
import type { Moneda, TipoCambio } from '@/modules/moneda/types';

// Tipos específicos para la vista de monedas
export interface MonedaListViewState {
  searchTerm: string;
  selectedRows: number[];
  sortConfig: {
    key: keyof Moneda;
    direction: 'asc' | 'desc';
  } | null;
  viewMode: 'table' | 'card';
  itemsPerPage: number;
  currentPage: number;
}

export interface MonedaFormViewState {
  isDirty: boolean;
  isSubmitting: boolean;
  showConfirmDialog: boolean;
  validationErrors: Record<string, string>;
}

// Tipos para componentes específicos
export interface MonedaListProps {
  monedas: Moneda[];
  loading: boolean;
  error: string | null;
  onView?: (moneda: Moneda) => void;
  selectable?: boolean;
  viewMode?: 'table' | 'card';
}

export interface TipoCambioListProps {
  tiposCambio: TipoCambio[];
  loading: boolean;
  error: string | null;
  onEdit?: (tipoCambio: TipoCambio) => void;
  onDelete?: (id: number) => void;
  onView?: (tipoCambio: TipoCambio) => void;
}

export interface TipoCambioFormProps {
  initialValues?: Partial<TipoCambio>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export interface ConversionFormProps {
  onSubmit: (data: any) => void;
  onClear?: () => void;
}

// Tipos para acciones
export interface MonedaActions {
  onCreate: () => void;
  onEdit: (moneda: Moneda) => void;
  onDelete: (id: number) => void;
  onView: (moneda: Moneda) => void;
  onRefresh: () => void;
}

// Options para selects
export const codigoMonedaViewOptions = [
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'BRL', label: 'BRL - Real Brasileño' },
  { value: 'CLP', label: 'CLP - Peso Chileno' },
  { value: 'UYU', label: 'UYU - Peso Uruguayo' }
];

// Utilidad para obtener símbolo de moneda
export const getSimboloMoneda = (codigo: string): string => {
  const simbolos: Record<string, string> = {
    ARS: '$',
    USD: 'US$',
    EUR: '€',
    BRL: 'R$',
    CLP: '$',
    UYU: '$U'
  };
  return simbolos[codigo] || codigo;
};

// Utilidad para obtener nombre de moneda
export const getNombreMoneda = (codigo: string): string => {
  const nombres: Record<string, string> = {
    ARS: 'Peso Argentino',
    USD: 'Dólar Estadounidense',
    EUR: 'Euro',
    BRL: 'Real Brasileño',
    CLP: 'Peso Chileno',
    UYU: 'Peso Uruguayo'
  };
  return nombres[codigo] || codigo;
};
