import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button } from '@/components/ui';
import { 
  HiOutlineUser, 
  HiOutlineOfficeBuilding, 
  HiOutlineUserGroup, 
  HiOutlineArrowLeft 
} from 'react-icons/hi';

const PersonaTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  const personaTypes = [
    {
      type: 'cliente',
      title: 'Cliente',
      description: 'Registro de clientes (solo información personal)',
      icon: HiOutlineUser,
      color: 'blue',
      features: [
        'Solo información de contacto',
        'Sin acceso al sistema',
        'Para presupuestos y facturas'
      ],
      route: '/personas/cliente/new'
    },
    {
      type: 'proveedor',
      title: 'Proveedor',
      description: 'Proveedor con acceso al sistema',
      icon: HiOutlineOfficeBuilding,
      color: 'orange',
      features: [
        'Acceso al sistema',
        'Gestión de productos/servicios',
        'Ver presupuestos relacionados'
      ],
      route: '/personas/proveedor/new'
    },
    {
      type: 'interno',
      title: 'Usuario Interno',
      description: 'Personal interno con roles administrativos',
      icon: HiOutlineUserGroup,
      color: 'purple',
      features: [
        'Acceso administrativo',
        'Roles: Admin/Contador',
        'Gestión completa del sistema'
      ],
      route: '/personas/interno/new'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'text-blue-600'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        button: 'bg-orange-600 hover:bg-orange-700',
        icon: 'text-orange-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700',
        icon: 'text-purple-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="plain"
          size="sm"
          onClick={() => navigate('/personas')}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          Volver a Personas
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            ¿Qué tipo de persona deseas registrar?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecciona el tipo de persona según su función en el sistema. 
            Cada tipo tiene diferentes campos y permisos.
          </p>
        </div>
      </div>

      {/* Cards de tipos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {personaTypes.map((persona, index) => {
          const colors = getColorClasses(persona.color);
          const IconComponent = persona.icon;
          
          return (
            <motion.div
              key={persona.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={`h-full ${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                onClick={() => navigate(persona.route)}
              >
                <div className="p-6 text-center">
                  {/* Icono */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconComponent className={`h-8 w-8 ${colors.icon}`} />
                  </div>
                  
                  {/* Título y descripción */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {persona.title}
                  </h3>
                  <p className={`text-sm ${colors.text} mb-4`}>
                    {persona.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="text-left space-y-2 mb-6">
                    {persona.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center">
                        <span className={`w-2 h-2 rounded-full ${colors.button.split(' ')[0]} mr-3`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Botón */}
                  <Button
                    variant="solid"
                    className={`w-full ${colors.button} text-white group-hover:scale-105 transition-transform duration-200`}
                  >
                    Crear {persona.title}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-12 max-w-4xl mx-auto">
        <Card className="bg-gray-50 border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Información importante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <strong className="text-blue-700">Clientes:</strong>
                <p>Solo almacenan información para presupuestos y facturas. No pueden acceder al sistema.</p>
              </div>
              <div>
                <strong className="text-orange-700">Proveedores:</strong>
                <p>Reciben credenciales de acceso y pueden gestionar sus productos/servicios.</p>
              </div>
              <div>
                <strong className="text-purple-700">Usuarios Internos:</strong>
                <p>Personal de la empresa con acceso completo según roles asignados.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default PersonaTypeSelector;
