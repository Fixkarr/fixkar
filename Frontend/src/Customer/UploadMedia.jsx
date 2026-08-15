import React, { useRef, useState } from "react";
import axios from "axios";
import {
  IoClose,
  IoCloudUploadOutline,
  IoImageOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import {
  FaExclamationCircle,
  FaFileVideo,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const UploadMedia = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // handle leave
  const handleLeave = () => {
    setPreview(null);
    setFile(null);
    setUploading(false);
    setError("");
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 1️⃣ File select + preview
  const handleSelect = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setProgress(0);
  };

  // 2️⃣ Get signature from backend
  const getSignature = async () => {
    const res = await axios.get(
      `${server_url}/api/user/signature`,
      { withCredentials: true }
    );

    return res.data;
  };

  // 3️⃣ Upload (SIGNED, REST, XHR)
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      setError("");

      const {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder,
      } = await getSignature();

      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("resource_type", "auto");

      // progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round(
            (e.loaded / e.total) * 100
          );

          setProgress(percent);
        }
      };

      // success
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          const res = await axios.post(
            `${server_url}/api/user/upload-media`,
            {
              mediaUrl: response.secure_url,
              mediaType: response.resource_type,
              publicId: response.public_id,
            },
            { withCredentials: true }
          );

          dispatch(setCurrentUserData(res.data));

          toast.success("Media uploaded!");

          setPreview(null);
          setFile(null);
          setProgress(0);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setUploading(false);
        } else {
          setError(
            "Upload failed: Server rejected the file."
          );

          setUploading(false);
        }
      };

      // network / CORS / connection error
      xhr.onerror = () => {
        setError(
          "Upload failed due to network / CORS / connection issue. Try smaller file or different network."
        );

        setUploading(false);
      };

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
      );

      xhr.send(formData);
    } catch (err) {
      console.error(err);

      setError(
        "Upload failed: Could not get upload signature."
      );

      setUploading(false);
    }
  };

  const isImage = file?.type?.startsWith("image");
  const isVideo = file?.type?.startsWith("video");

  return (
    <div className="w-100">
      {/* ================= COMPACT UPLOAD CARD ================= */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-3">
          {/* ================= HEADER ================= */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              >
                <FaCloudUploadAlt size={18} />
              </div>

              <div>
                <h6 className="fw-bold text-dark mb-0">
                  Add media
                </h6>

                <small className="text-muted">
                  Photos or videos of your work
                </small>
              </div>
            </div>

            {!preview && (
              <label
                htmlFor="media"
                className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2 mb-0"
                style={{
                  cursor: uploading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                <IoCloudUploadOutline size={16} />
                <span className="d-none d-sm-inline">
                  Select
                </span>

                <input
                  type="file"
                  hidden
                  id="media"
                  accept="image/*,video/*"
                  onChange={handleSelect}
                  disabled={uploading}
                  ref={fileInputRef}
                />
              </label>
            )}
          </div>

          {/* ================= EMPTY / SELECT STATE ================= */}
          {!preview && (
            <label
              htmlFor="media"
              className="border rounded-3 d-flex align-items-center justify-content-center gap-3 py-3 px-3"
              style={{
                cursor: uploading
                  ? "not-allowed"
                  : "pointer",
                borderStyle: "dashed",
                background:
                  "linear-gradient(135deg, #f8faff, #f3f7ff)",
              }}
            >
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "42px",
                  height: "42px",
                }}
              >
                <IoCloudUploadOutline size={21} />
              </div>

              <div className="text-start">
                <div className="fw-semibold text-dark small">
                  Choose a photo or video
                </div>

                <small className="text-muted">
                  Tap to browse your device
                </small>
              </div>

              <input
                type="file"
                hidden
                id="media"
                accept="image/*,video/*"
                onChange={handleSelect}
                disabled={uploading}
                ref={fileInputRef}
              />
            </label>
          )}

          {/* ================= PREVIEW ================= */}
          {preview && (
            <div>
              <div className="d-flex flex-column flex-sm-row gap-3">
                {/* Small Preview */}
                <div
                  className="position-relative rounded-3 overflow-hidden bg-dark flex-shrink-0"
                  style={{
                    width: "150px",
                    height: "120px",
                  }}
                >
                  {isImage ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {/* Media type */}
                  <div
                    className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-pill d-flex align-items-center gap-1"
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {isImage ? (
                      <>
                        <IoImageOutline />
                        Image
                      </>
                    ) : (
                      <>
                        <FaFileVideo />
                        Video
                      </>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    className="position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "28px",
                      height: "28px",
                    }}
                    onClick={handleLeave}
                    disabled={uploading}
                    aria-label="Remove media"
                  >
                    <IoClose size={16} />
                  </button>
                </div>

                {/* File Info */}
                <div className="flex-grow-1 d-flex flex-column justify-content-center min-w-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <IoCheckmarkCircle
                      className="text-success flex-shrink-0"
                      size={18}
                    />

                    <span
                      className="fw-semibold text-dark text-truncate"
                      style={{
                        maxWidth: "100%",
                      }}
                    >
                      {file?.name}
                    </span>
                  </div>

                  <small className="text-muted mb-3">
                    {(file?.size / (1024 * 1024)).toFixed(2)} MB
                  </small>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm rounded-pill px-3 align-self-start d-flex align-items-center gap-2"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <ClipLoader
                          size={13}
                          color="#fff"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <IoCloudUploadOutline size={16} />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ================= COMPACT PROGRESS ================= */}
              {uploading && (
                <div className="mt-3">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className="upload-pulse-dot"></span>

                      <small className="fw-semibold text-dark">
                        Uploading...
                      </small>
                    </div>

                    <small className="fw-bold text-primary">
                      {progress}%
                    </small>
                  </div>

                  <div
                    className="upload-progress-track"
                    style={{
                      height: "5px",
                    }}
                  >
                    <div
                      className="upload-progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && (
            <div
              className="mt-3 px-3 py-2 rounded-3 d-flex align-items-center gap-2"
              style={{
                background: "#fff1f2",
                color: "#dc3545",
              }}
            >
              <FaExclamationCircle
                size={15}
                className="flex-shrink-0"
              />

              <small className="fw-semibold flex-grow-1">
                {error}
              </small>

              <button
                type="button"
                className="btn btn-sm p-0 text-danger"
                onClick={() => setError("")}
                aria-label="Close error"
              >
                <IoClose size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= SMALL ANIMATION STYLES ================= */}
      <style>
        {`
          .upload-progress-track {
            width: 100%;
            background: #e9eef7;
            border-radius: 999px;
            overflow: hidden;
          }

          .upload-progress-fill {
            height: 100%;
            min-width: 2px;
            border-radius: 999px;
            background: linear-gradient(
              90deg,
              #0d6efd,
              #4f8dfd,
              #6f42c1
            );
            background-size: 200% 100%;
            animation: uploadGradient 1.5s linear infinite;
            transition: width .25s ease;
          }

          .upload-pulse-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #0d6efd;
            display: inline-block;
            animation: uploadPulse 1s ease-in-out infinite;
          }

          @keyframes uploadGradient {
            0% {
              background-position: 0% 50%;
            }

            100% {
              background-position: 200% 50%;
            }
          }

          @keyframes uploadPulse {
            0%,
            100% {
              opacity: .35;
              transform: scale(.8);
            }

            50% {
              opacity: 1;
              transform: scale(1.15);
            }
          }

          @media (max-width: 575.98px) {
            .upload-preview {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UploadMedia;