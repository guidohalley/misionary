import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button } from '@/components/ui';
import { HiOutlineCheck } from 'react-icons/hi';

const ProviderRegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg text-center p-8">
          <HiOutlineCheck className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Registro completado exitosamente!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Tu perfil como proveedor ha sido creado correctamente. El equipo de Misionary 
            revisará tu información y te contactará pronto.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Recibirás un email de confirmación con los próximos pasos.
            </p>
            <Button 
              variant="solid" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProviderRegistrationSuccess;
