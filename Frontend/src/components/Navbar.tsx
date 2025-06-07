import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Moon, Sun, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export default function Navbar() {
  const { theme, setTheme } = useTheme() || { theme: 'light', setTheme: () => {} };
  const systemPrefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-10 backdrop-blur-sm transition-all duration-200 ${
        scrolled ? 'bg-background/80 border-b shadow-sm' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Database className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">Terabox Downloader</span>
        </motion.div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
              aria-label={
                currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
              }
              className="h-12 w-12 flex items-center justify-center"
            >
              {currentTheme === 'light' ? (
                <Moon className="w-8 h-8 text-foreground" />
              ) : (
                <Sun className="w-8 h-8 text-foreground" />
              )}
            </Button>
          </motion.div>

          {/* Info Popover */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Information about downloads"
                  className="h-12 w-12 flex items-center justify-center"
                >
                  <Info className="w-6 h-6 text-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2 text-sm">
                  <p>
                    This site creates fast download links. Use a manager like <b>FDM</b> or <b>aria2c</b> to boost speed by 3–4x.
                  </p>
                  <p>
                    Please be patient—files may take 1–2 minutes to load depending on your connection.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
