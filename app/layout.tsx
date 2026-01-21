import "./globals.css";
import { Inter, Fraunces,DM_Sans} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight:["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500","600"],
  variable: "--font-dm",
  display:"swap"
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${dmSans.variable} antialiased`}>
      <body
        className="min-h-dvh"
      >
        {children}
      </body>
    </html>
  );
}
