import './globals.css';
import { Suspense } from 'react';
import { SavedProvider } from '../context/SavedContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Hide Rajasthan · Royal Edition | Uncrowded Citadels & Sacred Baoris',
  description: 'The authentic photographic archive of Rajasthan’s legendary royal citadels, subterranean stepwells, and vanishing desert folklore.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
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
