import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui';

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  currencySymbol?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  currency = 'ARS',
  currencySymbol = '$',
  placeholder = '0,00',
  disabled = false,
  min = 0,
  max,
  className
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Formatear número a moneda local
  const formatCurrency = (num: number): string => {
    const numericValue = typeof num === 'number' ? num : 0;
    if (numericValue === 0 && !isFocused) return '';
    
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  // Parsear string a número
  const parseNumber = (str: string): number => {
    // Remover separadores de miles y reemplazar coma decimal por punto
    const cleanStr = str
      .replace(/\./g, '') // Remover puntos (separadores de miles)
      .replace(',', '.'); // Reemplazar coma por punto para decimales
    
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Actualizar display value cuando cambia el valor prop
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permitir solo números, comas y puntos
    const sanitized = inputValue.replace(/[^0-9.,]/g, '');
    
    setDisplayValue(sanitized);
    
    // Convertir a número y llamar onChange
    const numericValue = parseNumber(sanitized);
    
    // Validar límites
    if (min !== undefined && numericValue < min) return;
    if (max !== undefined && numericValue > max) return;
    
    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // En focus, mostrar el valor numérico sin formato para facilitar edición
    const numericValue = typeof value === 'number' ? value : 0;
    if (numericValue === 0) {
      setDisplayValue('');
    } else {
      // Mostrar con coma decimal para edición
      setDisplayValue(numericValue.toFixed(2).replace('.', ','));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Al perder focus, volver al formato con separadores de miles
    const numericValue = typeof value === 'number' ? value : 0;
    setDisplayValue(formatCurrency(numericValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir teclas de navegación y control
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    if (allowedKeys.includes(e.key)) return;
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey) return;
    
    // Permitir números
    if (/^\d$/.test(e.key)) return;
    
    // Permitir coma y punto para decimales (solo uno)
    if ((e.key === ',' || e.key === '.') && !displayValue.includes(',') && !displayValue.includes('.')) {
      return;
    }
    
    // Prevenir cualquier otra tecla
    e.preventDefault();
  };

  return (
    <div className={`relative ${className || ''}`}>
      {/* Prefijo con símbolo de moneda */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none z-10">
        {currencySymbol}
      </div>
      
      {/* Input principal */}
      <Input
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={`${currencySymbol} ${placeholder}`}
        disabled={disabled}
        className="pl-8 pr-16 text-right"
      />
      
      {/* Sufijo con código de moneda */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none text-sm">
        {currency}
      </div>
    </div>
  );
};

export default MoneyInput;
