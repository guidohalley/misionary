import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  Button, 
  Input, 
  FormItem, 
  FormContainer
} from '@/components/ui';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlinePhone, 
  HiOutlineCreditCard,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheck
} from 'react-icons/hi';
import { TipoPersona, RolUsuario } from '../../personas/schemas';

export interface MultiStepFormData {
  nombre: string;
  email: string;
  telefono?: string;
  cvu?: string;
  password: string;
  confirmPassword: string;
}

interface MultiStepProviderFormProps {
  onSubmit: (data: {
    nombre: string;
    email: string;
    telefono?: string;
    cvu?: string;
    password: string;
    tipo: TipoPersona.PROVEEDOR;
    roles: RolUsuario.PROVEEDOR[];
    esUsuario: true;
    activo: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const steps = [
  {
    title: 'Información Personal',
    description: 'Datos básicos para tu cuenta',
    icon: HiOutlineUser,
    fields: ['nombre', 'email']
  },
  {
    title: 'Información de Contacto',
    description: 'Detalles adicionales (opcionales)',
    icon: HiOutlinePhone,
    fields: ['telefono', 'cvu']
  },
  {
    title: 'Crear Contraseña',
    description: 'Protege tu cuenta',
    icon: HiOutlineLockClosed,
    fields: ['password', 'confirmPassword']
  }
];

export const MultiStepProviderForm: React.FC<MultiStepProviderFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<MultiStepFormData>>({});

  const {
    register,
    handleSubmit,
    reset,
    watch
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: formData
  });

  const nextStep = async () => {
    const currentData = watch();
    
    // Validación simple por paso
    let isValid = true;
    let errorMessage = '';
    
    if (currentStep === 0) {
      if (!currentData.nombre || currentData.nombre.length < 2) {
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
        isValid = false;
      } else if (!currentData.email || !currentData.email.includes('@')) {
        errorMessage = 'Ingresa un email válido';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!currentData.password || currentData.password.length < 6) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
      } else if (currentData.password !== currentData.confirmPassword) {
        errorMessage = 'Las contraseñas no coinciden';
        isValid = false;
      }
    }
    
    if (isValid) {
      setFormData(prev => ({ ...prev, ...currentData }));
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        reset({});
      }
    } else {
      // Mostrar error
      console.error(errorMessage);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      reset(formData);
    }
  };

  type FinalSubmit = Parameters<MultiStepProviderFormProps['onSubmit']>[0];

  const onFormSubmit = async (data: any) => {
    const completeData = { ...formData, ...data };
    
    const finalData: FinalSubmit = {
      nombre: completeData.nombre!,
      email: completeData.email!,
      telefono: completeData.telefono,
      cvu: completeData.cvu,
      password: completeData.password!,
      tipo: TipoPersona.PROVEEDOR,
      roles: [RolUsuario.PROVEEDOR] as RolUsuario.PROVEEDOR[],
      esUsuario: true,
      activo: true
    };
    
    await onSubmit(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicador de progreso minimalista */}
      <div className="flex justify-center mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex items-center">
              {/* Círculo del paso */}
              <div
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-in-out
                  ${isCompleted 
                    ? 'bg-msgray-600 text-white shadow-lg' 
                    : isCurrent 
                      ? 'bg-white border-2 border-msgray-600 text-msgray-600 shadow-md' 
                      : 'bg-msgray-100 text-msgray-300 border border-msgray-200'
                  }
                `}
              >
                {isCompleted ? (
                  <HiOutlineCheck className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              
              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    w-12 h-0.5 mx-3 transition-all duration-300
                    ${isCompleted ? 'bg-msgray-600' : 'bg-msgray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Formulario */}
      <Card className="p-6 shadow-xl border-0 bg-white">
        <FormContainer>
          <form onSubmit={handleSubmit(currentStep === steps.length - 1 ? onFormSubmit : nextStep)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Paso 1: Información Personal */}
                {currentStep === 0 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-base font-semibold text-msgray-600 mb-1">
                        {steps[currentStep].title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
            <FormItem label="Nombre completo" className="text-sm">
                        <Input
                          {...register('nombre')}
                          placeholder="Tu nombre completo"
              className="h-10 text-sm"
              prefix={<HiOutlineUser className="text-sm text-msgray-400" />}
                        />
                      </FormItem>

            <FormItem label="Correo electrónico" className="text-sm">
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="tu@email.com"
              className="h-10 text-sm"
              prefix={<HiOutlineMail className="text-sm text-msgray-400" />}
                        />
                      </FormItem>
                    </div>
                  </>
                )}

                {/* Paso 2: Información de Contacto */}
                {currentStep === 1 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-base font-semibold text-msgray-600 mb-1">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-msgray-400 text-xs">
                        Estos datos son opcionales pero nos ayudan a contactarte mejor
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
            <FormItem label="Teléfono" className="text-sm">
                        <Input
                          {...register('telefono')}
                          placeholder="+54 9 11 1234-5678"
              className="h-10 text-sm"
              prefix={<HiOutlinePhone className="text-sm text-msgray-400" />}
                        />
                      </FormItem>

            <FormItem label="CVU/CBU para pagos" className="text-sm">
                        <Input
                          {...register('cvu')}
                          placeholder="0000003100010000000001"
              className="h-10 text-sm"
              prefix={<HiOutlineCreditCard className="text-sm text-msgray-400" />}
                        />
                      </FormItem>
                    </div>
                  </>
                )}

                {/* Paso 3: Seguridad */}
                {currentStep === 2 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-base font-semibold text-msgray-600 mb-1">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-msgray-400 text-xs">
                        Elige una contraseña segura para proteger tu cuenta
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
            <FormItem label="Contraseña" className="text-sm">
                        <Input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
              className="h-10 text-sm"
              prefix={<HiOutlineLockClosed className="text-sm text-msgray-400" />}
                          suffix={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-msgray-400 hover:text-msgray-600 transition-colors"
                            >
                              {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                          }
                        />
                      </FormItem>

            <FormItem label="Confirmar contraseña" className="text-sm">
                        <Input
                          {...register('confirmPassword')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repite tu contraseña"
              className="h-10 text-sm"
              prefix={<HiOutlineLockClosed className="text-sm text-msgray-400" />}
                          suffix={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-sm text-msgray-400 hover:text-msgray-600 transition-colors"
                            >
                              {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                          }
                        />
                      </FormItem>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Botones de navegación */}
            <div className="flex justify-between mt-8 pt-6 border-t border-msgray-100">
              <Button
                type="button"
                variant="default"
                onClick={currentStep === 0 ? onCancel : prevStep}
                className="flex items-center gap-2 px-4 py-2 text-sm text-msgray-500 hover:text-msgray-600 hover:bg-msgray-50 border-msgray-200"
              >
                <HiOutlineArrowLeft className="w-4 h-4" />
                {currentStep === 0 ? 'Cancelar' : 'Anterior'}
              </Button>

              <Button
                type="submit"
                variant="solid"
                loading={isLoading}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-msgray-600 hover:bg-msgray-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <HiOutlineCheck className="w-4 h-4" />
                    Completar registro
                  </>
                ) : (
                  <>
                    Continuar
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </FormContainer>
      </Card>
    </div>
  );
};
