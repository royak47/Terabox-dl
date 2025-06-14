import React from 'react';
import { Mail, MessageSquare, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex justify-center items-center gap-6">
          <a
            href="https://t.me/iamak_roy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
            aria-label="Telegram"
          >
            <MessageSquare className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" />
          </a>
          <a
            href="https://x.com/iamak_roy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
            aria-label="X"
          >
            <Twitter className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" />
          </a>
          <a
            href="mailto:nopaidorganization@gmail.com"
            className="transition-transform hover:scale-105"
            aria-label="Gmail"
          >
            <Mail className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" />
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 text-black dark:text-white text-sm">
          <span>Dark Life</span>
          <div>© 2025 All rights reserved</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;