import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTag, FaPercentage, FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { server_url } from "../../../App";
import { toast } from "react-toastify";

const UpdateOffer = () => {
  const { services } = useSelector((state) => state.services);
  const { offerId } = useParams(); 

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    serviceId: [],
    offerTitle: "",
    discountType: "percentage",
    discountValue: "",
    minBookingAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    perUserLimit: 1,
    newCustomerOnly: false,
    isActive: true,
  });

  // ✅ Fetch existing offer data
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(
          `${server_url}/api/admin/get-offer/${offerId}`,
          { withCredentials: true }
        );

        const data = res.data.offer;

        setFormData({
          serviceId: data.serviceId.map((s) => s._id || s), // 👈 important fix
          offerTitle: data.offerTitle || "",
          discountType: data.discountType || "percentage",
          discountValue: data.discountValue || "",
          minBookingAmount: data.minBookingAmount || "",
          maxDiscount: data.maxDiscount || "",
          startDate: data.startDate?.slice(0, 10) || "",
          endDate: data.endDate?.slice(0, 10) || "",
          usageLimit: data.usageLimit || "",
          perUserLimit: data.perUserLimit || 1,
          newCustomerOnly: data.newCustomerOnly || false,
          isActive: data.isActive ?? true,
        });

        setFetching(false);
      } catch (error) {
        toast.error("Failed to load offer");
        setFetching(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  // handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ checkbox multi select
  const handleServiceCheckbox = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        serviceId: [...formData.serviceId, value],
      });
    } else {
      setFormData({
        ...formData,
        serviceId: formData.serviceId.filter((id) => id !== value),
      });
    }
  };

  // ✅ update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.put(
        `${server_url}/api/admin/update-offer/${offerId}`,
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center text-light mt-5">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="card bg-dark text-light shadow-lg border-0 rounded-4 p-4">
        
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <MdOutlineLocalOffer size={28} className="me-2 text-warning" />
          <h3 className="mb-0 fw-bold">Update Offer</h3>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Offer Title */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <FaTag className="me-2 text-info" />
              Offer Title
            </label>
            <input
              type="text"
              className="form-control bg-secondary text-light border-0 rounded-3"
              name="offerTitle"
              value={formData.offerTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Services */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <MdOutlineLocalOffer className="me-2 text-success" />
              Select Services
            </label>

            <div className="row">
              {services.map((service) => (
                <div className="col-md-4 mb-2" key={service._id}>
                  <div className="form-check bg-secondary rounded-3 p-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={service._id}
                      checked={formData.serviceId.includes(service._id)}
                      onChange={handleServiceCheckbox}
                    />
                    <label className="form-check-label ms-2">
                      {service.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Discount Type</label>
              <select
                className="form-select bg-secondary text-light border-0"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Discount Value</label>
              <input
                type="number"
                className="form-control bg-secondary text-light border-0"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold py-2 rounded-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Offer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateOffer;