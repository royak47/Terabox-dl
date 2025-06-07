import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, FileAudio, FileBadge } from 'lucide-react';
import { TeraboxFile } from '@/types/terabox';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { getMimeType } from '@/lib/getMimeType';
import { VideoPlayer } from './VideoPlayer'; // ✅ Import custom video player

interface FilePreviewProps {
  file: TeraboxFile;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  const fileExtension = file.file_name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.mime_type || getMimeType(file.file_name);

  const isVideo = ['mp4', 'webm', 'mov'].includes(fileExtension);
  const isAudio = ['mp3', 'wav', 'ogg'].includes(fileExtension);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
  const isPdf = fileExtension === 'pdf';
  const canPreview = isVideo || isAudio || isImage || isPdf;

  useEffect(() => {
    setLoading(true);
    setPreviewError(false);
  }, [file]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setPreviewError(true);
  };

  return (
    <div className="preview-container">
      {canPreview ? (
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="bg-muted/30">
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-muted/20"
                >
                  <Skeleton className="w-full h-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {!previewError ? (
              <>
                {isVideo && (
                  <VideoPlayer
                    src={file.proxy_url}
                    poster={file.thumbnail}
                  />
                )}

                {isAudio && (
                  <div className="w-full h-full flex items-center justify-center bg-muted/20 p-4">
                    <div className="w-full max-w-md">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-card rounded-lg p-6"
                      >
                        <FileAudio className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <audio
                          src={file.proxy_url}
                          controls
                          className="w-full"
                          onLoadedData={handleLoad}
                          onError={handleError}
                        />
                      </motion.div>
                    </div>
                  </div>
                )}

                {isImage && (
                  <img
                    src={file.proxy_url}
                    alt={file.file_name}
                    className="w-full h-full object-contain"
                    onLoad={handleLoad}
                    onError={handleError}
                  />
                )}

                {isPdf && (
                  <iframe
                    src={file.proxy_url}
                    title="PDF Preview"
                    className="w-full h-full border-0"
                    onLoad={handleLoad}
                    onError={handleError}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FileBadge className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">Preview unavailable</p>
              </div>
            )}
          </AspectRatio>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 bg-muted/10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex flex-col items-center"
          >
            {fileExtension === 'zip' || fileExtension === 'rar' ? (
              <File className="w-16 h-16 text-muted-foreground" />
            ) : fileExtension.match(/doc|docx|txt|pdf/) ? (
              <FileBadge className="w-16 h-16 text-muted-foreground" />
            ) : (
              <File className="w-16 h-16 text-muted-foreground" />
            )}
            <p className="text-muted-foreground mt-4 max-w-md text-center text-sm">
              Preview not available for {fileExtension.toUpperCase()} files. Use the download buttons below to access the file.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
