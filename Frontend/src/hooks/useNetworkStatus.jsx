import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";
import { Capacitor } from "@capacitor/core";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let listener;

    const init = async () => {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        setIsOnline(status.connected);

        listener = await Network.addListener(
          "networkStatusChange",
          (status) => {
            setIsOnline(status.connected);
          }
        );
      } else {
        setIsOnline(navigator.onLine);

        const online = () => setIsOnline(true);
        const offline = () => setIsOnline(false);

        window.addEventListener("online", online);
        window.addEventListener("offline", offline);

        return () => {
          window.removeEventListener("online", online);
          window.removeEventListener("offline", offline);
        };
      }
    };

    init();

    return () => {
      listener?.remove();
    };
  }, []);

  return isOnline;
};

export default useNetworkStatus;