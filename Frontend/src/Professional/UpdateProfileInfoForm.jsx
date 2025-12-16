import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import useLoadGoogleMaps from "../hooks/useLoadGoogleMap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App.jsx";
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { setCurrentUserData } from '../redux/user.slice.js';
  

const UpdateProfileInfoForm = () => {
    const googleLoaded = useLoadGoogleMaps();
    const addressInputRef = useRef(null);
    const [latLng, setLatLng] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
     const validationSchema = Yup.object({
        address: Yup.string(),
        fullName: Yup.string(),
        description: Yup.string(), // Added validation for description
      });

      const formik = useFormik({
    initialValues: {
      fullName : "",
      address: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
       if(values.address !== ""){
         if(!latLng.lat || !latLng.lng){
           toast.error("Please select a valid address from suggestions.");
          return;
        }
       }

        setLoading(true);

      const payload = {
        fullName : values.fullName,
          address: values.address,
          description: values.description,
          lat: latLng.lat,
          lng: latLng.lng,
      }


        const response = await axios.post(
          `${server_url}/api/user/update-profile-info`,
          payload,
          {withCredentials: true }
        );
        dispatch(setCurrentUserData(response?.data))
          // You might want to update Redux store here if successful, e.g., dispatch(setCurrentUserData(response.data.user))
          resetForm();
        setLoading(false)
        toast.success("Profile updated successfully!"); // Added success message
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });
  

  useEffect(() => {
  if (!googleLoaded || !addressInputRef.current) return;

  const autocomplete = new window.google.maps.places.Autocomplete(
    addressInputRef.current,
    {
      fields: ["formatted_address", "geometry"],
      componentRestrictions: { country: "in" },
      types: ["address"],
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      toast.error("Please select address from suggestions only.");
      formik.setFieldValue("address", "");
      return;
    }

    const formattedAddress = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    formik.setFieldValue("address", formattedAddress);
    setLatLng({ lat, lng });
  });

  return () => {
    window.google.maps.event.clearInstanceListeners(autocomplete);
  };
}, [googleLoaded]);


  return (
        <>
         <div className="modal-body">
             <form onSubmit={formik.handleSubmit}>
      {/* Full Name */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Full Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter full name"
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
     {formik.touched.fullName && formik.errors.fullName && (
            <div className="text-danger">{formik.errors.fullName}</div>
          )}
      {/* Address */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Address</label>
       <input
          type="text"
          ref={addressInputRef}
          name="address"
          className="form-control"
          placeholder="Enter address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        /> 
      </div>
           {formik.touched.address && formik.errors.address && (
            <div className="text-danger">{formik.errors.address}</div>
          )}
      {/* Description */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          rows="3"
          name='description'
          placeholder="Write your details..."
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
      </div>
       {formik.touched.description && formik.errors.description && (
            <div className="text-danger">{formik.errors.description}</div>
          )}

      {/* Submit Button */}
     <center>
         <button type="submit" disabled={loading} className="btn btn-primary">
                   {loading ? <ClipLoader size={20} /> : "Update"}
                 </button>
     </center>
    </form>
        </div>
        </>
  )
}

export default UpdateProfileInfoForm;

