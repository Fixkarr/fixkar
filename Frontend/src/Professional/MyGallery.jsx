import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GalleryPlaceholder from "../Components/GalleryPlaceholder";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { uploadMedia } from "../Customer/uploadMedia";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
const MyGallery = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentUserData } = useSelector((state) => state.user);
  const media = currentUserData?.user?.gallery;
  const handleMedia = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setLoading(true);
    const data = await uploadMedia(selectedFile);
    dispatch(setCurrentUserData(data))
    setLoading(false);
  };

  return media ? (
    <div className="container my-4">
      <div className="p-1 mb-2 d-flex justify-content-between">
        <h3>My Gallery</h3>
        <label htmlFor="media" className="btn btn-primary rounded-pill px-4">
          <i className="bi bi-cloud-upload me-2"></i>
          <input
            disabled={loading}
            type="file"
            accept="image/*, video/*"
            id="media"
            hidden
            onChange={(e) => handleMedia(e)}
          />
          {loading && <ClipLoader size={10} />} <IoCloudUploadOutline /> Upload
          Photos / Videos
        </label>
      </div>
      <div className="row g-3">
        {media?.map((item, index) => (
          <div key={index} className="col-4 col-sm-3 col-md-2">
            <div className="ratio ratio-1x1 rounded overflow-hidden border shadow-sm">
              {item.mediaType === "image" ? (
                <img
                  src={item.mediaUrl}
                  alt="media"
                  className="img-fluid object-fit-cover w-100 h-100"
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  className="w-100 h-100 object-fit-cover"
                  controls
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <GalleryPlaceholder />
  );
};

export default MyGallery;
