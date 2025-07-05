import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [mergedUrl, setMergedUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setMergedUrl("");
    setLinks([]);
    setStatus("");
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("Uploading...");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      const data = res.data;

      setLinks(data.extractedLinks || []);

      if (data.status === "success") {
        setMergedUrl("http://localhost:8000" + data.mergedPdfUrl);
        setStatus("✅ Merged PDF ready!");
      } else if (data.status === "download_failed") {
        setMergedUrl("");
        setStatus("⚠️ Links found but not downloadable.");
        setErrorMessage(data.message);
      } else if (data.status === "no_links") {
        setMergedUrl("");
        setStatus("ℹ️ No links found in the PDF.");
      } else {
        setStatus("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Upload failed:", err);

      if (err.response) {
        setStatus("❌ Server error while processing the file.");
        setErrorMessage(err.response.data?.message || "Something went wrong on the server.");
      } else if (err.request) {
        setStatus("❌ No response from server.");
        setErrorMessage("Please make sure the backend is running and CORS is allowed.");
      } else {
        setStatus("❌ Failed to process the file.");
        setErrorMessage(err.message || "Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          PDF Link Extractor & Merger
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="block w-full text-sm text-gray-700 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-blue-50 file:text-blue-700 
                       hover:file:bg-blue-100"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Upload & Process
          </button>
        </div>

        {status && (
          <p className="mt-6 text-center text-lg font-medium text-gray-800">
            {status}
          </p>
        )}

        {errorMessage && (
          <p className="mt-2 text-center text-red-600">{errorMessage}</p>
        )}

        {links.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Extracted Links:
            </h2>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              {links.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mergedUrl && (
          <div className="mt-6 text-center">
            <a
              href={mergedUrl}
              download
              className="text-green-700 font-semibold underline hover:text-green-800"
            >
              ⬇️ Download Merged PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
