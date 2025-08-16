import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  Button,
  Alert
} from '@/components/ui';
import { HiOutlineUserAdd, HiOutlineX } from 'react-icons/hi';
import { validateInviteToken } from '@/services/AuthService';
import { ProveedorForm } from '@/views/personas/ProveedorForm/ProveedorForm';
import { ProveedorFormData } from '@/views/personas/schemas';
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

  const handleSubmit = async (data: ProveedorFormData) => {
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
            onClick={() => navigate('/')}
            className="w-full"
          >
            Ir al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-8">
          <HiOutlineUserAdd className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Completa tu registro como proveedor
          </h1>
          <p className="text-gray-600">
            Completa todos los datos para finalizar tu registro en Misionary
          </p>
        </div>

        {error && (
          <Alert type="danger" showIcon className="mb-6 max-w-4xl mx-auto">
            {error}
          </Alert>
        )}

        <ProveedorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          mode="create"
        />
      </motion.div>
    </div>
  );
};

export default CompleteProviderRegistration;
