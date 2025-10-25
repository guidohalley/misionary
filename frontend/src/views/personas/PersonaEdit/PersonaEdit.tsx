import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, Input, Select, FormItem, FormContainer, Alert } from '@/components/ui';
import { usePersona } from '../hooks';
import { updatePersonaAdminSchema, UpdatePersonaAdminFormData, TipoPersona, RolUsuario, providerAreaOptions } from '../schemas';
import { tipoPersonaOptions, rolUsuarioOptions } from '../types';

const PersonaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { personas, updatePersona } = usePersona();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePersonaAdminFormData>({
    resolver: zodResolver(updatePersonaAdminSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      cvu: '',
      tipo: undefined,
      roles: [],
      providerRoles: [],
    },
  });

  const watchTipo = watch('tipo');

  // Cargar datos de la persona desde la lista existente
  useEffect(() => {
    if (!id) return;
    
    const persona = personas.find((p: any) => p.id === parseInt(id));
    if (persona) {
      console.log('Persona encontrada para editar:', persona);
      reset({
        nombre: persona.nombre,
        email: persona.email,
        telefono: persona.telefono || '',
        cvu: persona.cvu || '',
        tipo: persona.tipo as TipoPersona,
        roles: persona.roles as RolUsuario[],
        providerRoles: persona.providerRoles || [],
        providerArea: persona.providerArea || '',
      });
    }
  }, [id, personas, reset]);

  const onSubmit = async (data: UpdatePersonaAdminFormData) => {
    if (!id) return;

    console.log('Datos a enviar:', data);
    
    try {
      setError(null);
      const result = await updatePersona(parseInt(id), data);
      console.log('Resultado de actualización:', result);
      navigate('/personas');
    } catch (err) {
      setError('Error al actualizar la persona');
      console.error('Error updating persona:', err);
    }
  };

  const handleCancel = () => {
    navigate('/personas');
  };

  const currentPersona = personas.find((p: any) => p.id === parseInt(id || '0'));

  if (!currentPersona) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <Card>
          <div className="p-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Persona no encontrada</p>
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
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Editar Persona: {currentPersona.nombre}
        </h1>
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
                    label="Nombre"
                    invalid={Boolean(errors.nombre)}
                    errorMessage={errors.nombre?.message}
                  >
                    <Controller
                      name="nombre"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ingresa el nombre completo"
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
                          placeholder="correo@ejemplo.com"
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
                    label="CVU"
                    invalid={Boolean(errors.cvu)}
                    errorMessage={errors.cvu?.message}
                  >
                    <Controller
                      name="cvu"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="0123456789012345678901"
                          className="w-full"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Tipo de Persona"
                    invalid={Boolean(errors.tipo)}
                    errorMessage={errors.tipo?.message}
                  >
                    <Controller
                      name="tipo"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={tipoPersonaOptions}
                          value={tipoPersonaOptions.find(option => option.value === field.value)}
                          onChange={option => field.onChange(option?.value)}
                          placeholder="Selecciona el tipo"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Roles"
                    invalid={Boolean(errors.roles)}
                    errorMessage={errors.roles?.message}
                  >
                    <Controller
                      name="roles"
                      control={control}
                      render={({ field }) => (
                        <Select
                          isMulti
                          options={rolUsuarioOptions}
                          value={rolUsuarioOptions.filter(option => 
                            field.value?.includes(option.value)
                          )}
                          onChange={options => 
                            field.onChange(options ? options.map(option => option.value) : [])
                          }
                          placeholder="Selecciona los roles"
                        />
                      )}
                    />
                  </FormItem>
                </div>

                {/* Áreas de Especialidad - Solo para proveedores */}
                {watchTipo === TipoPersona.PROVEEDOR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 gap-6"
                  >
                    <FormItem
                      label="Áreas de Especialidad"
                      invalid={Boolean(errors.providerRoles)}
                      errorMessage={errors.providerRoles?.message}
                    >
                      <Controller
                        name="providerRoles"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isMulti
                            value={providerAreaOptions.filter(opt => 
                              field.value?.includes(opt.value)
                            )}
                            onChange={(selected: any) => {
                              field.onChange(selected ? selected.map((s: any) => s.value) : []);
                            }}
                            options={providerAreaOptions}
                            placeholder="Seleccionar áreas de especialidad..."
                            className="relative z-50"
                            menuPlacement="auto"
                          />
                        )}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Selecciona una o más áreas donde el proveedor tiene experiencia
                      </p>
                    </FormItem>
                  </motion.div>
                )}

                {/* Acciones */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <Button
                    type="button"
                    variant="plain"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="solid"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                    >
                      {isSubmitting ? 'Guardando...' : 'Actualizar'}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </FormContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PersonaEdit;
