import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TeraboxFormProps {
  onSubmit: (link: string) => Promise<void>;
  isLoading: boolean;
}

export default function TeraboxForm({ onSubmit, isLoading }: TeraboxFormProps) {
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md shadow-xl">
        <CardHeader className="bg-white/5 border-b border-white/10 rounded-t-2xl pb-4">
          <CardTitle className="text-xl md:text-2xl font-bold text-white">
            TeraBox Link Downloader
          </CardTitle>
          <CardDescription className="text-sm text-white/60">
            Paste a valid TeraBox link to generate download options instantly.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="https://terabox.app/sharing/link?surl=..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={isLoading}
                  className="bg-black/40 text-white border border-white/10 placeholder-white/40 pr-10 focus:ring-primary rounded-xl"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !link.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-700 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <>
                    <motion.span
                      initial={{ opacity: 1 }}
                      whileHover={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group-hover:opacity-0 transition-opacity"
                    >
                      Fetch File
                    </motion.span>
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isLoading ? 'Fetching...' : 'Ready!'}
                    </motion.span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
