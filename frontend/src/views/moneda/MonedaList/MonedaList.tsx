import React from 'react';
import { Card, Badge, Table } from '@/components/ui';
import { motion } from 'framer-motion';
import { HiOutlineEye } from 'react-icons/hi';
import type { MonedaListProps } from '../types';
import { getSimboloMoneda, getNombreMoneda } from '../types';

const { THead, TBody, Tr, Th, Td } = Table;

const MonedaList: React.FC<MonedaListProps> = ({
  monedas,
  loading,
  error,
  onView,
  selectable = false,
  viewMode = 'table'
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!monedas.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No hay monedas disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <Table>
          <THead>
            <Tr>
              <Th>Código</Th>
              <Th>Nombre</Th>
              <Th>Símbolo</Th>
              <Th>Estado</Th>
              {onView && <Th>Acciones</Th>}
            </Tr>
          </THead>
          <TBody>
            {monedas.map((moneda, index) => (
              <Tr
                key={moneda.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Td>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {moneda.codigo}
                    </span>
                  </motion.div>
                </Td>
                <Td>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {getNombreMoneda(moneda.codigo)}
                  </motion.span>
                </Td>
                <Td>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  >
                    <Badge 
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {getSimboloMoneda(moneda.codigo)}
                    </Badge>
                  </motion.div>
                </Td>
                <Td>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                  >
                    <Badge 
                      className={
                        moneda.activo 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {moneda.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </motion.div>
                </Td>
                {onView && (
                  <Td>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                      className="flex space-x-2"
                    >
                      <button
                        onClick={() => onView(moneda)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Ver detalles"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </Td>
                )}
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </motion.div>
  );
};

export default MonedaList;
