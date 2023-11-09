import "./tailwind.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

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
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${poppins.variable} font-poppins flex min-h-screen flex-col items-center justify-between dark:bg-neutral-900`}
      >
        {children}
      </body>
    </html>
  );
}
