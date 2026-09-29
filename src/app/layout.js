import './globals.css';
import { Suspense } from 'react';
import { SavedProvider } from '../context/SavedContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Hide India | Uncrowded Citadels & Sacred Baoris',
  description: 'The authentic photographic archive of India’s legendary citadels, subterranean stepwells, and vanishing heritage folklore.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Quicksand:wght@400;500;600;700&family=Raleway:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/lemon-tuesday" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0A0B0E] text-white flex flex-col justify-between selection:bg-[#E03E3E] selection:text-white font-sans font-light">
        <SavedProvider>
          <Suspense fallback={<div className="h-16" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow">{children}</main>
          <Footer />
        </SavedProvider>
      </body>
    </html>
  );
}
