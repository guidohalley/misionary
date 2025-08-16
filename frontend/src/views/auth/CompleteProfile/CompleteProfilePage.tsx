import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Badge
} from '@/components/ui';
import { HiOutlineUser, HiOutlineCheck } from 'react-icons/hi';
import useAuth from '@/utils/hooks/useAuth';

interface CompleteProfileFormData {
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  cuitCuil: string;
  sitioWeb?: string;
  experienciaAnios: string;
  descripcionServicios: string;
  portafolioUrl?: string;
  disponibilidadHoraria: string;
  tarifaHora?: string;
}

const experienciaOptions = [
  { value: '0-1', label: 'Menos de 1 año' },
  { value: '1-3', label: '1-3 años' },
  { value: '3-5', label: '3-5 años' },
  { value: '5-10', label: '5-10 años' },
  { value: '10+', label: 'Más de 10 años' }
];

const disponibilidadOptions = [
  { value: 'tiempo-completo', label: 'Tiempo completo' },
  { value: 'medio-tiempo', label: 'Medio tiempo' },
  { value: 'freelance', label: 'Freelance/Por proyecto' },
  { value: 'consultor', label: 'Consultor ocasional' }
];

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const welcomeMessage = location.state?.message;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    defaultValues: {
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      cuitCuil: '',
      sitioWeb: '',
      experienciaAnios: '',
      descripcionServicios: '',
      portafolioUrl: '',
      disponibilidadHoraria: '',
      tarifaHora: ''
    }
  });

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      // TODO: Aquí llamarías a un endpoint para actualizar el perfil del proveedor
      // await updateProviderProfile(user.id, data);

      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirigir al dashboard completo
      navigate('/home', {
        state: { message: '¡Perfil completado exitosamente! Bienvenido a Misionary.' }
      });

    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  // Verificar que el usuario sea proveedor
  if (!user || !user.roles?.includes('PROVEEDOR')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso denegado</h2>
          <p className="text-gray-600 mb-6">
            Esta página es solo para proveedores registrados.
          </p>
          <Button 
            variant="solid" 
            onClick={() => navigate('/home')}
            className="w-full"
          >
            Ir al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <HiOutlineUser className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Completa tu perfil de proveedor!
            </h1>
            <p className="text-gray-600">
              Para poder trabajar con nosotros, necesitamos algunos datos adicionales
            </p>
            {welcomeMessage && (
              <Alert type="success" showIcon className="mt-4">
                {welcomeMessage}
              </Alert>
            )}
          </div>

          <FormContainer>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert type="danger" showIcon className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Información de contacto */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem
                    label="Teléfono *"
                    invalid={Boolean(errors.telefono)}
                    errorMessage={errors.telefono?.message}
                  >
                    <Controller
                      name="telefono"
                      control={control}
                      rules={{ required: 'El teléfono es requerido' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="+54 11 1234-5678"
                          autoComplete="tel"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="CUIT/CUIL *"
                    invalid={Boolean(errors.cuitCuil)}
                    errorMessage={errors.cuitCuil?.message}
                  >
                    <Controller
                      name="cuitCuil"
                      control={control}
                      rules={{ required: 'El CUIT/CUIL es requerido' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="20-12345678-9"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Dirección *"
                    invalid={Boolean(errors.direccion)}
                    errorMessage={errors.direccion?.message}
                  >
                    <Controller
                      name="direccion"
                      control={control}
                      rules={{ required: 'La dirección es requerida' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Av. Corrientes 1234"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Ciudad *"
                    invalid={Boolean(errors.ciudad)}
                    errorMessage={errors.ciudad?.message}
                  >
                    <Controller
                      name="ciudad"
                      control={control}
                      rules={{ required: 'La ciudad es requerida' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Buenos Aires"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Código postal"
                    invalid={Boolean(errors.codigoPostal)}
                    errorMessage={errors.codigoPostal?.message}
                  >
                    <Controller
                      name="codigoPostal"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="1000"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Sitio web"
                    invalid={Boolean(errors.sitioWeb)}
                    errorMessage={errors.sitioWeb?.message}
                  >
                    <Controller
                      name="sitioWeb"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://mi-sitio.com"
                        />
                      )}
                    />
                  </FormItem>
                </div>
              </div>

              {/* Información profesional */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información profesional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem
                    label="Años de experiencia *"
                    invalid={Boolean(errors.experienciaAnios)}
                    errorMessage={errors.experienciaAnios?.message}
                  >
                    <Controller
                      name="experienciaAnios"
                      control={control}
                      rules={{ required: 'Selecciona tu experiencia' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Selecciona"
                          options={experienciaOptions}
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Disponibilidad *"
                    invalid={Boolean(errors.disponibilidadHoraria)}
                    errorMessage={errors.disponibilidadHoraria?.message}
                  >
                    <Controller
                      name="disponibilidadHoraria"
                      control={control}
                      rules={{ required: 'Selecciona tu disponibilidad' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Selecciona"
                          options={disponibilidadOptions}
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="Tarifa por hora (USD)"
                    invalid={Boolean(errors.tarifaHora)}
                    errorMessage={errors.tarifaHora?.message}
                  >
                    <Controller
                      name="tarifaHora"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="50"
                          min="0"
                        />
                      )}
                    />
                  </FormItem>

                  <FormItem
                    label="URL de portafolio"
                    invalid={Boolean(errors.portafolioUrl)}
                    errorMessage={errors.portafolioUrl?.message}
                  >
                    <Controller
                      name="portafolioUrl"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://mi-portafolio.com"
                        />
                      )}
                    />
                  </FormItem>
                </div>

                <FormItem
                  label="Descripción de servicios *"
                  invalid={Boolean(errors.descripcionServicios)}
                  errorMessage={errors.descripcionServicios?.message}
                  className="mt-6"
                >
                  <Controller
                    name="descripcionServicios"
                    control={control}
                    rules={{ required: 'Describe tus servicios' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="textarea"
                        placeholder="Describe los servicios que ofreces, tu experiencia y especialidades..."
                        rows={4}
                      />
                    )}
                  />
                </FormItem>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/home')}
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  Completar más tarde
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  loading={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? 'Guardando...' : 'Completar perfil'}
                </Button>
              </div>
            </form>
          </FormContainer>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteProfilePage;
