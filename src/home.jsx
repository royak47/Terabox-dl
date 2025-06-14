import { useState } from "react";
import { Download, FileText, Loader2, AlertCircle, CheckCircle, ExternalLink, Play, Eye, MonitorPlay } from "lucide-react";
import InfoSection from "./infosection";
import Header from "./components/header";
import Footer from "./footer";

const BACKEND_URL = "https://raspy-wave-5e61.sonukalakhari76.workers.dev";

function Home() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);

  const handleFetch = async (retryCount = 3) => {
    if (!link.trim()) {
      setError("Please paste a TeraBox link.");
      return;
    }
    if (!link.includes("terabox") && !link.includes("1024tera")) {
      setError("Please enter a valid TeraBox link.");
      return;
    }

    setLoading(true);
    setError("");
    setFileData(null);

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link: link.trim() }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setFileData(data);
          setError("");
          break;
        }
      } catch (e) {
        if (attempt === retryCount) {
          setError(`Connection failed after ${retryCount} attempts: ${e.message}`);
        }
      }
    }
    setLoading(false);
  };

  const handleDirectDownload = (directUrl, proxyUrl, filename) => {
    if (!directUrl || !filename) {
      setError("Invalid download link or filename. Try 'Open Link'.");
      return;
    }

    const attemptDownload = (url) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = encodeURIComponent(filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      } catch (e) {
        return false;
      }
    };

    // Try direct download first
    let success = attemptDownload(directUrl);

    // Fallback to proxy URL if direct download fails and proxyUrl exists
    if (!success && proxyUrl) {
      success = attemptDownload(proxyUrl);
    }

    // If both fail, show error
    if (!success) {
      setError("Failed to start download. Please try 'Open Link' or use a download manager.");
    }
  };

  const handleOnlineWatch = async (proxyUrl, filename) => {
    try {
      const response = await fetch(proxyUrl, { method: "HEAD" });
      if (response.ok) {
        if (isVideoFile(filename)) {
          const videoWindow = window.open("", "_blank", "width=800,height=600");
          videoWindow.document.write(`
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
      } else {
        throw new Error("URL not accessible");
      }
    } catch (error) {
      window.open(proxyUrl, "_blank");
    }
  };

  const toggleVideoPlayer = () => {
    setShowVideoPlayer(!showVideoPlayer);
    setVideoError(false);
    setIsVideoBuffering(true);
  };

  const handleVideoError = (e) => {
    setVideoError(true);
    setIsVideoBuffering(false);
    setError(
      `Video preview failed (Error: ${e.target.error?.message || "Unknown"}). Try using "Watch Online" or "Direct Download".`
    );
  };

  const isVideoFile = (filename) => {
    const videoExtensions = [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v", ".3gp"];
    return videoExtensions.some((ext) => filename.toLowerCase().includes(ext));
  };

  const isImageFile = (filename) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
    return imageExtensions.some((ext) => filename.toLowerCase().includes(ext));
  };

  const reset = () => {
    setLink("");
    setFileData(null);
    setError("");
    setShowVideoPlayer(false);
    setVideoError(false);
    setIsVideoBuffering(false);
  };

  const getVideoPreviewUrl = (url, filename) => {
    const previewUrl = `${BACKEND_URL}/proxy?url=${encodeURIComponent(url)}&file_name=${encodeURIComponent(filename)}`;
    return previewUrl;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TeraBox Downloader
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">Download files from TeraBox with ease</p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 mb-6">
              {!fileData ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="link" className="block text-sm font-medium mb-2">
                      TeraBox Share Link
                    </label>
                    <input
                      id="link"
                      type="text"
                      placeholder="https://terabox.app/s/xxxxxx"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleFetch}
                    disabled={loading || !link.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Get Download Link
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      File information retrieved successfully!
                    </span>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-xl p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {isVideoFile(fileData.file_name) ? (
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <Play className="w-8 h-8 text-blue-600" />
                            </div>
                          ) : fileData.thumbnail ? (
                            <img
                              src={fileData.thumbnail}
                              alt="Thumbnail"
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-16 h-16 bg-zinc-200 dark:bg-zinc-600 rounded-lg flex items-center justify-center"
                            style={{ display: fileData.thumbnail ? "none" : "flex" }}
                          >
                            <FileText className="w-8 h-8 text-zinc-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 break-all">
                            <FileText className="w-5 h-5 flex-shrink-0" />
                            {fileData.file_name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <span>Size: {fileData.file_size}</span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                              {isVideoFile(fileData.file_name) ? "Video" : isImageFile(fileData.file_name) ? "Image" : "File"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {fileData?.file_name && isVideoFile(fileData.file_name) && (
                        <div className="w-full relative">
                          {!showVideoPlayer ? (
                            <div
                              className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl overflow-hidden relative cursor-pointer group"
                              onClick={toggleVideoPlayer}
                            >
                              <div className="aspect-video flex items-center justify-center relative">
                                {fileData.thumbnail ? (
                                  <img
                                    src={fileData.thumbnail}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover opacity-60"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-800"></div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 group-hover:bg-opacity-30 transition-all">
                                    <Play className="w-16 h-16 text-white ml-2" />
                                  </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div classNameója

System: ### Key Changes Made

#### 1. **Removed Debug Information and Logs**
- **Removed `debugInfo` State**:
  - Deleted the `debugInfo` state variable and all `setDebugInfo` calls.
  - Removed the debug information UI section (`{debugInfo && ...}`) from the JSX.
- **Removed Console Logs**:
  - Eliminated all `console.log`, `console.error`, and `console.warn` statements from `handleFetch`, `handleDirectDownload`, `handleOnlineWatch`, `toggleVideoPlayer`, `reset`, and `getVideoPreviewUrl`.

#### 2. **Fixed Direct Download**
- **Simplified `handleDirectDownload`**:
  - Updated the function to take `directUrl`, `proxyUrl`, and `filename` as parameters.
  - Removed the HEAD request to avoid CORS issues and unnecessary checks.
  - Implemented an `attemptDownload` helper function to trigger downloads using a dynamically created `<a>` element.
  - Attempts download with `directUrl` first, then falls back to `proxyUrl` if it fails.
  - Removed the 3-second `window.open` fallback to prevent unwanted tab openings.
  - Updated error handling to provide a clear message if both download attempts fail.
- **Updated Button Call**:
  - Modified the "Direct Download" button in the JSX to call `handleDirectDownload(fileData.download_link, fileData.proxy_url, fileData.file_name)`.
  - Changed the button label to "Direct Download" for clarity.

#### 3. **Additional Notes**
- **Download Behavior**: The `handleDirectDownload` function now triggers the download immediately using the `download_link`. If it fails, it tries the `proxy_url`. If both fail, it displays an error message without opening a new tab, ensuring a seamless experience.
- **CORS Considerations**: Ensure the backend URLs (`download_link` and `proxy_url`) are configured with proper CORS headers (`Access-Control-Allow-Origin: *`) to allow downloads. If CORS issues persist, you may need to adjust the backend or use a proxy that handles CORS correctly.
- **Testing**: Test the download functionality with various TeraBox links to confirm that downloads start immediately. If issues occur, verify that the backend URLs return `Content-Disposition: attachment` headers.
- **Production Readiness**: The removal of logs and debug info makes the code cleaner for production. For critical error tracking, consider integrating a logging service like Sentry with conditional logging (e.g., `if (process.env.NODE_ENV !== 'production')`).

If you encounter any issues (e.g., downloads not starting or CORS errors), please provide details, and I can suggest further refinements!
