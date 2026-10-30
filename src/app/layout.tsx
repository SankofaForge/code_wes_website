import type { Metadata, Viewport } from 'next';
import { Corner } from '@/components/Corner';
import { Motion } from '@/components/Motion';
import { site } from '@/data/site';
import { hanken, spaceMono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.name, images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#0d1117', colorScheme: 'dark' };

// Runs before first paint: hidden-until-revealed styles only apply when JS and motion are on.
const flags = `document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/cardinal.webp`,
  sameAs: site.links.map((l) => l.href),
  parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Wesleyan University' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${hanken.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div id="curtain" aria-hidden="true">
          <div className="curtain__panel">
            {Array.from({ length: 10 }, (_, i) => <span key={i} className="curtain__band" />)}
          </div>
          <div className="curtain__ref"><span>git checkout</span> <span data-curtain-ref /></div>
        </div>
        <Corner />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main id="main" tabIndex={-1}>{children}</main>
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <Motion />
      </body>
    </html>
  );
}
