import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Inter } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "../providers/ApolloProviderWrapper";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Manu from "./components/menu/Menu";
import { CartProvider } from "../context/cartContext";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cātaurant",
  description: "The Best Restaurant In Town!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="body">
        <ApolloProviderWrapper>
          <AppRouterCacheProvider>
            <CartProvider>
              <Navbar />
              <Manu />
              <div className="main">{children}</div>
              <Footer />
            </CartProvider>
          </AppRouterCacheProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
