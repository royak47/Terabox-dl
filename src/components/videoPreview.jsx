import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VideoPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const { file_name, size, direct_link } = state;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-zinc-800 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4">Video Details</h2>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-5 space-y-4">
        <p><strong>File Name:</strong> {file_name}</p>
        <p><strong>Size:</strong> {size}</p>

        <video
          controls
          src={direct_link}
          className="w-full rounded-xl border border-gray-300 dark:border-zinc-700"
        />

        <div className="flex gap-4 mt-4">
          <a
            href={direct_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Watch Online
          </a>
          <a
            href={direct_link}
            download
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
