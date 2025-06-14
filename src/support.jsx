import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from './components/header';
import Footer from './footer';

const Support = () => {
  useEffect(() => {
    window.location.href = 'https://t.me/downloadteraboxx';
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 flex items-center justify-center">
        {/* ... */}
      </main>
      <Footer />
    </div>
  );
};

export default Support;