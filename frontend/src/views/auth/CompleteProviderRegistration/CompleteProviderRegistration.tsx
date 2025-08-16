import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  Button,
  Alert
} from '@/components/ui';
import { HiOutlineX } from 'react-icons/hi';
import { validateInviteToken } from '@/services/AuthService';
import { MultiStepProviderForm } from './MultiStepProviderForm';
import ApiService from '@/services/ApiService';

const CompleteProviderRegistration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: {
    nombre: string;
    email: string;
    telefono?: string;
    cvu?: string;
    password: string;
    tipo: any;
    roles: any[];
    esUsuario: boolean;
    activo: boolean;
  }) => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Enviar datos completos del proveedor con el token (crea usuario completo)
      await ApiService.fetchData({
        url: '/auth/invite/complete-provider',
        method: 'post',
        data: {
          token,
          ...data
        }
      });

      // Redirigir a página de éxito
      navigate('/provider-registration-success');

    } catch (err: any) {
      setError(err.message || 'Error al completar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-msgray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 shadow-xl border-0">
          <div className="w-12 h-12 border-2 border-msgray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-msgray-500">Validando invitación...</p>
        </Card>
      </div>
    );
  }

  if (!validToken || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 shadow-xl border-0">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineX className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-msgray-600 mb-4">Invitación no válida</h2>
          <p className="text-msgray-400 mb-8">
            {error || 'El enlace de invitación ha expirado o no es válido'}
          </p>
          <Button 
            variant="solid" 
            onClick={() => navigate('/')}
            className="w-full bg-msgray-600 hover:bg-msgray-700 text-white"
          >
            Ir al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen to-white py-54 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="text-center mt-4 md:mt-6 mb-4">
          <h1 className="text-2xl font-semibold text-msgray-50">
            Bienvenido a Misionary
          </h1>
          <p className="text-msgray-100 text-sm max-w-sm mx-auto mt-1">
            Completa tu información para comenzar a trabajar con nosotros
          </p>
        </div>

        {error && (
          <Alert type="danger" showIcon className="mb-6 max-w-2xl mx-auto">
            {error}
          </Alert>
        )}

        <MultiStepProviderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </motion.div>
    </div>
  );
};

export default CompleteProviderRegistration;
