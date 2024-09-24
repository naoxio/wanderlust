import type { Metadata } from "next";
import { StoreProvider } from "./StoreProvider";
import ThemeRegistry from './ThemeRegistry';
import "./globals.css";

export const metadata: Metadata = {
  title: "Traveltint",
  description: "Explore and color your world travels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}