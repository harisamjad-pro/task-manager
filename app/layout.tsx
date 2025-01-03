import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from '../components/Header';

const interFont = localFont({
  // src: "./fonts/InterRegular.ttf",
  variable: "--font-inter-sans",
  // weight: "400",
  src: [
    { path: "./fonts/InterThin.ttf", weight: "100" },
    { path: "./fonts/InterExtraLight.ttf", weight: "200" },
    { path: "./fonts/InterLight.ttf", weight: "300" },
    { path: "./fonts/InterRegular.ttf", weight: "400" },
    { path: "./fonts/InterMedium.ttf", weight: "500" },
    { path: "./fonts/InterSemiBold.ttf", weight: "600" },
    { path: "./fonts/InterBold.ttf", weight: "700" },
    { path: "./fonts/InterExtraBold.ttf", weight: "800" },
    { path: "./fonts/InterBlack.ttf", weight: "900" },
  ]
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased cursor-default`}>
        <Header />
        <main className="px-16 py-12 max-sm:py-6 mt-16 max-lg:px-12 max-md:px-8 max-sm:px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
