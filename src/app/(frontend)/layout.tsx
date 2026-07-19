import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "JKOSI | Jammu & Kashmir Open Source Initiative",
  description: "Accelerating regional digital transformation by fostering a collaborative ecosystem for Kashmiri developers, students, and innovators.",
  icons: [{ rel: "icon", url: "/logo.webp" }, { rel: "apple-touch-icon", url: "/logo.webp" }],
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} scroll-smooth`} suppressHydrationWarning={true}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <Script
          id="theme-loader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('jkosi-theme') || 'theme-spruce';
                document.documentElement.className = document.documentElement.className.replace(/\\btheme-\\w+\\b/g, '') + ' ' + theme;
              })();
            `
          }}
        />
      </head>
      <body className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-primary min-h-screen flex flex-col" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
