import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={poppins.className}
          suppressHydrationWarning
        >
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {/* <SheetProvider /> */}
              <ToastProvider />
              <ModalProvider />
              {children}
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>

    </ClerkProvider>
  );
}
