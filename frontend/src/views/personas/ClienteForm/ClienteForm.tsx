import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Card, 
  Button, 
  Input, 
  FormItem, 
  FormContainer,
  Notification,
  toast
} from '@/components/ui';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCreditCard } from 'react-icons/hi';
import { clienteSchema, updateClienteSchema, ClienteFormData, UpdateClienteFormData } from '../schemas';

interface ClienteFormProps {
  initialData?: UpdateClienteFormData;
  onSubmit: (data: ClienteFormData | UpdateClienteFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const schema = isEdit ? updateClienteSchema : clienteSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData | UpdateClienteFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      nombre: '',
      email: '',
      telefono: '',
      cvu: '',
    },
  });

  const handleFormSubmit = async (data: ClienteFormData | UpdateClienteFormData) => {
    try {
      await onSubmit(data);
      toast.push(
        <Notification title="Éxito" type="success">
          Cliente {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el cliente
        </Notification>
      );
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className="rounded-lg shadow-lg border-0">
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <HiOutlineUser className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Modifica la información del cliente' : 'Registra un nuevo cliente en el sistema'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
          <FormContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem
                label="Nombre Completo"
                invalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
                asterisk
              >
                <Input
                  {...register('nombre')}
                  placeholder="Nombre y apellido del cliente"
                  disabled={isSubmitting}
                  className="rounded-lg"
                  prefix={<HiOutlineUser className="h-4 w-4 text-gray-400" />}
                />
              </FormItem>

              <FormItem
                label="Email"
                invalid={!!errors.email}
                errorMessage={errors.email?.message}
                asterisk
              >
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="cliente@ejemplo.com"
                  disabled={isSubmitting}
                  className="rounded-lg"
                  prefix={<HiOutlineMail className="h-4 w-4 text-gray-400" />}
                />
              </FormItem>

              <FormItem
                label="Teléfono"
                invalid={!!errors.telefono}
                errorMessage={errors.telefono?.message}
              >
                <Input
                  {...register('telefono')}
                  placeholder="+54 9 11 1234-5678"
                  disabled={isSubmitting}
                  className="rounded-lg"
                  prefix={<HiOutlinePhone className="h-4 w-4 text-gray-400" />}
                />
              </FormItem>

              <FormItem
                label="CVU (Clave Virtual Uniforme)"
                invalid={!!errors.cvu}
                errorMessage={errors.cvu?.message}
              >
                <Input
                  {...register('cvu')}
                  placeholder="22 dígitos del CVU"
                  maxLength={22}
                  disabled={isSubmitting}
                  className="rounded-lg"
                  prefix={<HiOutlineCreditCard className="h-4 w-4 text-gray-400" />}
                />
              </FormItem>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Información sobre clientes</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Los clientes son registrados únicamente para datos comerciales y facturación. 
                    No tienen acceso al sistema interno de la empresa.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 p-6 bg-gray-50 rounded-b-lg">
              <Button
                type="button"
                variant="plain"
                onClick={onCancel}
                disabled={isSubmitting}
                className="rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                {isEdit ? 'Actualizar' : 'Registrar'} Cliente
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default ClienteForm;
