import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  FormItem, 
  FormContainer, 
  Alert,
  Badge,
  Checkbox
} from '@/components/ui';
import { HiOutlineUserAdd, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { validateInviteToken, acceptInviteToken } from '@/services/AuthService';
import PasswordInput from '@/components/shared/PasswordInput';

interface AcceptInviteFormData {
  nombre: string;
  password: string;
  confirmPassword: string;
  providerArea: string;
  providerRoles: string[];
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

const AcceptInvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFormData>({
    defaultValues: {
      nombre: '',
      password: '',
      confirmPassword: '',
      providerArea: '',
      providerRoles: []
    }
  });

  const password = watch('password');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Token de invitación no válido');
        setValidating(false);
        return;
      }

      try {
        await validateInviteToken(token);
        setValidToken(true);
      } catch (err) {
        setError('El enlace de invitación ha expirado o no es válido');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: AcceptInviteFormData) => {
    if (!token) return;

    try {
      setError(null);
      const result = await acceptInviteToken({
        token,
        ...data,
        email: '' // El email viene del token
      });

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/sign-in', { 
          state: { message: '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.' }
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando invitación...</p>
        </Card>
      </div>
    );
  }

  if (!validToken || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <HiOutlineX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitación no válida</h2>
          <p className="text-gray-600 mb-6">
            {error || 'El enlace de invitación ha expirado o no es válido'}
          </p>
          <Button 
            variant="solid" 
            onClick={() => navigate('/sign-in')}
            className="w-full"
          >
            Ir al inicio de sesión
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center p-8">
            <HiOutlineCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido al equipo!</h2>
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido creada exitosamente. Serás redirigido al inicio de sesión.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <HiOutlineUserAdd className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Únete a Misionary!
            </h1>
            <p className="text-gray-600">
              Completa tu perfil para empezar a trabajar con nosotros
            </p>
          </div>

          <FormContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert type="danger" showIcon className="mb-4">
                  {error}
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="Nombre completo"
                  invalid={Boolean(errors.nombre)}
                  errorMessage={errors.nombre?.message}
                >
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: 'El nombre es requerido' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Juan Pérez"
                        autoComplete="name"
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Área de especialización"
                  invalid={Boolean(errors.providerArea)}
                  errorMessage={errors.providerArea?.message}
                >
                  <Controller
                    name="providerArea"
                    control={control}
                    rules={{ required: 'Selecciona tu área principal' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Selecciona tu área"
                        options={providerAreaOptions}
                      />
                    )}
                  />
                </FormItem>
              </div>

              <FormItem
                label="Habilidades y roles"
                invalid={Boolean(errors.providerRoles)}
                errorMessage={errors.providerRoles?.message}
              >
                <Controller
                  name="providerRoles"
                  control={control}
                  rules={{ 
                    required: 'Selecciona al menos una habilidad',
                    validate: (value) => value.length > 0 || 'Selecciona al menos una habilidad'
                  }}
                  render={({ field }) => (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-3">
                        Selecciona todas las habilidades que dominas:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {providerRoleOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={field.value.includes(option.value)}
                              onChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, option.value]);
                                } else {
                                  field.onChange(field.value.filter(v => v !== option.value));
                                }
                              }}
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {field.value.map((role) => {
                            const option = providerRoleOptions.find(o => o.value === role);
                            return (
                              <Badge key={role} className="bg-blue-100 text-blue-800">
                                {option?.label}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                />
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="Contraseña"
                  invalid={Boolean(errors.password)}
                  errorMessage={errors.password?.message}
                >
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 6,
                        message: 'Mínimo 6 caracteres'
                      }
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder="Tu contraseña"
                        autoComplete="new-password"
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Confirmar contraseña"
                  invalid={Boolean(errors.confirmPassword)}
                  errorMessage={errors.confirmPassword?.message}
                >
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: 'Confirma tu contraseña',
                      validate: (value) =>
                        value === password || 'Las contraseñas no coinciden'
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder="Confirma tu contraseña"
                        autoComplete="new-password"
                      />
                    )}
                  />
                </FormItem>
              </div>

              <div className="flex flex-col space-y-4 pt-6">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/sign-in')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ¿Ya tienes una cuenta? Inicia sesión
                  </button>
                </div>
              </div>
            </form>
          </FormContainer>
        </Card>
      </motion.div>
    </div>
  );
};

export default AcceptInvitePage;
