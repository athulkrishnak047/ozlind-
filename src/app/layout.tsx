import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ozlind-design.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "Ozlind — Think clearly. Build boldly.", template: "%s · Ozlind" },
  description: "Ozlind is a thoughtful AI workspace for exploring ideas, solving problems, and building what matters.",
  metadataBase: new URL("https://ozlind-git-main-ozlind-enterprise.vercel.app"),
  openGraph: { title: "Ozlind — Think clearly. Build boldly.", description: "A clearer space to think, create, and move forward with AI.", siteName: "Ozlind", type: "website" },
  applicationName: "Ozlind",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "light dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider>{children}</ThemeProvider></body></html>;
}
