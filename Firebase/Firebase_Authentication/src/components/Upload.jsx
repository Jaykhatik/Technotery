import { useEffect, useState } from "react";
import {
  saveFile,
  getFiles,
  deleteFile,
} from "../Utils/indexedDB";
import "./Upload.css";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] =
    useState("");

  // Load all files
  const loadFiles = () => {
    const fetchFiles = async () => {
      try {
        const storedFiles = await getFiles();
        setFiles(storedFiles);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFiles();
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Upload Files
  const handleUpload = async (e) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0)
      return;

    setLoading(true);
    setUploadMessage("");

    try {
      for (const file of selectedFiles) {
        // File Size Validation (5MB)
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
          alert(
            `${file.name} is bigger than 5MB`
          );
          continue;
        }

        // File Type Validation
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
          alert(
            `${file.name} type is not allowed`
          );
          continue;
        }

        await saveFile(file);
      }

      setUploadMessage(
        "Files uploaded successfully"
      );

      loadFiles();
    } catch (error) {
      console.log(error);
      setUploadMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete File
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Delete ${name} ?`
    );

    if (!confirmDelete) return;

    try {
      await deleteFile(id);

      setFiles((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Format File Size
  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} Bytes`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(
      2
    )} MB`;
  };

  // Download File
  const handleDownload = (file, name) => {
    const url = URL.createObjectURL(file);

    const a = document.createElement("a");

    a.href = url;
    a.download = name;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">
        Local File Upload System
      </h1>

      {/* Upload Box */}
      <div className="upload-box">
        <input
          type="file"
          multiple
          onChange={handleUpload}
          className="upload-input"
        />

        <p className="upload-info">
          Allowed: PNG, JPG, JPEG, PDF
        </p>

        <p className="upload-info">
          Max File Size: 5MB
        </p>

        {loading && (
          <p className="upload-loading">
            Uploading files...
          </p>
        )}

        {uploadMessage && (
          <p className={`upload-message ${uploadMessage.includes('failed') ? 'error' : ''}`}>
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Files Grid */}
      <div className="files-grid">
        {files.length === 0 ? (
          <h3 className="no-files">No files uploaded</h3>
        ) : (
          files.map((item) => (
            <div
              key={item.id}
              className="file-card"
            >
              {/* Image Preview */}
              {item.type.startsWith(
                "image/"
              ) && (
                <img
                  src={URL.createObjectURL(
                    item.file
                  )}
                  alt={item.name}
                  className="file-preview"
                />
              )}

              {/* PDF Preview */}
              {item.type ===
                "application/pdf" && (
                <div className="pdf-preview">
                  📄
                </div>
              )}

              <h3 className="file-name">
                {item.name}
              </h3>

              <p className="file-info">
                <strong>Type:</strong>{" "}
                {item.type}
              </p>

              <p className="file-info">
                <strong>Size:</strong>{" "}
                {formatFileSize(item.size)}
              </p>

              <p className="file-info">
                <strong>Uploaded:</strong>{" "}
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </p>

              {/* Buttons */}
              <div className="file-buttons">
                <button
                  onClick={() =>
                    handleDownload(
                      item.file,
                      item.name
                    )
                  }
                  className="btn btn-download"
                >
                  Download
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      item.id,
                      item.name
                    )
                  }
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Upload;