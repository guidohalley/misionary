import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Badge } from '@/components/ui';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineCalendar } from 'react-icons/hi';
import type { TipoCambio, CodigoMoneda } from '../types';
import { codigoMonedaViewOptions, getSimboloMoneda } from '../types';

const { THead, TBody, Tr, Th, Td } = Table;

interface TipoCambioHistorialProps {
  tiposCambio: TipoCambio[];
  loading: boolean;
  error: string | null;
  onFetchHistorial: (monedaDesde: CodigoMoneda, monedaHacia: CodigoMoneda, fechaDesde?: string, fechaHasta?: string) => Promise<TipoCambio[]>;
}

const TipoCambioHistorial: React.FC<TipoCambioHistorialProps> = ({
  tiposCambio,
  loading,
  error,
  onFetchHistorial
}) => {
  const [monedaDesde, setMonedaDesde] = useState<CodigoMoneda | ''>('');
  const [monedaHacia, setMonedaHacia] = useState<CodigoMoneda | ''>('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!monedaDesde || !monedaHacia) return;
    
    try {
      setSearching(true);
      await onFetchHistorial(
        monedaDesde as CodigoMoneda, 
        monedaHacia as CodigoMoneda, 
        fechaDesde || undefined, 
        fechaHasta || undefined
      );
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setMonedaDesde('');
    setMonedaHacia('');
    setFechaDesde('');
    setFechaHasta('');
  };

  // Filtrar opciones de moneda destino para evitar la misma moneda
  const monedaHaciaOptions = codigoMonedaViewOptions.filter(
    option => option.value !== monedaDesde
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <HiOutlineCalendar className="w-5 h-5 mr-2" />
              Historial de Tipos de Cambio
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Consulte el historial de tipos de cambio entre monedas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
          >
            {/* Moneda Origen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Moneda Origen
              </label>
              <Select
                options={[{ value: '', label: 'Seleccionar...' }, ...codigoMonedaViewOptions]}
                value={codigoMonedaViewOptions.find(option => option.value === monedaDesde) || { value: '', label: 'Seleccionar...' }}
                onChange={(option) => setMonedaDesde(option?.value as CodigoMoneda || '')}
                isDisabled={searching}
              />
            </div>

            {/* Moneda Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Moneda Destino
              </label>
              <Select
                options={[{ value: '', label: 'Seleccionar...' }, ...monedaHaciaOptions]}
                value={monedaHaciaOptions.find(option => option.value === monedaHacia) || { value: '', label: 'Seleccionar...' }}
                onChange={(option) => setMonedaHacia(option?.value as CodigoMoneda || '')}
                isDisabled={searching || !monedaDesde}
              />
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                disabled={searching}
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                disabled={searching}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex space-x-4"
          >
            <Button
              onClick={handleSearch}
              loading={searching}
              disabled={searching || !monedaDesde || !monedaHacia}
              icon={<HiOutlineSearch />}
              variant="solid"
            >
              Buscar Historial
            </Button>
            <Button
              onClick={handleClear}
              disabled={searching}
              variant="plain"
            >
              Limpiar
            </Button>
          </motion.div>
        </div>
      </Card>

      {/* Tabla de Resultados */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <Card className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </Card>
      )}

      {!loading && !error && tiposCambio.length === 0 && (monedaDesde && monedaHacia) && (
        <Card className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No se encontraron tipos de cambio para las monedas seleccionadas</p>
          </div>
        </Card>
      )}

      {!loading && !error && tiposCambio.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden">
            <Table>
              <THead>
                <Tr>
                  <Th>Fecha</Th>
                  <Th>De</Th>
                  <Th>A</Th>
                  <Th>Valor</Th>
                  <Th>Última Actualización</Th>
                </Tr>
              </THead>
              <TBody>
                {tiposCambio.map((tipoCambio, index) => (
                  <Tr key={`${tipoCambio.monedaDesdeId}-${tipoCambio.monedaHaciaId}-${tipoCambio.fecha}`}>
                    <Td>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {new Date(tipoCambio.fecha).toLocaleDateString()}
                        </span>
                      </motion.div>
                    </Td>
                    <Td>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                      >
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {tipoCambio.monedaDesde?.codigo} {getSimboloMoneda(tipoCambio.monedaDesde?.codigo || '')}
                        </Badge>
                      </motion.div>
                    </Td>
                    <Td>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                      >
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {tipoCambio.monedaHacia?.codigo} {getSimboloMoneda(tipoCambio.monedaHacia?.codigo || '')}
                        </Badge>
                      </motion.div>
                    </Td>
                    <Td>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.3, duration: 0.3 }}
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                      >
                        {parseFloat(tipoCambio.valor.toString()).toFixed(4)}
                      </motion.div>
                    </Td>
                    <Td>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.4, duration: 0.3 }}
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        {new Date(tipoCambio.createdAt).toLocaleString()}
                      </motion.div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TipoCambioHistorial;
