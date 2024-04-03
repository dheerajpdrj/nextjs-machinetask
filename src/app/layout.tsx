"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/redux/Providers";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex">
            <Sidebar expanded={expanded} toggleSidebar={toggleSidebar} />
            <div
              className={`${
                expanded ? "ml-52" : "ml-20"
              }  overflow-x-auto transition-all duration-300 flex-grow`}
            >
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
