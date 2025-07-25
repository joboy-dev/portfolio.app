import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Joboy-Dev Portfolio",
  description: "Portfolio for Adegbehingbe Oluwakorede Joseph",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <html lang="en">
        <body className="bg-background">
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
