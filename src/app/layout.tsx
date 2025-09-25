
import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Searchbar from "./components/searchbar/Searchbar";
import Banner from "./components/banner/Banner";
import Menu from "./components/menu/Menu";
import React from "react";

const inter = Inter ({ subsets:["latin"]})

export const metadata: Metadata = {
  title: "Cātaurant",
  description: "Selling felines Products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
    <html lang="en">
      <body className="main">
        <AppRouterCacheProvider>
        <Navbar/>  
        <Banner />
        <Searchbar/>
        <Menu/>        
        {children}               
        <Footer/>  
      </AppRouterCacheProvider>      
      </body>
    </html>
  );
}
