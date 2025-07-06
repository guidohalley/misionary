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
  toast,
  Select
} from '@/components/ui';
import { 
  HiOutlineUserGroup, 
  HiOutlineLockClosed, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCreditCard,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineBadgeCheck
} from 'react-icons/hi';
import { 
  internoSchema, 
  updateInternoSchema, 
  InternoFormData, 
  UpdateInternoFormData,
  TipoPersona,
  RolUsuario 
} from '../schemas';

interface InternoFormProps {
  initialData?: Partial<UpdateInternoFormData>;
  onSubmit: (data: InternoFormData | UpdateInternoFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export const InternoForm: React.FC<InternoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isEdit = mode === 'edit';
  
  const schema = isEdit ? updateInternoSchema : internoSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<InternoFormData | UpdateInternoFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit 
      ? initialData
      : {
          tipo: TipoPersona.INTERNO,
          esUsuario: true,
          activo: true,
          roles: [RolUsuario.CONTADOR],
          ...initialData
        },
    mode: 'onChange'
  });

  const watchedRoles = watch('roles') || [];

  const handleFormSubmit = async (data: InternoFormData | UpdateInternoFormData) => {
    try {
      await onSubmit(data);
      toast.push(
        <Notification title="Éxito" type="success">
          Usuario interno {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el usuario interno
        </Notification>
      );
      throw error;
    }
  };

  const handleRoleToggle = (role: RolUsuario.ADMIN | RolUsuario.CONTADOR) => {
    const currentRoles = watchedRoles as (RolUsuario.ADMIN | RolUsuario.CONTADOR)[];
    const updatedRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    
    setValue('roles', updatedRoles, { shouldValidate: true });
  };

  const roleOptions = [
    {
      value: RolUsuario.ADMIN,
      label: 'Administrador',
      description: 'Acceso completo al sistema',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      value: RolUsuario.CONTADOR,
      label: 'Contador',
      description: 'Gestión de facturas, presupuestos y reportes',
      color: 'bg-green-100 text-green-800 border-green-200'
    }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className="rounded-lg shadow-lg border-0">
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <HiOutlineUserGroup className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Editar Usuario Interno' : 'Nuevo Usuario Interno'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isEdit 
                  ? 'Modifica la información del usuario interno' 
                  : 'Registra un nuevo usuario interno con roles administrativos'
                }
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
          <FormContainer>
            {/* Información Básica */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiOutlineUserGroup className="h-5 w-5 text-purple-600" />
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="Nombre Completo"
                  invalid={!!errors.nombre}
                  errorMessage={errors.nombre?.message}
                  asterisk
                >
                  <Input
                    {...register('nombre')}
                    placeholder="Nombre y apellido del usuario"
                    disabled={isSubmitting}
                  />
                </FormItem>

                <FormItem
                  label="Email (para acceso al sistema)"
                  invalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  asterisk
                >
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="usuario@empresa.com"
                    disabled={isSubmitting}
                    prefix={<HiOutlineMail className="text-lg" />}
                  />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormItem
                  label="Teléfono"
                  invalid={!!errors.telefono}
                  errorMessage={errors.telefono?.message}
                >
                  <Input
                    {...register('telefono')}
                    placeholder="+54 9 11 1234-5678"
                    disabled={isSubmitting}
                    prefix={<HiOutlinePhone className="text-lg" />}
                  />
                </FormItem>

                <FormItem
                  label="CVU"
                  invalid={!!errors.cvu}
                  errorMessage={errors.cvu?.message}
                >
                  <Input
                    {...register('cvu')}
                    placeholder="0000003100010000000001"
                    maxLength={22}
                    disabled={isSubmitting}
                    prefix={<HiOutlineCreditCard className="text-lg" />}
                  />
                </FormItem>
              </div>
            </div>

            {/* Credenciales de Acceso */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiOutlineLockClosed className="h-5 w-5 text-purple-600" />
                Credenciales de Acceso
              </h3>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineBadgeCheck className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Acceso Administrativo</span>
                </div>
                <p className="text-sm text-purple-700">
                  Este usuario tendrá acceso completo o parcial al sistema según los roles asignados.
                </p>
              </div>

              <FormItem
                label={isEdit ? "Nueva Contraseña (dejar vacío para mantener actual)" : "Contraseña"}
                invalid={!!errors.password}
                errorMessage={errors.password?.message}
                asterisk={!isEdit}
              >
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isEdit ? 'Nueva contraseña (opcional)' : 'Mínimo 6 caracteres'}
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="h-4 w-4" />
                    ) : (
                      <HiOutlineEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormItem>
            </div>

            {/* Roles y Permisos */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiOutlineBadgeCheck className="h-5 w-5 text-purple-600" />
                Roles y Permisos
              </h3>
              
              <FormItem
                label="Roles administrativos"
                invalid={!!errors.roles}
                errorMessage={errors.roles?.message}
                asterisk
              >
                <div className="space-y-3">
                  {roleOptions.map((role) => (
                    <div
                      key={role.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        (watchedRoles as (RolUsuario.ADMIN | RolUsuario.CONTADOR)[]).includes(role.value)
                          ? `${role.color} border-2`
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleRoleToggle(role.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            (watchedRoles as (RolUsuario.ADMIN | RolUsuario.CONTADOR)[]).includes(role.value)
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-300'
                          }`}>
                            {(watchedRoles as (RolUsuario.ADMIN | RolUsuario.CONTADOR)[]).includes(role.value) && (
                              <HiOutlineBadgeCheck className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{role.label}</p>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {watchedRoles.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">Roles seleccionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {watchedRoles.map((role) => {
                        const roleInfo = roleOptions.find(r => r.value === role);
                        return (
                          <span
                            key={role}
                            className={`px-3 py-1 text-xs rounded-full font-medium ${roleInfo?.color}`}
                          >
                            {roleInfo?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </FormItem>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                variant="solid"
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="flex-1"
              >
                {isEdit ? 'Actualizar Usuario' : 'Crear Usuario Interno'}
              </Button>
              
              <Button
                variant="default"
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default InternoForm;
