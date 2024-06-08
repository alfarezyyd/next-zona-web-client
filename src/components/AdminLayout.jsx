"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Layout } from "@/components/Layout/layout";


export function AdminLayout({ children, themeProps }) {
  return (
    <NextUIProvider>
      <NextThemesProvider defaultTheme="system" attribute="class" {...themeProps}>
        <Layout>
          {children}
        </Layout>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
