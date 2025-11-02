import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electrocom ERP Console",
  description: "Admin panel for Electrocom ERP system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
