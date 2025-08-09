import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Input, Button, FormItem, FormContainer, Alert } from '@/components/ui';
import useAuth from '@/utils/hooks/useAuth';
import type { LoginCredentials } from '@/@types/auth';

const LoginView = () => {
  const [error, setError] = React.useState<string | null>(null);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      // Normalizamos email y evitamos loguear la contraseña
      const payload: LoginCredentials = {
        email: (data.email || '').trim().toLowerCase(),
        password: data.password,
      };
      console.log('🔐 LoginView - Iniciando login con email:', payload.email);
      setError(null);
      const result = await signIn(payload);
      console.log('🔐 LoginView - Resultado del signIn:', result);
      
      if (result?.status === 'failed') {
        console.log('❌ LoginView - Login falló:', result.message);
        setError(result.message || 'Credenciales inválidas');
      } else if (result?.status === 'success') {
        console.log('✅ LoginView - Login exitoso');
      }
    } catch (err) {
      console.error('❌ LoginView - Error en login:', err);
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center bg-gray-100">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h3 className="mb-1 text-2xl font-bold">Iniciar Sesión</h3>
          <p>Ingresa tus credenciales para continuar</p>
        </div>
        
        {error && (
          <Alert type="danger" showIcon className="mb-4">
            {error}
          </Alert>
        )}

        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              label="Email"
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
                    message: 'Email inválido',
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    autoComplete="email"
                    {...field}
                    placeholder="usuario@ejemplo.com"
                  />
                )}
              />
            </FormItem>
            
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
                }}
                render={({ field }) => (
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                    placeholder="Tu contraseña"
                  />
                )}
              />
            </FormItem>

            <Button
              block
              variant="solid"
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </FormContainer>
      </Card>
    </div>
  );
};

export default LoginView;
