import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Theme } from "@radix-ui/themes";
import { Poppins } from "next/font/google";
import { ToastProvider } from "@/utils/toast-provider";
import { getAuthCookies } from "@/utils/cookies";

export async function generateMetadata(): Promise<Metadata> {
  const authCookies = await getAuthCookies();

  if (!authCookies?.user || !authCookies?.accessToken) {
    return {
      title: "Restaurant",
      description:
        "A modern restaurant web platform for managing orders, menus, customers, and daily operations with ease.",
    };
  }

  return {
    title:
      authCookies?.user?.fullName ||
      authCookies?.user?.username ||
      "Restaurant",
    description:
      "A modern restaurant web platform for managing orders, menus, customers, and daily operations with ease.",
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
  const authCookies = await getAuthCookies();
  const accessToken = authCookies?.accessToken;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
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
          <Theme>{children}</Theme>
        </ToastProvider>
      </body>
    </html>
  );
}
