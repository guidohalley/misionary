import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  Button, 
  Input, 
  Select, 
  FormItem, 
  FormContainer, 
  Alert,
  Badge,
  Checkbox 
} from '@/components/ui';
import { HiOutlineMail, HiOutlineX, HiOutlineCheck, HiOutlineUserAdd } from 'react-icons/hi';
import ApiService from '@/services/ApiService';

interface InviteProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface InviteFormData {
  email: string;
  providerArea: string;
  providerRoles: string[];
  personalNote?: string;
}

const providerAreaOptions = [
  { value: 'diseno', label: 'Diseño Gráfico' },
  { value: 'desarrollo', label: 'Desarrollo Web' },
  { value: 'marketing', label: 'Marketing Digital' },
  { value: 'fotografia', label: 'Fotografía' },
  { value: 'video', label: 'Producción de Video' },
  { value: 'redaccion', label: 'Redacción y Copywriting' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' }
];

const providerRoleOptions = [
  { value: 'DISEÑADOR', label: 'Diseñador' },
  { value: 'DESARROLLADOR', label: 'Desarrollador' },
  { value: 'FOTOGRAFO', label: 'Fotógrafo' },
  { value: 'VIDEOEDITOR', label: 'Editor de Video' },
  { value: 'COPYWRITER', label: 'Copywriter' },
  { value: 'CONSULTOR', label: 'Consultor' },
  { value: 'COORDINADOR', label: 'Coordinador de Proyecto' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media Manager' }
];

const InviteProviderModal: React.FC<InviteProviderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    defaultValues: {
      email: '',
      providerArea: '',
      providerRoles: [],
      personalNote: ''
    }
  });

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  const onSubmit = async (data: InviteFormData) => {
    try {
      setSending(true);
      setError(null);

      await ApiService.fetchData({
        url: '/auth/invite',
        method: 'post',
        data: {
          email: data.email,
          tipo: 'PROVEEDOR',
          providerArea: data.providerArea,
          providerRoles: data.providerRoles,
          personalNote: data.personalNote
        }
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onSuccess();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Error al enviar la invitación');
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <Dialog isOpen={isOpen} onClose={handleClose}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="text-center p-8"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <HiOutlineCheck className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Invitación enviada!
          </h3>
          <p className="text-sm text-gray-500">
            El proveedor recibirá un email con las instrucciones para completar su registro.
          </p>
        </motion.div>
      </Dialog>
    );
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} className="max-w-md md:max-w-lg lg:max-w-xl">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100">
              <HiOutlineUserAdd className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-medium text-gray-900">
                Invitar Proveedor
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                Envía invitación por email
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineX className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
            {error && (
              <Alert type="danger" showIcon className="mb-3">
                {error}
              </Alert>
            )}

            <FormItem
              label="Email del proveedor"
              invalid={Boolean(errors.email)}
              errorMessage={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="proveedor@ejemplo.com"
                    autoComplete="email"
                    size="sm"
                  />
                )}
              />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <FormItem
                label="Área de especialización"
                invalid={Boolean(errors.providerArea)}
                errorMessage={errors.providerArea?.message}
              >
                <Controller
                  name="providerArea"
                  control={control}
                  rules={{ required: 'Selecciona el área' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Área"
                      options={providerAreaOptions}
                      size="sm"
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Habilidades sugeridas"
                invalid={Boolean(errors.providerRoles)}
                errorMessage={errors.providerRoles?.message}
              >
                <Controller
                  name="providerRoles"
                  control={control}
                  rules={{ 
                    required: 'Selecciona habilidades',
                    validate: (value) => value.length > 0 || 'Al menos una habilidad'
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Habilidades"
                      options={providerRoleOptions}
                      isMulti
                      size="sm"
                    />
                  )}
                />
              </FormItem>
            </div>

            <FormItem label="Nota personal (opcional)">
              <Controller
                name="personalNote"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    placeholder="Mensaje personal..."
                    rows={2}
                    size="sm"
                  />
                )}
              />
            </FormItem>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={sending}
                size="sm"
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={sending}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                size="sm"
              >
                <HiOutlineMail className="w-4 h-4 mr-1" />
                {sending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </Dialog>
  );
};

export default InviteProviderModal;
