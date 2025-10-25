/**
 * Utilidades para manejo de valores monetarios
 * 
 * Este módulo centraliza todas las operaciones con dinero para garantizar
 * precisión y consistencia en cálculos financieros.
 */

/**
 * Redondea un valor monetario a N decimales
 * 
 * Usa redondeo estándar (half-up) para operaciones monetarias.
 * Por defecto redondea a 2 decimales (centavos).
 * 
 * @param value - Valor numérico a redondear
 * @param decimals - Cantidad de decimales (default: 2)
 * @returns Valor redondeado
 * 
 * @example
 * roundCurrency(10.556) // 10.56
 * roundCurrency(10.554) // 10.55
 * roundCurrency(133.333, 2) // 133.33
 */
export function roundCurrency(value: number, decimals: number = 2): number {
  // Validar entrada
  if (!Number.isFinite(value)) {
    console.warn(`roundCurrency: valor no finito recibido (${value}), retornando 0`);
    return 0;
  }
  
  if (value === 0) return 0;
  
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Suma múltiples valores monetarios con redondeo final
 * 
 * Suma todos los valores y redondea el resultado a 2 decimales.
 * Ignora valores no válidos (null, undefined, NaN).
 * 
 * @param values - Array de valores numéricos
 * @returns Suma total redondeada
 * 
 * @example
 * sumCurrency([10.555, 20.444, 5.001]) // 36.00
 * sumCurrency([100, null, 50]) // 150.00
 */
export function sumCurrency(values: (number | null | undefined)[]): number {
  const total = values.reduce((sum, val) => {
    const num = Number(val);
    return sum + (Number.isFinite(num) ? num : 0);
  }, 0);
  
  return roundCurrency(total, 2);
}

/**
 * Calcula un porcentaje sobre un valor base y redondea
 * 
 * Útil para calcular impuestos, comisiones, descuentos, etc.
 * 
 * @param base - Valor base sobre el que se calcula el porcentaje
 * @param percentage - Porcentaje a aplicar (ej: 21 para 21%)
 * @returns Monto calculado y redondeado
 * 
 * @example
 * applyPercentage(1000, 21) // 210.00 (IVA 21%)
 * applyPercentage(500, 2.45) // 12.25 (IIBB Misiones 2.45%)
 */
export function applyPercentage(base: number, percentage: number): number {
  if (!Number.isFinite(base) || !Number.isFinite(percentage)) {
    console.warn(`applyPercentage: valores no válidos (base: ${base}, percentage: ${percentage})`);
    return 0;
  }
  
  return roundCurrency((base * percentage) / 100, 2);
}

/**
 * Calcula el precio final aplicando un margen porcentual sobre un costo
 * 
 * Fórmula: precioFinal = costo * (1 + margen/100)
 * 
 * @param costo - Costo base del producto/servicio
 * @param margenPorcentaje - Margen de ganancia en porcentaje
 * @returns Precio final redondeado
 * 
 * @example
 * calcularPrecioConMargen(100, 30) // 130.00 (costo + 30% de margen)
 * calcularPrecioConMargen(85.50, 25) // 106.88
 */
export function calcularPrecioConMargen(costo: number, margenPorcentaje: number): number {
  if (!Number.isFinite(costo) || !Number.isFinite(margenPorcentaje)) {
    console.warn(`calcularPrecioConMargen: valores no válidos (costo: ${costo}, margen: ${margenPorcentaje})`);
    return 0;
  }
  
  if (costo < 0) {
    throw new Error('El costo no puede ser negativo');
  }
  
  if (margenPorcentaje < 0) {
    throw new Error('El margen no puede ser negativo');
  }
  
  return roundCurrency(costo * (1 + margenPorcentaje / 100), 2);
}

/**
 * Valida que un valor monetario sea válido
 * 
 * @param value - Valor a validar
 * @param allowZero - Si se permite valor cero (default: true)
 * @param allowNegative - Si se permiten valores negativos (default: false)
 * @returns true si el valor es válido
 */
export function isValidCurrencyValue(
  value: any,
  allowZero: boolean = true,
  allowNegative: boolean = false
): boolean {
  const num = Number(value);
  
  if (!Number.isFinite(num)) return false;
  if (!allowZero && num === 0) return false;
  if (!allowNegative && num < 0) return false;
  
  return true;
}

/**
 * Convierte un valor string o desconocido a número válido
 * 
 * Similar a Number() pero con validaciones adicionales y valor por defecto.
 * Lanza error si el valor no es convertible y no se proporciona default.
 * 
 * @param value - Valor a convertir
 * @param defaultValue - Valor por defecto si la conversión falla
 * @returns Número válido
 * 
 * @example
 * toNumber("123.45") // 123.45
 * toNumber("invalid", 0) // 0
 * toNumber(null) // Error
 */
export function toNumber(value: any, defaultValue?: number): number {
  const num = Number(value);
  
  if (Number.isFinite(num)) {
    return num;
  }
  
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  
  throw new Error(`No se puede convertir "${value}" a número`);
}

/**
 * Formatea un valor monetario para display
 * 
 * @param value - Valor a formatear
 * @param currency - Código de moneda (default: 'ARS')
 * @param locale - Locale para formato (default: 'es-AR')
 * @returns String formateado
 * 
 * @example
 * formatCurrency(1234.56, 'ARS') // "$1.234,56"
 * formatCurrency(1234.56, 'USD') // "US$1,234.56"
 */
export function formatCurrency(
  value: number,
  currency: string = 'ARS',
  locale: string = 'es-AR'
): string {
  if (!Number.isFinite(value)) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Compara dos valores monetarios con tolerancia para errores de precisión
 * 
 * Útil para validaciones de integridad donde pequeñas diferencias de redondeo
 * son aceptables.
 * 
 * @param a - Primer valor
 * @param b - Segundo valor
 * @param tolerance - Tolerancia permitida (default: 0.01 = 1 centavo)
 * @returns true si los valores son iguales dentro de la tolerancia
 * 
 * @example
 * currencyEquals(10.00, 10.001) // true (diferencia < 0.01)
 * currencyEquals(10.00, 10.02) // false (diferencia > 0.01)
 */
export function currencyEquals(a: number, b: number, tolerance: number = 0.01): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= tolerance;
}

