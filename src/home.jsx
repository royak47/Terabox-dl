import { useState } from "react";
import { Download, FileText, Loader2, AlertCircle, CheckCircle, ExternalLink, Play, Eye, MonitorPlay } from "lucide-react";
import InfoSection from "./infosection";
import Header from "./components/Header";
import Footer from "./Footer";

const BACKEND_URL = "https://raspy-wave-5e61.sonukalakhari76.workers.dev";

interface FileDetails {
  file_name: string;
  file_size: string;
  download_link: string;
  proxy_url?: string;
  thumbnail?: string;
}

const Home: React.FC = () => {
  const [shareLink, setShareLink] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);

  const supportedDomains: string[] = [
    "terabox.com",
    "terabox.app",
    "teraboxapp.com",
    "terabox.fun",
    "1024tera.com",
    "4funbox.com",
    "4funbox.co",
    "mirrobox.com",
    "nephobox.com",
    "freeterabox.com",
    "momerybox.com",
    "tibibox.com",
  ];

  const normalizeUrl = (url: string): string =>
    url
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/+$/, "")
      .trim();

  const isValidLink = (url: string): boolean =>
    supportedDomains.some((domain) => normalizeUrl(url).includes(domain));

  const handleFetch = async (): Promise<void> => {
    if (!shareLink.trim()) {
      setErrorMessage("Please enter a share link.");
      return;
    }

    if (!isValidLink(shareLink)) {
      setErrorMessage("Please enter a valid share link (e.g., https://www.terabox.com/s/xxxxxx or https://www.mirrobox.com/s/xxxxxx).");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setFileDetails(null);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: shareLink.trim() }),
      });

      if (!response.ok) {
        setErrorMessage("Unable to fetch file. Please try again later.");
        return;
      }

      const data = await response.json();

      if (data.error || !data.file_name) {
        setErrorMessage(
          typeof data.error === "string" && !data.error.toLowerCase().includes("attempt")
            ? data.error
            : "Unable to fetch file. Please check the link and try again."
        );
      } else {
        setFileDetails(data);
      }
    } catch {
      setErrorMessage("Unable to fetch file. Please check the link or try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectDownload = async (url: string, filename: string): Promise<void> => {
    if (!url || !filename) {
      setErrorMessage("Invalid download link or filename. Try 'Fast Download'.");
      return;
    }

    try {
      const response = await fetch(url, { method: "HEAD", mode: "cors" });
      if (!response.ok) throw new Error("URL not accessible");

      const link = document.createElement("a");
      link.href = url;
      link.download = encodeURIComponent(filename);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.open(url, "_blank"), 3000);
    } catch {
      setErrorMessage("Failed to start download. Opening link as fallback...");
      window.open(url, "_blank");
    }
  };

  const handleOnlineWatch = async (proxyUrl: string, filename: string): Promise<void> => {
    try {
      const response = await fetch(proxyUrl, { method: "HEAD" });
      if (response.ok && isVideoFile(filename)) {
        const videoWindow = window.open("", "_blank", "width=800,height=600");
        videoWindow?.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body { margin: 0; padding: 20px; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Arial, sans-serif; }
                video { max-width: 100%; max-height: 90vh; background: #000; }
                .controls { position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; }
                .error { color: red; text-align: center; padding: 20px; background: #fff; }
                .loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; }
              </style>
            </head>
            <body>
              <div class="controls">
                <button onclick="window.close()" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Close</button>
              </div>
              <video controls autoplay preload="auto">
                <source src="${proxyUrl}" type="video/mp4">
                <p class="error">Your browser doesn't support HTML5 video. <a href="${proxyUrl}" target="_blank">Download the video instead</a>.</p>
              </video>
              <div class="loading" id="loading">Loading...</div>
              <script>
                const video = document.querySelector('video');
                const loading = document.querySelector('#loading');
                video.oncanplay = () => { loading.style.display = 'none'; };
                video.onerror = () => { loading.style.display = 'none'; };
              </script>
            </body>
          </html>
        `);
      } else {
        window.open(proxyUrl, "_blank");
      }
    } catch {
      window.open(proxyUrl, "_blank");
    }
  };

  const toggleVideoPlayer = (): void => {
    setShowVideoPlayer(!showVideoPlayer);
    setHasVideoError(false);
    setIsVideoLoading(true);
  };

  const handleVideoError = (): void => {
    setHasVideoError(true);
    setIsVideoLoading(false);
    setErrorMessage("Video preview failed. Try 'Watch Online' or 'Direct Download'.");
  };

  const isVideoFile = (filename: string): boolean =>
    [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v", ".3gp"].some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );

  const isImageFile = (filename: string): boolean =>
    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"].some((ext) => filename.toLowerCase().endsWith(ext));

  const reset = (): void => {
    setShareLink("");
    setFileDetails(null);
    setErrorMessage("");
    setShowVideoPlayer(false);
    setHasVideoError(false);
    setIsVideoLoading(false);
  };

  const getVideoPreviewUrl = (url: string, filename: string): string =>
    `${BACKEND_URL}/proxy?url=${encodeURIComponent(url)}&file_name=${encodeURIComponent(filename)}`;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                File Downloader
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">Download files from supported platforms with ease</p>
            </div>

            <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800">
              {!fileDetails ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="shareLink" className="mb-2 block text-sm font-medium">
                      Share Link
                    </label>
                    <input
                      id="shareLink"
                      type="text"
                      placeholder="e.g., https://www.terabox.com/s/xxxxxx or https://www.mirrobox.com/s/xxxxxx"
                      value={shareLink}
                      onChange={(e) => setShareLink(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                      disabled={isProcessing}
                    />
                  </div>
                  <button
                    onClick={handleFetch}
                    disabled={isProcessing || !shareLink.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-medium text-white transition-all hover:bg-blue-700 disabled:bg-zinc-400"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Get Download Link
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-300">
                      File information retrieved successfully!
                    </span>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-700">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {isVideoFile(fileDetails.file_name) ? (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                              <Play className="h-8 w-8 text-blue-600" />
                            </div>
                          ) : fileDetails.thumbnail ? (
                            <img
                              src={fileDetails.thumbnail}
                              alt="Thumbnail"
                              className="h-16 w-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling)
                                  e.currentTarget.nextElementSibling.style.display = "flex";
                              }}
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-600">
                              <FileText className="h-8 w-8 text-zinc-500" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-2 flex items-center gap-2 break-all text-lg font-semibold">
                            <FileText className="h-5 w-5 flex-shrink-0" />
                            {fileDetails.file_name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <span>Size: {fileDetails.file_size}</span>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {isVideoFile(fileDetails.file_name)
                                ? "Video"
                                : isImageFile(fileDetails.file_name)
                                ? "Image"
                                : "File"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {fileDetails?.file_name && isVideoFile(fileDetails.file_name) && (
                        <div className="relative w-full">
                          {!showVideoPlayer ? (
                            <div
                              className="group relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 to-purple-900"
                              onClick={toggleVideoPlayer}
                            >
                              <div className="relative flex aspect-video items-center justify-center">
                                {fileDetails.thumbnail ? (
                                  <img
                                    src={fileDetails.thumbnail}
                                    alt="Video thumbnail"
                                    className="h-full w-full object-cover opacity-60"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gradient-to-br from-blue-800 to-purple-800" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="rounded-full bg-white bg-opacity-20 p-6 backdrop-blur-sm transition-all group-hover:bg-opacity-30">
                                    <Play className="ml-2 h-16 w-16 text-white" />
                                  </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="rounded-lg bg-black bg-opacity-50 p-3 backdrop-blur-sm">
                                    <p className="font-medium text-white">Click to preview video</p>
                                    <p className="text-sm text-gray-300">Built-in video player</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="overflow-hidden rounded-xl bg-black">
                              {!hasVideoError ? (
                                <div className="relative">
                                  <video
                                    controls
                                    preload="auto"
                                    className="max-h-96 w-full object-contain"
                                    poster={fileDetails.thumbnail}
                                    onError={handleVideoError}
                                    onLoadStart={() => setIsVideoLoading(true)}
                                    onCanPlay={() => setIsVideoLoading(false)}
                                  >
                                    <source
                                      src={getVideoPreviewUrl(fileDetails.download_link, fileDetails.file_name)}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                  {isVideoLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex aspect-video items-center justify-center bg-zinc-800 text-white">
                                  <div className="p-6 text-center">
                                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
                                    <p className="text-lg font-medium">Preview Not Available</p>
                                    <p className="mb-4 text-sm text-zinc-400">This video cannot be previewed directly</p>
                                    <button
                                      onClick={() =>
                                        handleOnlineWatch(
                                          fileDetails.proxy_url || fileDetails.download_link,
                                          fileDetails.file_name
                                        )
                                      }
                                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                                    >
                                      Try Watch Online Instead
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="bg-zinc-800 p-3">
                                <button
                                  onClick={toggleVideoPlayer}
                                  className="text-sm text-white transition-colors hover:text-blue-400"
                                >
                                  ← Back to file info
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {fileDetails?.file_name && isImageFile(fileDetails.file_name) && fileDetails.thumbnail && (
                        <div className="w-full">
                          <img
                            src={fileDetails.thumbnail}
                            alt={fileDetails.file_name}
                            className="max-h-80 w-full rounded-xl border border-zinc-200 object-contain dark:border-zinc-600"
                            onError={(e) => {
                              e.currentTarget.src = fileDetails.download_link;
                            }}
                          />
                        </div>
                      )}

                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Available Actions:</h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {fileDetails?.file_name && isVideoFile(fileDetails.file_name) && (
                            <button
                              onClick={() =>
                                handleOnlineWatch(fileDetails.proxy_url || fileDetails.download_link, fileDetails.file_name)
                              }
                              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
                            >
                              <MonitorPlay className="h-4 w-4" />
                              Watch Online
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDirectDownload(fileDetails.proxy_url || fileDetails.download_link, fileDetails.file_name)
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700"
                          >
                            <Download className="h-4 w-4" />
                            Direct Download
                          </button>
                          {fileDetails?.file_name && isImageFile(fileDetails.file_name) && (
                            <button
                              onClick={() => handleOnlineWatch(fileDetails.download_link, fileDetails.file_name)}
                              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                              View in Browser
                            </button>
                          )}
                          <div className="flex flex-row items-center gap-3">
                            <a
                              href={fileDetails.download_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Fast Download
                            </a>
                            <button
                              onClick={reset}
                              className="flex flex-1 items-center justify-center rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-500"
                            >
                              Download Another File
                            </button>
                          </div>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-3 text-xs text-zinc-500 dark:bg-zinc-600 dark:text-zinc-400">
                          <p className="mb-1 font-medium">💡 Usage Tips:</p>
                          <ul className="ml-2 list-inside list-disc space-y-1">
                            {fileDetails?.file_name && isVideoFile(fileDetails.file_name) && (
                              <li>
                                <strong>Watch Online:</strong> Stream video directly in new tab
                              </li>
                            )}
                            <li>
                              <strong>Direct Download:</strong> Fastest way to download file
                            </li>
                            {fileDetails?.file_name && isImageFile(fileDetails.file_name) && (
                              <li>
                                <strong>View in Browser:</strong> See full-size image online
                              </li>
                            )}
                            <li>
                              <strong>Fast Download:</strong> Opens file in a new tab for quick download
                            </li>
                            <li>Try a reputable VPN to improve download speeds</li>
                            <li>Use a download manager (e.g., IDM) for stability</li>
                            <li>Premium account links may provide faster speeds</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-3 text-xs text-zinc-500 dark:bg-zinc-600 dark:text-zinc-400">
                          <p className="mb-1 font-medium">💡 Slow Download Tips:</p>
                          <ul className="ml-2 list-inside list-disc space-y-1">
                            <li>Try a faster network or VPN to improve speeds</li>
                            <li>Use a download manager (e.g., IDM) for stable downloads</li>
                            <li>Premium accounts offer faster download speeds</li>
                            <li>Clear browser cache if downloads are slow</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-300">Error</p>
                      <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        💡 Ensure the link is public (e.g., https://www.terabox.com/s/xxxxxx or https://www.mirrobox.com/s/xxxxxx), try a VPN, or clear browser cache.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 className="mb-3 font-semibold">How to use:</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      1
                    </span>
                    Copy a public share link from a supported platform
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      2
                    </span>
                    Paste it in the input field above
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      3
                    </span>
                    Click "Get Download Link" and wait for processing
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      4
                    </span>
                    Click "Direct Download" or "Fast Download" to start downloading
                  </li>
                </ol>
              </div>

              <InfoSection />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
