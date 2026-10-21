import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  title: "دعوتي | Daawati - دعوات زفاف إلكترونية تفاعلية فاخرة",
  description: "منصة دعوات الزفاف الإلكترونية الفاخرة، ثيمات تفاعلية ثلاثية الأبعاد، بطاقات مخصصة للضيوف، وتأكيد الحضور الذكي.",
  icons: {
    icon: "/assets/branding/daawati-logo.jpg",
    apple: "/assets/branding/daawati-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
      </head>
      <body className="bg-[#FAF7F2] text-[#38260F] antialiased selection:bg-[#EBDCC0] selection:text-[#38260F]">
        {children}
      </body>
    </html>
  );
}
