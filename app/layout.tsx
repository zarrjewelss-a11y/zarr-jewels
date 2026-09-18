import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/components/context/WishlistContext";
import { CartProvider } from "@/components/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZARR JEWELS",
  description: "Luxury Jewelry Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2500,
                style: {
                  borderRadius: "12px",
                  background: "#111827",
                  color: "#fff",
                },
                success: {
                  iconTheme: {
                    primary: "#ec4899",
                    secondary: "#fff",
                  },
                },
              }}
            />

            {children}

          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}