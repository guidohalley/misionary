import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiOutlineShoppingBag, 
  HiOutlineCog, 
  HiOutlineDocumentText, 
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyDollar
} from 'react-icons/hi';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { Persona } from '../types';
import axios from 'axios';

interface PersonaQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona | null;
}

interface PersonaDetails {
  productos: any[];
  servicios: any[];
  presupuestos: any[];
  empresas: any[];
}

const PersonaQuickViewModal: React.FC<PersonaQuickViewModalProps> = ({
  isOpen,
  onClose,
  persona,
}) => {
  const [details, setDetails] = useState<PersonaDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && persona) {
      fetchPersonaDetails();
    }
  }, [isOpen, persona]);

  const fetchPersonaDetails = async () => {
    if (!persona) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/personas/${persona.id}`);
      setDetails({
        productos: response.data.productos || [],
        servicios: response.data.servicios || [],
        presupuestos: response.data.presupuestos || [],
        empresas: response.data.empresas || [],
      });
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setDetails({
        productos: [],
        servicios: [],
        presupuestos: [],
        empresas: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100';
      case 'ENVIADO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-100';
      case 'BORRADOR':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-100';
      case 'FACTURADO':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !persona) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              <Card className="shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {persona.nombre}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {persona.email}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={
                          persona.tipo === 'CLIENTE' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100' :
                          persona.tipo === 'PROVEEDOR' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-100' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-100'
                        }>
                          {persona.tipo}
                        </Badge>
                        {(persona as any).providerRoles && (persona as any).providerRoles.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(persona as any).providerRoles.slice(0, 3).map((area: string, idx: number) => (
                              <Badge key={idx} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-100 text-xs">
                                {area}
                              </Badge>
                            ))}
                            {(persona as any).providerRoles.length > 3 && (
                              <Badge className="bg-gray-100 text-gray-600 text-xs">
                                +{(persona as any).providerRoles.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiX className="w-6 h-6 text-gray-500" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Spinner size="40px" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Productos */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <HiOutlineShoppingBag className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Productos
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-100">
                            {details?.productos.length || 0}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {details?.productos && details.productos.length > 0 ? (
                            details.productos.map((producto: any) => (
                              <motion.div
                                key={producto.id}
                                whileHover={{ x: 5 }}
                                className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                      {producto.nombre}
                                    </p>
                                    {producto.descripcion && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {producto.descripcion}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {formatPrice(Number(producto.precio))}
                                  </span>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                              Sin productos
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Servicios */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <HiOutlineCog className="w-5 h-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Servicios
                          </h3>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100">
                            {details?.servicios.length || 0}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {details?.servicios && details.servicios.length > 0 ? (
                            details.servicios.map((servicio: any) => (
                              <motion.div
                                key={servicio.id}
                                whileHover={{ x: 5 }}
                                className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                      {servicio.nombre}
                                    </p>
                                    {servicio.descripcion && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {servicio.descripcion}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    {formatPrice(Number(servicio.precio))}
                                  </span>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                              Sin servicios
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Presupuestos */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <HiOutlineDocumentText className="w-5 h-5 text-purple-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Presupuestos
                          </h3>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-100">
                            {details?.presupuestos.length || 0}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {details?.presupuestos && details.presupuestos.length > 0 ? (
                            details.presupuestos.slice(0, 5).map((presupuesto: any) => (
                              <motion.div
                                key={presupuesto.id}
                                whileHover={{ x: 5 }}
                                className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                                        Presupuesto #{presupuesto.id}
                                      </p>
                                      <Badge className={getEstadoBadgeColor(presupuesto.estado)}>
                                        {presupuesto.estado}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {new Date(presupuesto.createdAt).toLocaleDateString('es-AR')}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                    {formatPrice(Number(presupuesto.total))}
                                  </span>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                              Sin presupuestos
                            </p>
                          )}
                          {details?.presupuestos && details.presupuestos.length > 5 && (
                            <p className="text-xs text-gray-500 text-center pt-2">
                              +{details.presupuestos.length - 5} más
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Empresas */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <HiOutlineOfficeBuilding className="w-5 h-5 text-amber-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Empresas
                          </h3>
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-100">
                            {details?.empresas.length || 0}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {details?.empresas && details.empresas.length > 0 ? (
                            details.empresas.map((empresa: any) => (
                              <motion.div
                                key={empresa.id}
                                whileHover={{ x: 5 }}
                                className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {empresa.nombre}
                                  </p>
                                  {empresa.razonSocial && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {empresa.razonSocial}
                                    </p>
                                  )}
                                  {empresa.cuit && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                      CUIT: {empresa.cuit}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                              Sin empresas
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {persona.telefono && (
                        <span>📞 {persona.telefono}</span>
                      )}
                    </div>
                    <Button
                      variant="solid"
                      size="sm"
                      onClick={onClose}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const getEstadoBadgeColor = (estado: string) => {
  switch (estado) {
    case 'APROBADO':
      return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100';
    case 'ENVIADO':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-100';
    case 'BORRADOR':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-100';
    case 'FACTURADO':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-100';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default PersonaQuickViewModal;

