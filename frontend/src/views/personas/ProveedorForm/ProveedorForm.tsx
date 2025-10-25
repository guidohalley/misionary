import React from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  HiOutlineOfficeBuilding, 
  HiOutlineLockClosed, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCreditCard,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineBriefcase
} from 'react-icons/hi';
import { 
  proveedorSchema, 
  updateProveedorSchema, 
  ProveedorFormData, 
  UpdateProveedorFormData,
  TipoPersona,
  RolUsuario,
  providerAreaOptions
} from '../schemas';

interface ProveedorFormProps {
  initialData?: Partial<UpdateProveedorFormData>;
  onSubmit: (data: ProveedorFormData | UpdateProveedorFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export const ProveedorForm: React.FC<ProveedorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isEdit = mode === 'edit';
  
  const schema = isEdit ? updateProveedorSchema : proveedorSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control
  } = useForm<ProveedorFormData | UpdateProveedorFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit 
      ? {
          ...initialData,
          providerRoles: initialData?.providerRoles || []
        }
      : {
          tipo: TipoPersona.PROVEEDOR,
          esUsuario: true,
          activo: true,
          roles: [RolUsuario.PROVEEDOR],
          providerRoles: [],
          ...initialData
        },
    mode: 'onChange'
  });

  const handleFormSubmit = async (data: ProveedorFormData | UpdateProveedorFormData) => {
    try {
      await onSubmit(data);
      toast.push(
        <Notification title="Éxito" type="success">
          Proveedor {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el proveedor
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
        <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <HiOutlineOfficeBuilding className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isEdit 
                  ? 'Modifica la información del proveedor' 
                  : 'Registra un nuevo proveedor con acceso al sistema'
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
                <HiOutlineOfficeBuilding className="h-5 w-5 text-orange-600" />
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="Nombre/Razón Social"
                  invalid={!!errors.nombre}
                  errorMessage={errors.nombre?.message}
                  asterisk
                >
                  <Input
                    {...register('nombre')}
                    placeholder="Ej: Empresa Servicios S.A."
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
                    placeholder="proveedor@empresa.com"
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

              <div className="grid grid-cols-1 gap-6 mt-6">
                <FormItem
                  label="Áreas o Especialidades"
                  invalid={!!errors.providerRoles}
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
                          const values = selected ? selected.map((s: any) => s.value) : [];
                          field.onChange(values);
                          // Guardar la primera área como providerArea principal
                          setValue('providerArea', values[0] || '');
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
              </div>
            </div>

            {/* Credenciales de Acceso */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiOutlineLockClosed className="h-5 w-5 text-orange-600" />
                Credenciales de Acceso
              </h3>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineLockClosed className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Acceso al Sistema</span>
                </div>
                <p className="text-sm text-orange-700">
                  Este proveedor podrá iniciar sesión para gestionar sus productos/servicios y ver presupuestos relacionados.
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

              {/* Información de Rol */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rol asignado:</p>
                    <p className="text-sm text-gray-600">Proveedor (automático)</p>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    PROVEEDOR
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Los proveedores pueden gestionar sus productos y servicios, y ver presupuestos relacionados.
                </p>
              </div>
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
                {isEdit ? 'Actualizar Proveedor' : 'Crear Proveedor'}
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

export default ProveedorForm;
