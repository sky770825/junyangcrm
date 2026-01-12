import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from '@/app/components/SessionProvider'

export const metadata: Metadata = {
  title: "常順地產CRM系統",
  description: "常順地產客戶關係管理與活動追蹤系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
