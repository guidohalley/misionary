import { toast, Notification } from '@/components/ui';

// Hook para manejo de notificaciones - Siguiendo patrón simplificado
export const useNotifications = () => {
  
  const showSuccess = (message: string, title: string = 'Éxito') => {
    toast.push(
      <Notification title={title} type="success">
        {message}
      </Notification>
    );
  };

  const showError = (message: string, title: string = 'Error') => {
    toast.push(
      <Notification title={title} type="danger">
        {message}
      </Notification>
    );
  };

  const showWarning = (message: string, title: string = 'Advertencia') => {
    toast.push(
      <Notification title={title} type="warning">
        {message}
      </Notification>
    );
  };

  const showInfo = (message: string, title: string = 'Información') => {
    toast.push(
      <Notification title={title} type="info">
        {message}
      </Notification>
    );
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
