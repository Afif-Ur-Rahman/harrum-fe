import { useSocketContext } from "./socket-provider";

export const useNotificationEvents = () => {
  const { socket, emit, on } = useSocketContext();

  const safeEmit = (event: string, data?: unknown) => {
    if (socket?.connected) {
      try {
        emit(event, data);
      } catch (error) {
        console.warn(`Failed to emit ${event}:`, error);
      }
    }
  };

  const safeOn = (event: string, callback: (...args: unknown[]) => void) => {
    on(event, callback);
  };

  const sendNotification = (payload: { title: string; message: string }) => {
    safeEmit("notification:send", payload);
  };

  const onNotificationReceived = (callback: (payload: unknown) => void) => {
    safeOn("notification:receive", callback);
  };

  return {
    socket,
    sendNotification,
    onNotificationReceived,
  };
};

export default useNotificationEvents;
