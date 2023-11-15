import "./tailwind.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "./components/footer";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

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
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins flex min-h-screen flex-col items-center justify-between bg-base-100 overflow-x-hidden w-[100vw]`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
