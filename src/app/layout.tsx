import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Ozlind — Think clearly. Build boldly.", template: "%s · Ozlind" },
  description: "A thoughtful AI workspace for exploring ideas, solving problems, and building what matters.",
  applicationName: "Ozlind",
  robots: { index: false, follow: false }
};

export const viewport: Viewport = {
  themeColor: "#080b14",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
