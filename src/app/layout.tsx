import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
});

export const metadata: Metadata = {
  title: "Computer Science Quiz App",
  description: "Test your computer science knowledge",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/icon.png"]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
