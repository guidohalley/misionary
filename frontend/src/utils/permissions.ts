import { User } from '@/@types/auth'

/**
 * Verifica si el usuario puede editar un producto/servicio
 */
export function canEditProductoServicio(
  user: User | null | undefined,
  proveedorId: number
): boolean {
  if (!user) return false
  
  // ADMIN puede editar cualquier producto/servicio
  if (user.authority?.includes('ADMIN') || user.roles?.includes('ADMIN')) {
    return true
  }
  
  // PROVEEDOR y CONTADOR solo pueden editar los suyos
  return user.id === proveedorId
}

/**
 * Verifica si el usuario puede eliminar un producto/servicio
 */
export function canDeleteProductoServicio(
  user: User | null | undefined,
  proveedorId: number
): boolean {
  // Misma lógica que editar
  return canEditProductoServicio(user, proveedorId)
}

/**
 * Verifica si el usuario puede ver los precios de un producto/servicio
 */
export function canViewPrecios(
  user: User | null | undefined,
  proveedorId: number
): boolean {
  if (!user) return false
  
  // ADMIN y CONTADOR pueden ver todos los precios
  if (
    user.authority?.includes('ADMIN') ||
    user.authority?.includes('CONTADOR') ||
    user.roles?.includes('ADMIN') ||
    user.roles?.includes('CONTADOR')
  ) {
    return true
  }
  
  // PROVEEDOR solo ve precios de sus propios productos
  return user.id === proveedorId
}

/**
 * Obtiene mensaje de tooltip cuando no puede editar
 */
export function getNoEditTooltip(user: User | null | undefined): string {
  if (!user) return 'Debes iniciar sesión'
  
  if (user.authority?.includes('ADMIN') || user.roles?.includes('ADMIN')) {
    return 'Puedes editar'
  }
  
  return 'Solo puedes editar tus propios productos/servicios'
}

/**
 * Obtiene mensaje de tooltip cuando no puede eliminar
 */
export function getNoDeleteTooltip(user: User | null | undefined): string {
  if (!user) return 'Debes iniciar sesión'
  
  if (user.authority?.includes('ADMIN') || user.roles?.includes('ADMIN')) {
    return 'Puedes eliminar'
  }
  
  return 'Solo puedes eliminar tus propios productos/servicios'
}

/**
 * Verifica si el usuario es ADMIN
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  return user.authority?.includes('ADMIN') || user.roles?.includes('ADMIN') || false
}

/**
 * Verifica si el usuario es CONTADOR
 */
export function isContador(user: User | null | undefined): boolean {
  if (!user) return false
  return user.authority?.includes('CONTADOR') || user.roles?.includes('CONTADOR') || false
}

/**
 * Verifica si el usuario es PROVEEDOR
 */
export function isProveedor(user: User | null | undefined): boolean {
  if (!user) return false
  return user.authority?.includes('PROVEEDOR') || user.roles?.includes('PROVEEDOR') || false
}

/**
 * Obtiene el mensaje de error específico del backend
 */
export function getErrorMessage(error: any): string {
  if (error?.response?.status === 403) {
    return error.response?.data?.error || 'No tienes permiso para esta acción'
  }
  
  if (error?.response?.status === 404) {
    return 'El recurso no fue encontrado'
  }
  
  if (error?.response?.status >= 500) {
    return 'Error del servidor. Intenta nuevamente'
  }
  
  return 'Error inesperado. Intenta nuevamente'
}
