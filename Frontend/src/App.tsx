import { useState, useRef } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import TeraboxForm from './components/TeraboxForm';
import FileDetails from './components/FileDetails';
import HistorySection from './components/HistorySection';
import { TeraboxFile } from './types/terabox';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdsBlockMessage from './components/ads.tsx';
import { Download, Clock } from 'lucide-react';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function App() {
  const [currentFile, setCurrentFile] = useState<TeraboxFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sessionCache = useRef<Record<string, TeraboxFile>>({});
  const { toast } = useToast();

  const handleFetchFile = async (link: string) => {
    if (sessionCache.current[link]) {
      setCurrentFile(sessionCache.current[link]);
      toast({
        title: 'Loaded from cache',
        description: 'Using cached file details for this session.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiBase = import.meta.env.MODE === 'development' ? '/api' : WORKER_URL;
      const response = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedAt = new Date().toISOString();
      const fileWithSource = { ...data, sourceLink: link, fetchedAt };

      setCurrentFile(fileWithSource);
      sessionCache.current[link] = fileWithSource;

      const history =
        JSON.parse(localStorage.getItem('terabox-history') || '[]') || [];

      const newHistory = [
        fileWithSource,
        ...history.filter(
          (item: TeraboxFile) => item.file_name !== data.file_name
        ),
      ].slice(0, 10);

      localStorage.setItem('terabox-history', JSON.stringify(newHistory));

      toast({
        title: 'Success!',
        description: 'File details successfully fetched.',
      });
    } catch (error) {
      console.error('Error fetching file:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to fetch file details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="terabox-theme">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-sans overflow-x-hidden">
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 py-6 md:py-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto space-y-10"
          >
            {/* Download Link Generator */}
            <section className="rounded-3xl border border-border bg-card backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.2)] p-8 md:p-10 transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-primary tracking-tight">
                <Download className="w-6 h-6" />
                TeraBox Link Extractor
              </h2>

              <TeraboxForm onSubmit={handleFetchFile} isLoading={isLoading} />

              <AnimatePresence mode="wait">
                {currentFile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="mt-6 rounded-xl bg-muted/40 p-6 border border-border"
                  >
                    <FileDetails file={currentFile} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Ads placeholder */}
            <div id="container-ads" className="text-center text-sm text-muted-foreground" />

            {/* Download History */}
            <section className="bg-muted/30 border border-border rounded-2xl p-6 md:p-8 shadow-inner transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                Recent Downloads
              </h2>
              <HistorySection onSelectFile={setCurrentFile} />
            </section>

            {/* Footer */}
            <footer className="text-center text-sm text-muted-foreground mt-10">
              Developed by <span className="font-semibold text-foreground">DARK LIFE 🧬</span> •{' '}
              <a
                href="https://t.me/scripthub0"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
               @2025 This website is not an official Terabox website and we are not associated with terabox.app or Flextech Inc..
              </a>
            </footer>
          </motion.div>
        </main>
        <Toaster />
      </div>
      <AdsBlockMessage />
    </ThemeProvider>
  );
}

export default App;
