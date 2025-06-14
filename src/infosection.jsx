import React from 'react';
import { Info, Link, Download, AlertTriangle, HelpCircle, Share2 } from 'lucide-react';

const InfoSection = () => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 mb-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            What is Terabox?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Terabox is a cloud storage platform that allows users to store, share, and download files like videos, images, and documents securely. It offers free and premium plans with generous storage, making it ideal for managing large files.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <Link className="w-6 h-6 text-blue-600" />
            Terabox URLs That We Support
          </h2>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 text-sm">
            <li>Standard Terabox sharing links (e.g., https://www.terabox.com/sharing/link/xxx)</li>
            <li>App-generated short URLs (e.g., https://terabox.app/s/xxxxx)</li>
            <li>Direct download links for public files</li>
            <li>Private links with access codes (authentication required)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <Download className="w-6 h-6 text-blue-600" />
            How to Download Videos and Files from Terabox URL?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Follow these steps to download files using our Terabox Link Converter:
          </p>
          <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 text-sm mt-2">
            <li>Copy the Terabox share link from the app or website.</li>
            <li>Paste the link into the input box above.</li>
            <li>Click "Get Download Link" to process the link.</li>
            <li>Use the "Direct Download" or "Watch Online" options to access your file.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            Disclaimer
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            This service is not affiliated with Terabox. Our tool is designed to facilitate downloading files by converting Terabox URLs. Ensure you have permission to download and use files in accordance with Terabox's terms of service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            FAQ
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Is the Terabox Link Converter free?</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Yes, our tool is completely free to use for downloading and streaming Terabox files.</p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Do I need a Terabox account?</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                No account is required for public links. Private links may require authentication via Terabox.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Why can't I preview some videos?</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Some videos may not support direct preview due to format or restrictions. Use "Watch Online" or "Direct Download" instead.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-blue-600" />
            Share It
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://x.com/intent/tweet?text=Check%20out%20this%20awesome%20TeraBox%20Downloader!&url=https://yourwebsite.com"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.99 5h1.52l-3.31 4.2a8.57 8.57 0 0 0 4.67 3.3c.62.26-.14.9-1.1 2.3-.2.3-.4.6-.61 2.2a9.53 9.53 0 0 1-2.41 0 13.47 13.47 0 0 0-10-7.2 1.25 1.25 0 0 1-.2.2.65.65 0 0 0 .9-.2 8.2 8.2 0 0 0 2.3-2.5A.42.42 0 0 1 9 5h3.5V4c0-.22 0-.37.06-.5h-.06v1Z"/>
              </svg>
              Twitter/X
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/shareArticle?mini=true&url=https://yourwebsite.com"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.024-3.037-1.85-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.048c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.914-2.063-2.042 0-1.127.919-2.042 2.063-2.042s2.063.914 2.063 2.042c0 1.127-.919 2.042-2.063 2.042zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;