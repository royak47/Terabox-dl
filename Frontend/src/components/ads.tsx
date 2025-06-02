import { useEffect, useState } from "react";
import { AdblockDetector } from "adblock-detector";

const AdsBlockMessage = () => {
  const [adblockDetected, setAdblockDetected] = useState(false);

  useEffect(() => {
    const adbDetector = new AdblockDetector();
    setAdblockDetected(adbDetector.detect());
  }, []);

  if (!adblockDetected) {
    return null;
  }

  return (
    <div className="bg-gray-900 fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen">
      <div className="p-5 bg-white rounded-lg shadow-lg max-w-md">
        <h4 className="text-xl font-semibold text-red-600">Adblock Detected</h4>
        <p className="text-gray-700 mt-2">
          It looks like you're using an ad blocker. Our website relies on ad revenue to provide free content. Please consider disabling your ad blocker.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default AdsBlockMessage;
