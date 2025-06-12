import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudDownload, Moon, Sun, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const active = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
      setCurrentTheme(active);
    };

    updateTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-10 backdrop-blur-sm transition-all duration-200 ${
        scrolled ? 'bg-white/80 dark:bg-zinc-900/80 border-b shadow-sm' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <motion.div
          className="flex items-center gap-2 border border-muted p-3 rounded-xl shadow-sm bg-muted/30 dark:bg-muted/40 backdrop-blur"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CloudDownload className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">Terabox Downloader</span>
        </motion.div>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 border border-muted p-3 rounded-xl shadow-sm bg-muted/30 dark:bg-muted/40 backdrop-blur">
          {/* Theme toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              aria-label={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-12 w-12 flex items-center justify-center"
            >
              {currentTheme === 'dark' ? (
                <Sun className="h-6 w-6 text-foreground" />
              ) : (
                <Moon className="h-6 w-6 text-foreground" />
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
                  aria-label="Information"
                  className="h-12 w-12 flex items-center justify-center"
                >
                  <Info className="h-6 w-6 text-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2 text-sm">
                  <p>
                    This website generates fast download links. For best speed, use a download manager like FDM or aria2c.
                  </p>
                  <p>
                    Please wait 1–2 minutes depending on your network speed and file size.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>

          {/* Hamburger Menu Popover */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Menu"
                  className="h-12 w-12 flex items-center justify-center"
                >
                  <Menu className="h-6 w-6 text-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://t.me/iamak_roy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline block"
                    >
                      💬 Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://t.me/scripthub0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline block"
                    >
                      📧 Support
                    </a>
                  </li>
                  <li>
                    <span className="text-muted-foreground">❓ FAQs coming soon</span>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
