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
  const [debugInfo, setDebugInfo] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);

  const handleFetch = async (retryCount = 3) => {
    console.log("handleFetch triggered with link:", link);
    if (!link.trim()) {
      setError("Please paste a TeraBox link.");
      console.log("Error: Empty link");
      return;
    }
    if (!link.includes("terabox") && !link.includes("1024tera") && !link.includes("tera") && !link.includes("box") && !link.includes("terafileshare") && !link.includes("teraboxlink")) {
      setError("Please enter a valid TeraBox link.");
      console.log("Error: Invalid link format");
      return;
    }

    setLoading(true);
    setError("");
    setFileData(null);
    setDebugInfo("");

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        setDebugInfo(`Attempt ${attempt}: Sending request to backend...`);
        console.log(`Attempt ${attempt}: Sending to ${BACKEND_URL} with link: ${link}`);
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link: link.trim() }),
        });

        setDebugInfo(`Attempt ${attempt}: Response status: ${res.status}`);
        console.log(`Attempt ${attempt}: Status ${res.status}`);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        const data = await res.json();
        setDebugInfo(`Attempt ${attempt}: Response received successfully`);
        console.log("Backend response:", data);

        if (data.error) {
          setError(data.error);
          console.log("Backend error:", data.error);
        } else {
          setFileData(data);
          setError("");
          console.log("File data set:", data);
          if (data.debug_info) {
            setDebugInfo(prev => `${prev}\n${data.debug_info}`);
          }
          break;
        }
      } catch (e) {
        console.error(`Attempt ${attempt} failed:`, e);
        setDebugInfo(`Attempt ${attempt}: Error details: ${e.message}`);
        if (attempt === retryCount) {
          setError(`Connection failed after ${retryCount} attempts: ${e.message}`);
          console.log("Final error:", e.message);
        }
      }
    }
    setLoading(false);
    console.log("Fetch complete, loading:", false);
  };

  const handleDirectDownload = async (url, filename) => {
    console.log("handleDirectDownload triggered for:", filename, "URL:", url);
    if (!url || !filename) {
      console.error("Invalid URL or filename:", { url, filename });
      setError("Invalid download link or filename. Try 'Open Link'.");
      return;
    }

    try {
      console.log("Pre-checking URL:", url);
      const response = await fetch(url, { method: "HEAD", mode: "cors" });
      const headers = Object.fromEntries(response.headers);
      console.log("HEAD response:", { status: response.status, headers });
      setDebugInfo(prev => `${prev}\nDownload URL check: Status ${response.status}, Content-Type: ${headers['content-type'] || 'none'}, Content-Disposition: ${headers['content-disposition'] || 'none'}`);

      if (!response.ok) {
        throw new Error(`URL not accessible, status: ${response.status}`);
      }

      if (!headers['content-disposition']?.includes('attachment')) {
        console.warn("Warning: Content-Disposition is not 'attachment'. Download may open in browser.");
        setDebugInfo(prev => `${prev}\nWarning: Missing Content-Disposition: attachment`);
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = encodeURIComponent(filename);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      console.log("Attempting to trigger download for:", url);
      link.click();
      document.body.removeChild(link);
      console.log("Download triggered successfully");

      setTimeout(() => {
        console.log("Checking if download started...");
        window.open(url, "_blank");
        console.log("Fallback: Opened URL in new tab:", url);
        setDebugInfo(prev => `${prev}\nTriggered fallback: Opened URL in new tab`);
      }, 3000);
    } catch (e) {
      console.error("Direct download failed:", e);
      setError(`Failed to start download: ${e.message}. Opening link as fallback...`);
      setDebugInfo(prev => `${prev}\nDownload failed: ${e.message}`);
      window.open(url, "_blank");
      console.log("Fallback: Opened URL in new tab:", url);
    }
  };

  const handleOnlineWatch = async (proxyUrl, filename) => {
    console.log("handleOnlineWatch triggered for:", filename);
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
      console.log("Direct URL access failed, trying fallback...", error);
      window.open(proxyUrl, "_blank");
    }
  };

  const toggleVideoPlayer = () => {
    console.log("Toggling video player, current state:", showVideoPlayer);
    setShowVideoPlayer(!showVideoPlayer);
    setVideoError(false);
    setIsVideoBuffering(true);
  };

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
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
    console.log("Resetting state");
    setLink("");
    setFileData(null);
    setError("");
    setDebugInfo("");
    setShowVideoPlayer(false);
    setVideoError(false);
    setIsVideoBuffering(false);
  };

  const getVideoPreviewUrl = (url, filename) => {
    const previewUrl = `${BACKEND_URL}/proxy?url=${encodeURIComponent(url)}&file_name=${encodeURIComponent(filename)}`;
    console.log("Generated video preview URL:", previewUrl);
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
                    onClick={() => {
                      console.log("Get Download Link button clicked");
                      handleFetch();
                    }}
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
                                  <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
                                    <p className="text-white font-medium">Click to preview video</p>
                                    <p className="text-gray-300 text-sm">Built-in video player</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-black rounded-xl overflow-hidden">
                              {!videoError ? (
                                <div className="relative">
                                  <video
                                    controls
                                    preload="auto"
                                    className="w-full max-h-96 object-contain"
                                    poster={fileData.thumbnail}
                                    onError={handleVideoError}
                                    onLoadStart={() => setIsVideoBuffering(true)}
                                    onCanPlay={() => setIsVideoBuffering(false)}
                                  >
                                    <source
                                      src={getVideoPreviewUrl(fileData.download_link, fileData.file_name)}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                  {isVideoBuffering && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="aspect-video flex items-center justify-center bg-zinc-800 text-white">
                                  <div className="text-center p-6">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                                    <p className="text-lg font-medium">Preview Not Available</p>
                                    <p className="text-sm text-zinc-400 mb-4">This video cannot be previewed directly</p>
                                    <button
                                      onClick={() => handleOnlineWatch(fileData.proxy_url, fileData.file_name)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                      Try Watch Online Instead
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="p-3 bg-zinc-800">
                                <button
                                  onClick={toggleVideoPlayer}
                                  className="text-white text-sm hover:text-blue-400 transition-colors"
                                >
                                  ← Back to file info
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {fileData?.file_name && isImageFile(fileData.file_name) && fileData.thumbnail && (
                        <div className="w-full">
                          <img
                            src={fileData.thumbnail}
                            alt={fileData.file_name}
                            className="w-full max-h-80 object-contain rounded-xl border border-zinc-200 dark:border-zinc-600"
                            onError={(e) => {
                              e.target.src = fileData.download_link;
                            }}
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">Available Actions:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {fileData?.file_name && isVideoFile(fileData.file_name) && (
                            <button
                              onClick={() => handleOnlineWatch(fileData.proxy_url, fileData.file_name)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                              <MonitorPlay className="w-4 h-4" />
                              Watch Online
                            </button>
                          )}
                          <button
                            onClick={() => handleDirectDownload(fileData.proxy_url || fileData.download_link, fileData.file_name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Direct Download (Proxy Fallback)
                          </button>
                          {fileData?.file_name && isImageFile(fileData.file_name) && (
                            <button
                              onClick={() => handleOnlineWatch(fileData.download_link, fileData.file_name)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View in Browser
                            </button>
                          )}
                          <a
                            href={fileData.download_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Link
                          </a>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-600 rounded-lg p-3">
                          <p className="font-medium mb-1">💡 Usage Tips:</p>
                          <ul className="space-y-1 list-disc list-inside ml-2">
                            {fileData?.file_name && isVideoFile(fileData.file_name) && <li><strong>Watch Online:</strong> Stream video directly in new tab</li>}
                            <li><strong>Direct Download:</strong> Fastest way to download file</li>
                            {fileData?.file_name && isImageFile(fileData.file_name) && <li><strong>View in Browser:</strong> See full-size image online</li>}
                            <li>Try a reputable VPN to improve download speeds.</li>
                            <li>Use a download manager (e.g., IDM) to stabilize downloads.</li>
                            <li>Using a TeraBox premium account link may provide faster speeds.</li>
                          </ul>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-600 rounded-lg p-3">
                          <p className="font-medium mb-1">💡 Slow Download Tips:</p>
                          <ul className="space-y-1 list-disc list-inside ml-2">
                            <li>Try a faster network or VPN to improve speeds.</li>
                            <li>Use a download manager (e.g., IDM) for stable downloads.</li>
                            <li>Premium TeraBox accounts offer faster download speeds.</li>
                            <li>Clear browser cache if downloads are slow.</li>
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={reset}
                        className="w-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-medium transition-all"
                      >
                        Download Another File
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      {error.includes("Connection failed") && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                          💡 Try clearing your browser cache or restarting your browser to improve download speed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {debugInfo && (
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 mb-6">
                  <h4 className="font-medium mb-2">Debug Information:</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">{debugInfo}</p>
                  {debugInfo.includes("response time") && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                      💡 Slow response detected? Try a VPN, download manager, or TeraBox premium account for better speeds.
                    </p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-3">How to use:</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                    Copy a TeraBox share link
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                    Paste it in the input field above
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                    Click "Get Download Link" and wait for processing
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                    Click "Direct Download" to start downloading
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
}

export default Home;
