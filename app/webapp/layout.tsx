import type { Metadata } from "next";
import Navbar from "./components/navbar/navbar";

export const metadata: Metadata = {
  title: "Space Pirates",
  description: "Space Pirates official website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
