import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["300", "400", "600", "700", "900"] });

export const metadata: Metadata = {
    title: {
        template: '%s | تذكرتي | Tazkarti',
        default: 'تذكرتي | Tazkarti',
    },
    description: "اكتشف وحجز أفضل تذاكر المباريات والمنتجات الرياضية الحصرية بأسعار تنافسية. تذكرتي هي رفيقك الأول في عالم الرياضة.",
    manifest: "/manifest.json",
    icons: {
        icon: "/assets/images/top.svg",
        apple: "/assets/images/top.svg",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "تذكرتي | Tazkarti",
    },
};

export const viewport: Viewport = {
    themeColor: "#0f172a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" className="scroll-smooth">
            <body className={cairo.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
