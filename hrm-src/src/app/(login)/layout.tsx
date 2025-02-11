import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tỷ xuân HRM",
  description: "Used print card employee and recruitment for Ty Xuan company.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
