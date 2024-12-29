import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans} from "next/font/google";
import { ThemeProvider } from "./providers/theme-provider";

// const font= DM_Sans({
//   subsets: ["latin"],
//   weight: "200"
// });

export const metadata: Metadata = {
  title: "BuildBoard",
  description: "Your platform to manage construction projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
