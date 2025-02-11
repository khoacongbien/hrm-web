import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AppProvider from "@/app/appProvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: "Tỷ xuân HRM",
  description: "Used print card employee and recruitment for Ty Xuan company.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("sessionToken");
  return (
    <html lang="vi">
      <body
        className={`${inter.className} overflow-hidden flex flex-col min-w-0 min-h-screen`}
      >
        <AppProvider inititalSessionToken={sessionToken?.value || ""}>
          {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
