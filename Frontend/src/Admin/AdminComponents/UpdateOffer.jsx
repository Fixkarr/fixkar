import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaInfoCircle, FaLock, FaTag } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { server_url } from "../../App";
import { toast } from "react-toastify";

const UpdateOffer = () => {
  const { services = [] } = useSelector((state) => state.services || {});
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [legacyProfessional, setLegacyProfessional] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${server_url}/api/admin/get-offer/${offerId}`, { withCredentials: true });
        const data = res.data.offer;
        const isLegacy = data.benefitType === "PROFESSIONAL_REWARD" || data.audience?.[0] === "professional";
        setLegacyProfessional(isLegacy);
        setFormData({
          couponCode: data.couponCode || "",
          offerTitle: data.offerTitle || "",
          description: data.description || "",
          serviceId: (data.serviceId || []).map((s) => s?._id || s),
          discountType: data.discountType || "percentage",
          discountValue: data.discountValue ?? "",
          minBookingAmount: data.minBookingAmount ?? "",
          maxDiscount: data.maxDiscount ?? "",
          startDate: data.startDate?.slice(0, 10) || "",
          endDate: data.endDate?.slice(0, 10) || "",
          usageLimit: data.usageLimit ?? "",
          perUserLimit: data.perUserLimit || 1,
          newCustomerOnly: Boolean(data.newCustomerOnly),
          isActive: data.isActive ?? true,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load coupon");
      } finally {
        setFetching(false);
      }
    };
    fetchOffer();
  }, [offerId]);

  const selectedServices = useMemo(() => new Set(formData?.serviceId || []), [formData?.serviceId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleServiceChange = (id, checked) => {
    setFormData((current) => ({
      ...current,
      serviceId: checked ? [...new Set([...current.serviceId, id])] : current.serviceId.filter((item) => item !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (legacyProfessional) return toast.info("Professional milestone rewards are automatic and are not edited as coupons.");
    if (!formData.offerTitle.trim()) return toast.error("Offer title is required");
    if (!formData.startDate || !formData.endDate || formData.endDate <= formData.startDate) return toast.error("End date must be after start date");

    const value = Number(formData.discountValue);
    if (!Number.isFinite(value) || value <= 0) return toast.error("Enter a discount greater than ₹0");
    if (formData.discountType === "percentage" && value > 100) return toast.error("Percentage discount cannot exceed 100%");
    if (formData.discountType === "flat" && formData.maxDiscount !== "" && formData.maxDiscount != null) return toast.error("Maximum discount is only for percentage coupons");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        audience: ["customer"],
        benefitType: "CUSTOMER_DISCOUNT",
        serviceId: formData.serviceId,
      };
      const res = await axios.post(`${server_url}/api/admin/update-offer/${offerId}`, payload, { withCredentials: true });
      setFormData((current) => ({ ...current, ...res.data.offer, serviceId: (res.data.offer.serviceId || []).map((s) => s?._id || s) }));
      toast.success(res.data.message || "Customer coupon updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !formData) return <div className="container py-5 text-center">Loading coupon...</div>;

  if (legacyProfessional) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5 text-center">
            <div className="display-6 mb-3">🏆</div>
            <h3 className="fw-bold">Professional milestone reward</h3>
            <p className="text-muted mx-auto" style={{ maxWidth: 650 }}>
              This is a legacy professional reward campaign. Professional milestones are now automatic: completed bookings unlock credits and dashboard badges. They are not coupon campaigns and do not need manual claiming.
            </p>
            <div className="alert alert-info text-start mx-auto" style={{ maxWidth: 650 }}>
              <FaInfoCircle className="me-2" /> Keep this legacy record for history or archive it from the coupon dashboard. Do not create or edit professional milestone rewards here.
            </div>
            <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>Back to Coupon Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-xl-9">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-start justify-content-between mb-4">
                <div>
                  <h3 className="fw-bold mb-1"><FaTag className="me-2 text-primary" />Update Customer Coupon</h3>
                  <p className="text-muted mb-0">Update customer discount settings without changing the existing coupon code.</p>
                </div>
                <span className="badge bg-light text-dark border"><FaLock className="me-1" /> Code locked</span>
              </div>

              <div className="alert alert-info small"><FaInfoCircle className="me-2" />Financial terms used by an existing booking are preserved through the booking snapshot. Avoid changing an already-running campaign unless necessary.</div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Coupon Code</label>
                  <input className="form-control" value={formData.couponCode} disabled readOnly />
                  <div className="form-text">Coupon codes are immutable. Create a new campaign if you need a different code.</div>
                </div>

                <div className="row">
                  <div className="col-md-7 mb-4">
                    <label className="form-label fw-semibold">Offer Title</label>
                    <input className="form-control" name="offerTitle" value={formData.offerTitle} onChange={handleChange} maxLength={120} required />
                  </div>
                  <div className="col-md-5 mb-4">
                    <label className="form-label fw-semibold">Audience</label>
                    <input className="form-control" value="Customer" disabled readOnly />
                    <div className="form-text">Only customer discount coupons can be created or updated here.</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleChange} maxLength={500} placeholder="Explain what this coupon is for." />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Applicable Services</label>
                  <div className="form-text mb-2">Leave every service unchecked to make the coupon valid for all services.</div>
                  <div className="row g-2">
                    {services.map((service) => (
                      <div className="col-md-6" key={service._id}>
                        <label className="border rounded-3 p-2 d-flex align-items-center gap-2 h-100">
                          <input type="checkbox" checked={selectedServices.has(service._id)} onChange={(e) => handleServiceChange(service._id, e.target.checked)} />
                          <span>{service.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {services.length === 0 && <div className="text-muted small">No services are available to select.</div>}
                </div>

                <div className="border rounded-4 p-3 mb-4">
                  <h6 className="fw-bold">Customer Discount</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Discount Type</label>
                      <select className="form-select" name="discountType" value={formData.discountType} onChange={handleChange}>
                        <option value="percentage">Percentage</option>
                        <option value="flat">Flat amount</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Discount Value</label>
                      <input type="number" min="0.01" step="0.01" className="form-control" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
                      <div className="form-text">₹200 is valid. For percentage coupons, enter a value from 0 to 100.</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Minimum Booking Amount</label>
                      <input type="number" min="0" step="0.01" className="form-control" name="minBookingAmount" value={formData.minBookingAmount} onChange={handleChange} />
                    </div>
                    {formData.discountType === "percentage" && <div className="col-md-6 mb-3">
                      <label className="form-label">Maximum Discount</label>
                      <input type="number" min="0" step="0.01" className="form-control" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} />
                      <div className="form-text">Optional cap on the discount amount.</div>
                    </div>}
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" name="newCustomerOnly" checked={formData.newCustomerOnly} onChange={handleChange} />
                    <label className="form-check-label">New customers only</label>
                  </div>
                </div>

                <div className="border rounded-4 p-3 mb-4">
                  <h6 className="fw-bold">Limits & Validity</h6>
                  <div className="row">
                    <div className="col-md-4 mb-3"><label className="form-label">Start Date</label><input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required /></div>
                    <div className="col-md-4 mb-3"><label className="form-label">End Date</label><input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleChange} required /></div>
                    <div className="col-md-4 mb-3"><label className="form-label">Global Usage Limit</label><input type="number" min="1" step="1" className="form-control" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Unlimited" /></div>
                    <div className="col-md-4 mb-3"><label className="form-label">Per Customer Limit</label><input type="number" min="1" step="1" className="form-control" name="perUserLimit" value={formData.perUserLimit} onChange={handleChange} /></div>
                  </div>
                </div>

                <div className="form-check form-switch mb-4">
                  <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                  <label className="form-check-label fw-semibold">Coupon active</label>
                </div>

                <button className="btn btn-primary w-100 py-2 fw-semibold" type="submit" disabled={loading}>{loading ? "Updating..." : "Save Customer Coupon Changes"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOffer;
