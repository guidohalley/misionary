import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  FormItem, 
  FormContainer,
  Upload,
  Badge
} from '@/components/ui';
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlineX } from 'react-icons/hi';
import { usePersona } from '../hooks';
import { createPersonaSchema, CreatePersonaFormData } from '../schemas';
import { tipoPersonaOptions, rolUsuarioOptions } from '../types';

const PersonaNew: React.FC = () => {
  const navigate = useNavigate();
  const { createPersona } = usePersona();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control
  } = useForm<CreatePersonaFormData>({
    resolver: zodResolver(createPersonaSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      cvu: '',
      roles: []
    }
  });

  const onSubmit = async (data: CreatePersonaFormData) => {
    try {
      await createPersona(data);
      navigate('/personas');
    } catch (error) {
      console.error('Error al crear persona:', error);
    }
  };

  const handleCancel = () => {
    navigate('/personas');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto p-4 max-w-7xl"
    >
      {/* Header con breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <button 
            onClick={() => navigate('/personas')}
            className="hover:text-blue-600 transition-colors"
          >
            Personas
          </button>
          <span>/</span>
          <span>Nueva Persona</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Agregar Nueva Persona
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="plain" 
              onClick={handleCancel}
              icon={<HiOutlineX />}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              icon={<HiOutlineSave />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Guardar
            </Button>
          </div>
        </div>
      </motion.div>

      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Principal - Información Básica */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Información Básica
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Configure la información básica de la persona
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label="Nombre Completo"
                        invalid={Boolean(errors.nombre)}
                        errorMessage={errors.nombre?.message}
                        asterisk
                      >
                        <Input 
                          {...register('nombre')}
                          placeholder="Ingrese el nombre completo"
                        />
                      </FormItem>

                      <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                        asterisk
                      >
                        <Input 
                          {...register('email')}
                          type="email"
                          placeholder="correo@ejemplo.com"
                        />
                      </FormItem>

                      <FormItem
                        label="Contraseña"
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                        asterisk
                      >
                        <Input 
                          {...register('password')}
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </FormItem>

                      <FormItem
                        label="Teléfono"
                        invalid={Boolean(errors.telefono)}
                        errorMessage={errors.telefono?.message}
                      >
                        <Input 
                          {...register('telefono')}
                          placeholder="+54 9 11 1234-5678"
                        />
                      </FormItem>

                      <div className="md:col-span-2">
                        <FormItem
                          label="CVU (Clave Virtual Uniforme)"
                          invalid={Boolean(errors.cvu)}
                          errorMessage={errors.cvu?.message}
                        >
                          <Input 
                            {...register('cvu')}
                            placeholder="22 dígitos del CVU"
                            maxLength={22}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Tipo y Roles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Clasificación y Permisos
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Define el tipo de persona y sus roles en el sistema
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label="Tipo de Persona"
                        invalid={Boolean(errors.tipo)}
                        errorMessage={errors.tipo?.message}
                        asterisk
                      >
                        <Select
                          placeholder="Seleccionar tipo"
                          options={tipoPersonaOptions}
                          onChange={(option) => setValue('tipo', option?.value)}
                        />
                      </FormItem>

                      <FormItem
                        label="Roles"
                        invalid={Boolean(errors.roles)}
                        errorMessage={errors.roles?.message}
                        asterisk
                      >
                        <Select
                          isMulti
                          placeholder="Seleccionar roles"
                          options={rolUsuarioOptions}
                          onChange={(options) => 
                            setValue('roles', options.map(opt => opt.value))
                          }
                        />
                      </FormItem>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Columna Lateral - Imagen y Estado */}
            <div className="space-y-6">
              
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Imagen de Perfil
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Agregue o cambie la imagen del perfil
                      </p>
                    </div>

                    <Upload
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
                      draggable
                      uploadLimit={1}
                      fileList={[]}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Arrastra tu imagen aquí, o{' '}
                          <span className="text-blue-600 cursor-pointer hover:text-blue-700">
                            navega
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Soporte: jpeg, png
                        </p>
                      </div>
                    </Upload>
                  </div>
                </Card>
              </motion.div>

              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Estado
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Estado actual:
                        </span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100">
                          Activo
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Fecha de creación:
                        </span>
                        <span className="text-sm font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </FormContainer>
    </motion.div>
  );
};

export default PersonaNew;
