"use client";

import { useRouter } from "next/navigation";

import { useNavigationLoader } from "@/components/layout";

export const useNavigation = () => {
  const router = useRouter();
  const { startNavigation } = useNavigationLoader();

  const push = (href: string) => {
    startNavigation();
    router.push(href);
  };

  const replace = (href: string) => {
    startNavigation();
    router.replace(href);
  };

  const back = () => {
    startNavigation();
    router.back();
  };

  const forward = () => {
    startNavigation();
    router.forward();
  };

  return {
    ...router,
    push,
    replace,
    back,
    forward,
  };
};
