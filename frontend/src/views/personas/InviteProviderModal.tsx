import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  Button, 
  Input, 
  Select, 
  FormItem, 
  FormContainer, 
  Alert,
} from '@/components/ui';
import { 
  HiOutlineMail, 
  HiOutlineCheck, 
  HiOutlineUserAdd,
  HiOutlineChevronLeft,
  HiOutlineClipboard
} from 'react-icons/hi';
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

const selectStyles = {
  multiValue: (base: any) => ({
    ...base,
    borderRadius: '9999px',
    paddingLeft: '8px',
    paddingRight: '8px',
    backgroundColor: '#EEF2FF',
    border: '1px solid #C7D2FE'
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    borderRadius: '50%',
    ':hover': {
      backgroundColor: '#E0E7FF'
    }
  })
};

const InviteProviderModal: React.FC<InviteProviderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link' | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

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
    setInviteMethod(null);
    setGeneratedLink(null);
    onClose();
  };

  const onSubmit = async (data: InviteFormData) => {
    try {
      setSending(true);
      setError(null);

      const response = await ApiService.fetchData({
        url: '/auth/invite',
        method: 'post',
        data: {
          email: inviteMethod === 'email' ? data.email : 'temp@misionary.com',
          tipo: 'PROVEEDOR',
          providerArea: data.providerArea,
          providerRoles: data.providerRoles,
          personalNote: data.personalNote,
          returnLinkOnly: inviteMethod === 'link'
        }
      });

      if (inviteMethod === 'link') {
        if (response.data.inviteUrl) {
          setGeneratedLink(response.data.inviteUrl);
          setSuccess(true);
        } else {
          setError('No se pudo generar el link de invitación');
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la invitación');
    } finally {
      setSending(false);
    }
  };

  const renderContent = () => {
    // Mostrar mensaje de éxito
    if (success) {
      if (inviteMethod === 'link' && generatedLink) {
        return (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <HiOutlineCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Link de invitación generado!
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Copia el link y compártelo con el proveedor
              </p>
            </div>
            <div className="relative">
              <Input
                value={generatedLink}
                readOnly
                className="pr-[100px] font-mono text-blue-600 bg-blue-50 border-blue-200 cursor-default select-all"
                size="sm"
                style={{ caretColor: 'transparent' }}
              />
              <Button
                variant="solid"
                size="sm"
                className="absolute right-0 top-0 bottom-0 rounded-l-none bg-blue-600 hover:bg-blue-700 w-[40px] flex items-center justify-center"
                onClick={() => navigator.clipboard.writeText(generatedLink)}
              >
                <HiOutlineClipboard className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <HiOutlineCheck className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Invitación enviada!
          </h3>
          <p className="text-sm text-gray-500">
            El proveedor recibirá un email con las instrucciones para completar su registro.
          </p>
        </div>
      );
    }

    // Si no se ha seleccionado método, mostrar opciones
    if (!inviteMethod) {
      return (
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              ¿Cómo quieres invitar al proveedor?
            </h3>
            <p className="text-sm text-gray-500">
              Elige el método para enviar la invitación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setInviteMethod('email')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="bg-blue-100 rounded-full p-3 mb-3">
                <HiOutlineMail className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Por Email</h4>
              <p className="text-sm text-gray-500">
                Enviar invitación directamente al email del proveedor
              </p>
            </button>

            <button
              onClick={() => setInviteMethod('link')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div className="bg-blue-100 rounded-full p-3 mb-3">
                <HiOutlineUserAdd className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Generar Link</h4>
              <p className="text-sm text-gray-500">
                Crear un link de invitación para compartir manualmente
              </p>
            </button>
          </div>
        </div>
      );
    }

    // Mostrar formulario según el método seleccionado
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
              {inviteMethod === 'email' ? (
                <HiOutlineMail className="h-6 w-6 text-blue-600" />
              ) : (
                <HiOutlineUserAdd className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                {inviteMethod === 'email' ? 'Invitar por Email' : 'Generar Link'}
              </h3>
              <p className="text-sm text-gray-500">
                {inviteMethod === 'email' 
                  ? 'La invitación será enviada por email' 
                  : 'Se generará un link para compartir'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setInviteMethod(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert type="danger" showIcon className="mb-3">
                {error}
              </Alert>
            )}

            {inviteMethod === 'email' && (
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
            )}

            <FormItem
                label="Área de especialización"
                invalid={Boolean(errors.providerArea)}
                errorMessage={errors.providerArea?.message}
                className="mb-4"
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
                      styles={selectStyles}
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
                      menuPlacement="top"
                      styles={{
                        ...selectStyles,
                        control: (base) => ({
                          ...base,
                          minHeight: '80px',
                          height: 'auto'
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          flexWrap: 'wrap',
                          padding: '8px'
                        }),
                        multiValue: (base) => ({
                          ...selectStyles.multiValue(base),
                          margin: '2px'
                        })
                      }}
                    />
                  )}
                />
              </FormItem>

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
                    className="text-gray-800"
                  />
                )}
              />
            </FormItem>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="plain"
                onClick={() => setInviteMethod(null)}
                disabled={sending}
                size="sm"
              >
                Volver
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={sending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {sending ? 'Procesando...' : inviteMethod === 'email' ? 'Enviar Invitación' : 'Generar Link'}
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    );
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={handleClose}
      className={success ? 'max-w-md' : 'max-w-3xl'}
      width={900}
    >
      {renderContent()}
    </Dialog>
  );
};

export default InviteProviderModal;