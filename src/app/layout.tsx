import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.title}`, template: `%s · ${site.name}` },
  description: 'Market Research Analyst focused on consumer insights, customer experience, NPS and research analytics. Open to roles in Dubai and across the UAE.',
  keywords: ['Market Research Analyst', 'Research Analyst', 'Consumer Insights', 'Customer Experience', 'NPS', 'Mystery Shopping', 'Dubai', 'UAE', 'Rohith Mohan'],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    title: `${site.name} · ${site.title}`,
    description: 'Consumer insights, customer experience, NPS and research analytics case studies.',
    url: site.url,
    siteName: `${site.name} · Research portfolio`
  },
  twitter: { card: 'summary', title: `${site.name} · ${site.title}` },
  robots: { index: true, follow: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg` }
};

export const viewport: Viewport = { themeColor: '#0c1d2e', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800&display=swap" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Person', name: site.name, jobTitle: site.title,
          url: site.url, sameAs: [site.linkedin, site.github]
        }) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
