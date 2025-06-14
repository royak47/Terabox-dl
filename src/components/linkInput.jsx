import { useState } from "react";

const BACKEND_URL = "https://your-backend-url.com"; // ← replace with your backend

const LinkInput = ({ onFetchSuccess }) => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!link) return;
    setLoading(true);
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });
      const data = await res.json();
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        onFetchSuccess(data);
      }
    } catch (err) {
      alert("Failed to fetch. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center space-y-6">
      <h1 className="text-3xl font-bold">Download Any TeraBox File</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Paste the TeraBox share link below</p>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="https://terabox.app/s/xxxxxx"
        className="w-full p-3 rounded-xl border dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleFetch}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl disabled:opacity-60"
      >
        {loading ? "Processing..." : "Get Download Link"}
      </button>
    </div>
  );
};

export default LinkInput;
