import React, { useState } from 'react';
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
  toast,
  Checkbox
} from '@/components/ui';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCreditCard,
  HiOutlineOfficeBuilding,
  HiOutlineIdentification,
  HiOutlineLocationMarker
} from 'react-icons/hi';
import { clienteConEmpresaSchema, ClienteConEmpresaFormData, TipoPersona } from '../schemas';

interface ClienteConEmpresaFormProps {
  onSubmit: (data: ClienteConEmpresaFormData) => Promise<void>;
  onCancel: () => void;
}

const ClienteConEmpresaForm: React.FC<ClienteConEmpresaFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [crearEmpresa, setCrearEmpresa] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<ClienteConEmpresaFormData>({
    resolver: zodResolver(clienteConEmpresaSchema),
    defaultValues: {
      cliente: {
        nombre: '',
        email: '',
        telefono: '',
        cvu: '',
        tipo: TipoPersona.CLIENTE,
        roles: [],
        esUsuario: false,
        activo: true,
      },
      empresa: {
        nombre: '',
        razonSocial: '',
        cuit: '',
        telefono: '',
        email: '',
        direccion: '',
        activo: true,
      },
      crearEmpresa: false
    },
  });

  const handleFormSubmit = async (data: ClienteConEmpresaFormData) => {
    try {
      // Si no se quiere crear empresa, enviar empresa como undefined
      const finalData = {
        ...data,
        empresa: data.crearEmpresa ? data.empresa : undefined
      };
      
      await onSubmit(finalData);
      toast.push(
        <Notification title="Éxito" type="success">
          Cliente {data.crearEmpresa ? 'y empresa creados' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al crear el cliente {crearEmpresa ? 'y empresa' : ''}
        </Notification>
      );
      throw error;
    }
  };

  const handleCrearEmpresaChange = (checked: boolean) => {
    setCrearEmpresa(checked);
    setValue('crearEmpresa', checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6"
    >
      <Card className="rounded-lg shadow-lg border-0">
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-700 dark:to-slate-800 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <HiOutlineUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nuevo Cliente
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Registra un nuevo cliente y opcionalmente su empresa
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
          <FormContainer>
            {/* SECCIÓN CLIENTE */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <HiOutlineUser className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Información del Cliente
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="Nombre Completo"
                  invalid={!!errors.cliente?.nombre}
                  errorMessage={errors.cliente?.nombre?.message}
                  asterisk
                >
                  <Input
                    {...register('cliente.nombre')}
                    placeholder="Nombre y apellido del cliente"
                    disabled={isSubmitting}
                    className="rounded-lg"
                    prefix={<HiOutlineUser className="h-4 w-4 text-gray-400" />}
                  />
                </FormItem>

                <FormItem
                  label="Email"
                  invalid={!!errors.cliente?.email}
                  errorMessage={errors.cliente?.email?.message}
                  asterisk
                >
                  <Input
                    {...register('cliente.email')}
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    disabled={isSubmitting}
                    className="rounded-lg"
                    prefix={<HiOutlineMail className="h-4 w-4 text-gray-400" />}
                  />
                </FormItem>

                <FormItem
                  label="Teléfono"
                  invalid={!!errors.cliente?.telefono}
                  errorMessage={errors.cliente?.telefono?.message}
                >
                  <Input
                    {...register('cliente.telefono')}
                    placeholder="+54 9 11 1234-5678"
                    disabled={isSubmitting}
                    className="rounded-lg"
                    prefix={<HiOutlinePhone className="h-4 w-4 text-gray-400" />}
                  />
                </FormItem>

                <FormItem
                  label="CVU (Clave Virtual Uniforme)"
                  invalid={!!errors.cliente?.cvu}
                  errorMessage={errors.cliente?.cvu?.message}
                >
                  <Input
                    {...register('cliente.cvu')}
                    placeholder="22 dígitos del CVU"
                    maxLength={22}
                    disabled={isSubmitting}
                    className="rounded-lg"
                    prefix={<HiOutlineCreditCard className="h-4 w-4 text-gray-400" />}
                  />
                </FormItem>
              </div>
            </div>

            {/* CHECKBOX PARA CREAR EMPRESA */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Checkbox
                  checked={crearEmpresa}
                  onChange={handleCrearEmpresaChange}
                  disabled={isSubmitting}
                />
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Crear empresa para este cliente
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registra los datos de la empresa para facturación y gestión comercial
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN EMPRESA (CONDICIONAL) */}
            {crearEmpresa && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiOutlineOfficeBuilding className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Información de la Empresa
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem
                    label="Nombre de la Empresa"
                    invalid={!!errors.empresa?.nombre}
                    errorMessage={errors.empresa?.nombre?.message}
                    asterisk
                  >
                    <Input
                      {...register('empresa.nombre')}
                      placeholder="Nombre comercial de la empresa"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      prefix={<HiOutlineOfficeBuilding className="h-4 w-4 text-gray-400" />}
                    />
                  </FormItem>

                  <FormItem
                    label="Razón Social"
                    invalid={!!errors.empresa?.razonSocial}
                    errorMessage={errors.empresa?.razonSocial?.message}
                  >
                    <Input
                      {...register('empresa.razonSocial')}
                      placeholder="Razón social completa"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      prefix={<HiOutlineIdentification className="h-4 w-4 text-gray-400" />}
                    />
                  </FormItem>

                  <FormItem
                    label="CUIT"
                    invalid={!!errors.empresa?.cuit}
                    errorMessage={errors.empresa?.cuit?.message}
                  >
                    <Input
                      {...register('empresa.cuit')}
                      placeholder="XX-XXXXXXXX-X"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      prefix={<HiOutlineIdentification className="h-4 w-4 text-gray-400" />}
                    />
                  </FormItem>

                  <FormItem
                    label="Teléfono Empresa"
                    invalid={!!errors.empresa?.telefono}
                    errorMessage={errors.empresa?.telefono?.message}
                  >
                    <Input
                      {...register('empresa.telefono')}
                      placeholder="+54 11 XXXX-XXXX"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      prefix={<HiOutlinePhone className="h-4 w-4 text-gray-400" />}
                    />
                  </FormItem>

                  <FormItem
                    label="Email Empresa"
                    invalid={!!errors.empresa?.email}
                    errorMessage={errors.empresa?.email?.message}
                  >
                    <Input
                      {...register('empresa.email')}
                      type="email"
                      placeholder="contacto@empresa.com"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      prefix={<HiOutlineMail className="h-4 w-4 text-gray-400" />}
                    />
                  </FormItem>

                  <FormItem
                    label="Dirección"
                    invalid={!!errors.empresa?.direccion}
                    errorMessage={errors.empresa?.direccion?.message}
                  >
                    <Input
                      {...register('empresa.direccion')}
                      placeholder="Dirección completa de la empresa"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      prefix={<HiOutlineLocationMarker className="h-4 w-4 text-gray-400" />}
                    />
                  </FormItem>
                </div>

                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-300">Datos de facturación</h4>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        El CUIT y la razón social son importantes para la facturación. 
                        Puedes completar estos datos más tarde si no los tienes disponibles.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Información sobre clientes</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Los clientes son registrados únicamente para datos comerciales y facturación. 
                    No tienen acceso al sistema interno de la empresa.
                    {crearEmpresa && ' La empresa asociada facilitará la gestión de presupuestos y facturas.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
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
                Registrar Cliente {crearEmpresa && 'y Empresa'}
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default ClienteConEmpresaForm;
