import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  FormItem, 
  FormContainer, 
  Alert, 
  Switcher,
  Notification,
  toast
} from '@/components/ui';
import { HiOutlineOfficeBuilding, HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi';
import { useEmpresa } from '@/modules/empresa/hooks/useEmpresa';
import { useClientes } from '../hooks/useClientes';
import { createEmpresaSchema, CreateEmpresaFormData } from '../schemas';

const EmpresaNew: React.FC = () => {
  const navigate = useNavigate();
  const { createEmpresa } = useEmpresa();
  const { clientes, loading: clientesLoading } = useClientes();
  
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmpresaFormData>({
    resolver: zodResolver(createEmpresaSchema),
    defaultValues: {
      nombre: '',
      razonSocial: '',
      cuit: '',
      telefono: '',
      email: '',
      direccion: '',
      clienteId: undefined as any,
      activo: true,
    },
  });

  const onSubmit = async (data: CreateEmpresaFormData) => {
    console.log('Datos a enviar:', data);
    
    try {
      setError(null);
      await createEmpresa(data);
      
      toast.push(
        <Notification title="Éxito" type="success">
          Empresa creada correctamente
        </Notification>
      );
      
      navigate('/empresas');
    } catch (err) {
      setError('Error al crear la empresa');
      console.error('Error creating empresa:', err);
      
      toast.push(
        <Notification title="Error" type="danger">
          Error al crear la empresa
        </Notification>
      );
    }
  };

  const handleCancel = () => {
    navigate('/empresas');
  };

  // Opciones para el select de clientes
  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: `${cliente.nombre} (${cliente.email})`
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto p-4 space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="plain"
          onClick={handleCancel}
          icon={<HiOutlineArrowLeft />}
          className="text-gray-600 hover:text-gray-800"
        >
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <HiOutlinePlus className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nueva Empresa
            </h1>
            <p className="text-gray-600">
              Crea una nueva empresa en el sistema
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card>
          <div className="p-6">
            {error && (
              <Alert
                type="danger"
                title="Error"
                className="mb-6"
              >
                {error}
              </Alert>
            )}

            <FormContainer>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Cliente Asociado */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">
                    Cliente Asociado *
                  </h3>
                  <FormItem
                    invalid={Boolean(errors.clienteId)}
                    errorMessage={errors.clienteId?.message}
                  >
                    <Controller
                      name="clienteId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          placeholder="Selecciona un cliente"
                          options={clienteOptions}
                          isLoading={clientesLoading}
                          className="w-full"
                          value={field.value}
                          onChange={(option: any) => field.onChange(option?.value)}
                        />
                      )}
                    />
                  </FormItem>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem
                    label="Nombre de la empresa *"
                    invalid={Boolean(errors.nombre)}
                    errorMessage={errors.nombre?.message}
                  >
                    <Controller
                      name="nombre"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Nombre de la empresa"
                          className="w-full"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Razón Social"
                    invalid={Boolean(errors.razonSocial)}
                    errorMessage={errors.razonSocial?.message}
                  >
                    <Controller
                      name="razonSocial"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Razón social completa"
                          className="w-full"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="CUIT"
                    invalid={Boolean(errors.cuit)}
                    errorMessage={errors.cuit?.message}
                  >
                    <Controller
                      name="cuit"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="XX-XXXXXXXX-X"
                          className="w-full"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Teléfono"
                    invalid={Boolean(errors.telefono)}
                    errorMessage={errors.telefono?.message}
                  >
                    <Controller
                      name="telefono"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="11 1234-5678"
                          className="w-full"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                  >
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="contacto@empresa.com"
                          className="w-full"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Estado"
                    invalid={Boolean(errors.activo)}
                    errorMessage={errors.activo?.message}
                  >
                    <Controller
                      name="activo"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-3">
                          <Switcher
                            checked={field.value}
                            onChange={field.onChange}
                          />
                          <span className="text-sm text-gray-600">
                            {field.value ? 'Empresa activa' : 'Empresa inactiva'}
                          </span>
                        </div>
                      )}
                    />
                  </FormItem>
                </div>

                {/* Dirección - Campo completo */}
                <FormItem
                  label="Dirección"
                  invalid={Boolean(errors.direccion)}
                  errorMessage={errors.direccion?.message}
                >
                  <Controller
                    name="direccion"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Dirección completa"
                        className="w-full"
                      />
                    )}
                  />
                </FormItem>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-6">
                  <Button
                    type="button"
                    variant="plain"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    className="bg-green-600 hover:bg-green-700"
                    loading={isSubmitting}
                    icon={<HiOutlinePlus />}
                  >
                    Crear Empresa
                  </Button>
                </div>
              </form>
            </FormContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EmpresaNew;
