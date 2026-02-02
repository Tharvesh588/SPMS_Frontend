
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });


export const metadata: Metadata = {
  metadataBase: new URL('https://spms.egspgroup.in'),
  title: {
    default: 'ProjectVerse - Student Project Management System | SPMS by TM Nexus',
    template: '%s | ProjectVerse - SPMS'
  },
  description: 'ProjectVerse is a comprehensive Student Project Management System (SPMS) designed for engineering colleges to manage final year projects, problem statements, faculty assignments, and batch coordination. Developed by Tharvesh Muhaideen A (TM Nexus Tools).',
  applicationName: 'ProjectVerse SPMS',
  authors: [
    { name: 'Tharvesh Muhaideen A', url: 'https://imtharvesh.me' },
    { name: 'TM Nexus', url: 'https://imtharvesh.me' },
    { name: 'TM Nexus Tools', url: 'https://imtharvesh.me' }
  ],
  creator: 'Tharvesh Muhaideen A (TM Nexus)',
  publisher: 'TM Nexus Tools',
  keywords: [
    'ProjectVerse',
    'SPMS',
    'Student Project Management System',
    'Final Year Project Management',
    'Engineering Project Management',
    'College Project Management',
    'Problem Statement Management',
    'Faculty Project Assignment',
    'Batch Project Coordination',
    'Student Project Selection',
    'Academic Project Management',
    'Project Management Software',
    'Educational Project Tool',
    'EGSP Group',
    'EGS Pillay Engineering College',
    'Tharvesh Muhaideen A',
    'TM Nexus',
    'TM Nexus Tools',
    'Project Selection System',
    'Faculty Management System',
    'Student Management System',
    'Engineering College Software',
    'Academic Management Platform'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://spms.egspgroup.in',
    siteName: 'ProjectVerse - SPMS',
    title: 'ProjectVerse - Student Project Management System by TM Nexus',
    description: 'Comprehensive Student Project Management System for engineering colleges. Manage final year projects, problem statements, faculty coordination & student batch management.',
    images: [
      {
        url: 'https://spms.egspgroup.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProjectVerse - Student Project Management System',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProjectVerse - Student Project Management System',
    description: 'Manage final year projects, problem statements & faculty assignments with ProjectVerse SPMS by TM Nexus Tools',
    creator: '@tharvesh_Muhaideen',
    images: ['https://spms.egspgroup.in/og-image.png'],
  },
  alternates: {
    canonical: 'https://spms.egspgroup.in',
  },
  category: 'Education Technology',
  classification: 'Education Management System',
  icons: {
    icon: 'https://egspec.org/favicons/favicon.ico',
    apple: 'https://egspec.org/favicons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ProjectVerse',
    'theme-color': '#ffffff',
  }
};

// Forcing a HMR refresh to fix a development server issue.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ProjectVerse - Student Project Management System',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    url: 'https://spms.egspgroup.in',
    description: 'Comprehensive Student Project Management System for engineering colleges to manage final year projects, problem statements, and faculty coordination.',
    author: {
      '@type': 'Person',
      name: 'Tharvesh Muhaideen A',
      url: 'https://imtharvesh.me',
      sameAs: [
        'https://github.com/Tharvesh588',
        'https://linkedin.com/in/tharvesh-muhaideen'
      ]
    },
    creator: {
      '@type': 'Organization',
      name: 'TM Nexus Tools',
      url: 'https://imtharvesh.me',
      founder: {
        '@type': 'Person',
        name: 'Tharvesh Muhaideen A'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'EGSP Group',
      url: 'https://egspgroup.in'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150'
    }
  };

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
