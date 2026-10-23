// El proveedor debe confirmar una entrega antes de cambiar Notification.status a ENVIADA.
// No se registra una implementacion hasta configurar Expo/FCM/APNs; nunca simular entregas.
export const PUSH_NOTIFICATION_GATEWAY = 'PUSH_NOTIFICATION_GATEWAY';
export interface PushNotificationGateway {
  send(input: {
    notificationId: number;
    deviceToken: string;
    title: string;
    body: string;
    data: Record<string, string>;
  }): Promise<{ providerMessageId: string }>;
}
