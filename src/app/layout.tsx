import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { DevLogger } from "@/components/dev-logger";
import { NavigationLoaderProvider } from "@/components/layout";
import { MODE } from "@/constants";
import { ServiceWorkerRegister } from "@/lib/sw-register";
import { getAuthCookies } from "@/utils/cookies";
import { ToastProvider } from "@/utils/toast-provider";

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata(): Promise<Metadata> {
  const authCookies = await getAuthCookies();
  const token = authCookies?.accessToken;
  const user = authCookies?.user;

  return {
    title: `${!user || !token ? "" : `${user.username} - `}Harrum Cloth House`,
    description:
      "A modern clothing store web platform for managing products, customers, orders, and daily operations with ease.",
    manifest: "/manifest.webmanifest",
  };
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${poppins.variable} antialiased`} suppressHydrationWarning>
        <ServiceWorkerRegister />
        <ToastProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 5000,
              error: {
                style: {
                  wordBreak: "break-word",
                },
              },
            }}
          />

          <NavigationLoaderProvider>
            <Theme appearance="dark" accentColor="cyan" grayColor="slate">
              {children}
            </Theme>
          </NavigationLoaderProvider>
        </ToastProvider>

        {MODE === "dev" && <DevLogger />}
      </body>
    </html>
  );
}
