import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { HiOutlineOfficeBuilding, HiOutlineArrowLeft } from 'react-icons/hi';
import { useEmpresa } from '@/modules/empresa/hooks/useEmpresa';
import { useClientes } from '../hooks/useClientes';
import { updateEmpresaSchema, UpdateEmpresaFormData } from '../schemas';

const EmpresaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateEmpresa, fetchEmpresaById } = useEmpresa();
  const { clientes, loading: clientesLoading } = useClientes();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmpresa, setCurrentEmpresa] = useState<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEmpresaFormData>({
    resolver: zodResolver(updateEmpresaSchema),
    defaultValues: {
      nombre: '',
      razonSocial: '',
      cuit: '',
      telefono: '',
      email: '',
      direccion: '',
      activo: true,
    },
  });

  // Cargar datos de la empresa
  useEffect(() => {
    const loadEmpresa = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const empresa = await fetchEmpresaById(parseInt(id));
        setCurrentEmpresa(empresa);
        
        console.log('Empresa cargada para editar:', empresa);
        reset({
          nombre: empresa.nombre,
          razonSocial: empresa.razonSocial || '',
          cuit: empresa.cuit || '',
          telefono: empresa.telefono || '',
          email: empresa.email || '',
          direccion: empresa.direccion || '',
          activo: empresa.activo,
        });
      } catch (err) {
        setError('Error al cargar la empresa');
        console.error('Error loading empresa:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmpresa();
  }, [id, fetchEmpresaById, reset]);

  const onSubmit = async (data: UpdateEmpresaFormData) => {
    if (!id) return;

    console.log('Datos a enviar:', data);
    
    try {
      setError(null);
      await updateEmpresa(parseInt(id), data);
      
      toast.push(
        <Notification title="Éxito" type="success">
          Empresa actualizada correctamente
        </Notification>
      );
      
      navigate('/empresas');
    } catch (err) {
      setError('Error al actualizar la empresa');
      console.error('Error updating empresa:', err);
      
      toast.push(
        <Notification title="Error" type="danger">
          Error al actualizar la empresa
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

  if (loading && !currentEmpresa) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentEmpresa && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <Card>
          <div className="p-6">
            <div className="text-center">
              <p className="text-gray-600">Empresa no encontrada</p>
              <Button onClick={handleCancel} className="mt-4">
                Volver a la lista
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

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
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <HiOutlineOfficeBuilding className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Empresa
            </h1>
            {currentEmpresa && (
              <p className="text-gray-600">
                {currentEmpresa.nombre}
              </p>
            )}
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

                {/* Información del cliente asociado */}
                {currentEmpresa && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Cliente Asociado
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p><strong>Nombre:</strong> {currentEmpresa.cliente.nombre}</p>
                      <p><strong>Email:</strong> {currentEmpresa.cliente.email}</p>
                      {currentEmpresa.cliente.telefono && (
                        <p><strong>Teléfono:</strong> {currentEmpresa.cliente.telefono}</p>
                      )}
                    </div>
                  </div>
                )}

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
                    className="bg-blue-600 hover:bg-blue-700"
                    loading={isSubmitting}
                  >
                    Actualizar Empresa
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

export default EmpresaEdit;
