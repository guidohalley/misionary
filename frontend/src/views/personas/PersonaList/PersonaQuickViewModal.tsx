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
import BaseService from '@/services/BaseService';

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
  const [productosPage, setProductosPage] = useState(1);
  const [serviciosPage, setServiciosPage] = useState(1);
  const [presupuestosPage, setPresupuestosPage] = useState(1);
  const [empresasPage, setEmpresasPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isOpen && persona) {
      fetchPersonaDetails();
    }
  }, [isOpen, persona]);

  const fetchPersonaDetails = async () => {
    if (!persona) return;

    setLoading(true);
    try {
      const response = await BaseService.get(`/personas/${persona.id}`);
      console.log('📊 Detalles de persona completos:', response.data);
      console.log('📦 Productos:', response.data.productos);
      console.log('🛠️ Servicios:', response.data.servicios);
      console.log('📄 Presupuestos:', response.data.presupuestos);
      console.log('🏢 Empresas:', response.data.empresas);
      
      const newDetails = {
        productos: Array.isArray(response.data.productos) ? response.data.productos : [],
        servicios: Array.isArray(response.data.servicios) ? response.data.servicios : [],
        presupuestos: Array.isArray(response.data.presupuestos) ? response.data.presupuestos : [],
        empresas: Array.isArray(response.data.empresas) ? response.data.empresas : [],
      };
      
      console.log('✅ Details procesados:', newDetails);
      setDetails(newDetails);
    } catch (error) {
      console.error('❌ Error al cargar detalles:', error);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              <Card className="shadow-2xl bg-white dark:bg-gray-900">
                {/* Header Ultra Compacto */}
                <div className="bg-gray-900 dark:bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-white truncate">
                        {persona.nombre}
                      </h2>
                      <span className="text-xs px-2 py-0.5 bg-misionary-500 text-gray-900 font-semibold rounded whitespace-nowrap">
                        {persona.tipo}
                      </span>
                      {(persona as any).providerRoles && (persona as any).providerRoles.length > 0 && (
                        <span className="text-xs text-gray-400 truncate hidden sm:inline">
                          {(persona as any).providerRoles.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-1 rounded hover:bg-gray-700 transition-colors"
                    >
                      <HiX className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Spinner size="30px" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Productos - Solo para proveedores */}
                      {persona.tipo === 'PROVEEDOR' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 }}
                        >
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <HiOutlineShoppingBag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Productos
                            </h3>
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {details?.productos.length || 0}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {details?.productos && details.productos.length > 0 ? (
                            <>
                              {details.productos
                                .slice((productosPage - 1) * itemsPerPage, productosPage * itemsPerPage)
                                .map((producto: any, idx: number) => (
                                  <motion.div
                                    key={producto.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    whileHover={{ x: 3, backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                                      {producto.nombre}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2">
                                      {formatPrice(Number(producto.precio))}
                                    </span>
                                  </motion.div>
                                ))}
                              {details.productos.length > itemsPerPage && (
                                <div className="flex justify-center gap-2 pt-2">
                                  <button
                                    onClick={() => setProductosPage(p => Math.max(1, p - 1))}
                                    disabled={productosPage === 1}
                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                  >
                                    ←
                                  </button>
                                  <span className="text-xs text-gray-500">
                                    {productosPage} / {Math.ceil(details.productos.length / itemsPerPage)}
                                  </span>
                                  <button
                                    onClick={() => setProductosPage(p => Math.min(Math.ceil(details.productos.length / itemsPerPage), p + 1))}
                                    disabled={productosPage >= Math.ceil(details.productos.length / itemsPerPage)}
                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                  >
                                    →
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500 py-3 text-center">
                              Sin productos
                            </p>
                          )}
                        </div>
                      </motion.div>
                      )}

                      {/* Servicios - Solo para proveedores */}
                      {persona.tipo === 'PROVEEDOR' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <HiOutlineCog className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Servicios
                            </h3>
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {details?.servicios.length || 0}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {details?.servicios && details.servicios.length > 0 ? (
                            <>
                              {details.servicios
                                .slice((serviciosPage - 1) * itemsPerPage, serviciosPage * itemsPerPage)
                                .map((servicio: any, idx: number) => (
                                  <motion.div
                                    key={servicio.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    whileHover={{ x: 3, backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                                      {servicio.nombre}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2">
                                      {formatPrice(Number(servicio.precio))}
                                    </span>
                                  </motion.div>
                                ))}
                              {details.servicios.length > itemsPerPage && (
                                <div className="flex justify-center gap-2 pt-2">
                                  <button
                                    onClick={() => setServiciosPage(p => Math.max(1, p - 1))}
                                    disabled={serviciosPage === 1}
                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                  >
                                    ←
                                  </button>
                                  <span className="text-xs text-gray-500">
                                    {serviciosPage} / {Math.ceil(details.servicios.length / itemsPerPage)}
                                  </span>
                                  <button
                                    onClick={() => setServiciosPage(p => Math.min(Math.ceil(details.servicios.length / itemsPerPage), p + 1))}
                                    disabled={serviciosPage >= Math.ceil(details.servicios.length / itemsPerPage)}
                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                  >
                                    →
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500 py-3 text-center">
                              Sin servicios
                            </p>
                          )}
                        </div>
                      </motion.div>
                      )}

                      {/* Presupuestos - Tabla compacta */}
                      {details?.presupuestos && details.presupuestos.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <HiOutlineDocumentText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {persona.tipo === 'PROVEEDOR' ? 'Participa en' : 'Presupuestos'}
                              </h3>
                              <span className="text-xs text-gray-500">({details.presupuestos.length})</span>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">#</th>
                                  {persona.tipo === 'PROVEEDOR' && (
                                    <>
                                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Empresa</th>
                                    </>
                                  )}
                                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Estado</th>
                                  <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {details.presupuestos
                                  .slice((presupuestosPage - 1) * itemsPerPage, presupuestosPage * itemsPerPage)
                                  .map((presupuesto: any, idx: number) => (
                                    <motion.tr
                                      key={presupuesto.id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: idx * 0.02 }}
                                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">
                                        {presupuesto.id}
                                      </td>
                                      {persona.tipo === 'PROVEEDOR' && (
                                        <>
                                          <td className="py-2 px-2 text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                                            {presupuesto.cliente?.nombre || '-'}
                                          </td>
                                          <td className="py-2 px-2 text-gray-600 dark:text-gray-400 text-xs max-w-[150px] truncate">
                                            {presupuesto.empresa?.nombre || '-'}
                                          </td>
                                        </>
                                      )}
                                      <td className="py-2 px-2">
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                          {presupuesto.estado}
                                        </span>
                                      </td>
                                      <td className="py-2 px-2 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                        {formatPrice(Number(presupuesto.total))}
                                      </td>
                                    </motion.tr>
                                  ))}
                              </tbody>
                            </table>
                            {details.presupuestos.length > itemsPerPage && (
                              <div className="flex justify-center gap-2 pt-2">
                                <button
                                  onClick={() => setPresupuestosPage(p => Math.max(1, p - 1))}
                                  disabled={presupuestosPage === 1}
                                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                >
                                  ←
                                </button>
                                <span className="text-xs text-gray-500">
                                  {presupuestosPage} / {Math.ceil(details.presupuestos.length / itemsPerPage)}
                                </span>
                                <button
                                  onClick={() => setPresupuestosPage(p => Math.min(Math.ceil(details.presupuestos.length / itemsPerPage), p + 1))}
                                  disabled={presupuestosPage >= Math.ceil(details.presupuestos.length / itemsPerPage)}
                                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                >
                                  →
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Empresas - Tabla para clientes */}
                      {persona.tipo === 'CLIENTE' && details?.empresas && details.empresas.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <HiOutlineOfficeBuilding className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Empresas
                              </h3>
                              <span className="text-xs text-gray-500">({details.empresas.length})</span>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Nombre</th>
                                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">CUIT</th>
                                </tr>
                              </thead>
                              <tbody>
                                {details.empresas
                                  .slice((empresasPage - 1) * itemsPerPage, empresasPage * itemsPerPage)
                                  .map((empresa: any, idx: number) => (
                                    <motion.tr
                                      key={empresa.id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: idx * 0.02 }}
                                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">
                                        {empresa.nombre}
                                      </td>
                                      <td className="py-2 px-2 text-gray-600 dark:text-gray-400 text-xs">
                                        {empresa.cuit || '-'}
                                      </td>
                                    </motion.tr>
                                  ))}
                              </tbody>
                            </table>
                            {details.empresas.length > itemsPerPage && (
                              <div className="flex justify-center gap-2 pt-2">
                                <button
                                  onClick={() => setEmpresasPage(p => Math.max(1, p - 1))}
                                  disabled={empresasPage === 1}
                                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                >
                                  ←
                                </button>
                                <span className="text-xs text-gray-500">
                                  {empresasPage} / {Math.ceil(details.empresas.length / itemsPerPage)}
                                </span>
                                <button
                                  onClick={() => setEmpresasPage(p => Math.min(Math.ceil(details.empresas.length / itemsPerPage), p + 1))}
                                  disabled={empresasPage >= Math.ceil(details.empresas.length / itemsPerPage)}
                                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded disabled:opacity-30"
                                >
                                  →
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer - Solo si no hay contenido */}
                {!loading && (!details || (
                  (!details.productos || details.productos.length === 0) &&
                  (!details.servicios || details.servicios.length === 0) &&
                  (!details.presupuestos || details.presupuestos.length === 0) &&
                  (!details.empresas || details.empresas.length === 0)
                )) && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No hay datos relacionados para mostrar
                    </p>
                  </div>
                )}
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

