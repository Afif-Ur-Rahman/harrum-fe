"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { HarrumIconLoader } from "../harrum-icon-loader";

interface NavigationLoaderContextType {
  startNavigation: () => void;
  stopNavigation: () => void;
  isNavigating: boolean;
}

const NavigationLoaderContext =
  createContext<NavigationLoaderContextType | null>(null);

export const NavigationLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const [isNavigating, setIsNavigating] = useState(false);

  const navigationPathRef = useRef<string | null>(null);

  const startNavigation = useCallback(() => {
    navigationPathRef.current = pathname;
    setIsNavigating(true);
  }, [pathname]);

  const stopNavigation = useCallback(() => {
    navigationPathRef.current = null;
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    if (
      isNavigating &&
      navigationPathRef.current !== null &&
      pathname !== navigationPathRef.current
    ) {
      navigationPathRef.current = null;
      setIsNavigating(false);
    }
  }, [pathname, isNavigating]);

  useEffect(() => {
    const handlePopState = () => {
      navigationPathRef.current = pathname;
      setIsNavigating(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  return (
    <NavigationLoaderContext.Provider
      value={{
        startNavigation,
        stopNavigation,
        isNavigating,
      }}
    >
      {children}

      {isNavigating && <HarrumIconLoader />}
    </NavigationLoaderContext.Provider>
  );
};

export const useNavigationLoader = () => {
  const context = useContext(NavigationLoaderContext);

  if (!context) {
    throw new Error(
      "useNavigationLoader must be used inside NavigationLoaderProvider",
    );
  }

  return context;
};
