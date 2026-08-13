import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { server_url } from "../../../App";
import { toast } from "react-toastify";
import useGetServices from "../../../hooks/useGetServices";

const initialForm = {
  couponCode: "",
  offerTitle: "",
  description: "",
  audience: "customer",
  benefitType: "CUSTOMER_DISCOUNT",
  serviceId: [],
  discountType: "percentage",
  discountValue: "",
  minBookingAmount: "",
  maxDiscount: "",
  rewardType: "wallet_credits",
  rewardValue: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
  perUserLimit: 1,
  newCustomerOnly: false,
  isActive: true,
};

const OfferForm = () => {
  const { services = [] } = useSelector((state) => state.services);
  const { refetchServices } = useGetServices();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!services.length) refetchServices().catch(() => {});
  }, [services.length, refetchServices]);

  const isProfessional = formData.audience === "professional";
  const isPercentage = formData.discountType === "percentage";

  const selectedServiceNames = useMemo(
    () => services.filter((s) => formData.serviceId.includes(s._id)).map((s) => s.name),
    [services, formData.serviceId]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAudienceChange = (audience) => {
    setFormData((prev) => ({
      ...prev,
      audience,
      benefitType: audience === "customer" ? "CUSTOMER_DISCOUNT" : "PROFESSIONAL_REWARD",
      discountType: "percentage",
      discountValue: "",
      minBookingAmount: "",
      maxDiscount: "",
      rewardValue: "",
      serviceId: [],
      newCustomerOnly: false,
      perUserLimit: audience === "professional" ? 1 : prev.perUserLimit || 1,
    }));
  };

  const toggleService = (id) => {
    setFormData((prev) => ({
      ...prev,
      serviceId: prev.serviceId.includes(id)
        ? prev.serviceId.filter((x) => x !== id)
        : [...prev.serviceId, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(formData.discountValue);

    if (!formData.couponCode.trim()) return toast.error("Enter a coupon code.");
    if (!formData.offerTitle.trim()) return toast.error("Enter an offer title.");
    if (!formData.startDate || !formData.endDate) return toast.error("Select the offer validity dates.");
    if (new Date(formData.endDate) <= new Date(formData.startDate)) return toast.error("End date must be after start date.");

    if (!isProfessional) {
      if (!Number.isFinite(value) || value <= 0) return toast.error("Enter a discount greater than ₹0.");
      if (isPercentage && value > 100) return toast.error("Percentage discount cannot exceed 100%.");
      if (!isPercentage && formData.maxDiscount !== "") return toast.error("Max discount is only for percentage coupons.");
    } else {
      const reward = Number(formData.rewardValue);
      if (!Number.isFinite(reward) || reward < 1) return toast.error("Professional reward must be at least 1 credit.");
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        audience: [formData.audience],
        discountValue: isProfessional ? null : value,
        minBookingAmount: !isProfessional && formData.minBookingAmount !== "" ? Number(formData.minBookingAmount) : null,
        maxDiscount: !isProfessional && isPercentage && formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
        rewardValue: isProfessional ? Number(formData.rewardValue) : null,
        usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
        perUserLimit: isProfessional ? 1 : Number(formData.perUserLimit),
      };

      await axios.post(`${server_url}/api/admin/create-offer`, payload, { withCredentials: true });
      toast.success("Coupon created successfully");
      setFormData(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card bg-dark text-light shadow-lg border-0 rounded-4 p-4">
        <div className="d-flex align-items-center mb-2">
          <MdOutlineLocalOffer size={28} className="me-2 text-warning" />
          <div>
            <h3 className="mb-0 fw-bold">Create Coupon</h3>
            <small className="text-light opacity-75">Create one clear campaign for one audience. Customers enter the code manually; coupons are not publicly listed.</small>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="alert alert-info py-2 small mb-4">
            <strong>Tip:</strong> Use a short code such as <b>WELCOME200</b>. Leave Services empty for all services, or select specific services below.
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Coupon Code</label>
              <input className="form-control" name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="WELCOME200" maxLength={30} required />
              <small className="text-secondary">Letters, numbers, hyphen and underscore only. The code is saved in uppercase.</small>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Offer Title</label>
              <input className="form-control" name="offerTitle" value={formData.offerTitle} onChange={handleChange} placeholder="Welcome ₹200 off" required />
              <small className="text-secondary">Use a title that clearly explains the campaign.</small>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Who is this offer for?</label>
            <div className="row g-2">
              {["customer", "professional"].map((audience) => (
                <div className="col-md-6" key={audience}>
                  <button type="button" className={`btn w-100 text-start ${formData.audience === audience ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => handleAudienceChange(audience)}>
                    <strong>{audience === "customer" ? "Customer" : "Professional"}</strong>
                    <span className="d-block small">{audience === "customer" ? "Discount on an eligible booking" : "Wallet-credit reward"}</span>
                  </button>
                </div>
              ))}
            </div>
            <small className="text-secondary">One coupon targets one audience so its financial meaning stays unambiguous.</small>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Applicable Services</label>
            <div className="border rounded-3 p-3 bg-white text-dark">
              {services.length === 0 ? <div className="small text-muted">Loading services...</div> : <div className="row g-2">
                {services.map((service) => (
                  <div className="col-12 col-md-4" key={service._id}>
                    <label className="d-flex align-items-center gap-2 border rounded-3 p-2 h-100">
                      <input type="checkbox" checked={formData.serviceId.includes(service._id)} onChange={() => toggleService(service._id)} />
                      <span>{service.name}</span>
                    </label>
                  </div>
                ))}
              </div>}
              <small className="text-muted d-block mt-2">{selectedServiceNames.length ? `Selected: ${selectedServiceNames.join(", ")}` : "No service selected = all services."}</small>
            </div>
          </div>

          {!isProfessional ? (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Discount Type</label>
                  <select className="form-select" name="discountType" value={formData.discountType} onChange={handleChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Discount Value</label>
                  <input type="number" min="0.01" step="0.01" className="form-control" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
                  <small className="text-secondary">{isPercentage ? "Enter 1–100. Example: 10 means 10% off." : "Enter the amount to discount. ₹200 is valid."}</small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Minimum Booking Amount</label>
                  <input type="number" min="0" step="0.01" className="form-control" name="minBookingAmount" value={formData.minBookingAmount} onChange={handleChange} />
                  <small className="text-secondary">Optional. The booking must reach this amount before the coupon applies.</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Maximum Discount</label>
                  <input type="number" min="0.01" step="0.01" disabled={!isPercentage} className="form-control" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} />
                  <small className="text-secondary">Only for percentage coupons. Example: 10% off, maximum ₹300.</small>
                </div>
              </div>

              <div className="form-check form-switch mb-4">
                <input type="checkbox" className="form-check-input" name="newCustomerOnly" checked={formData.newCustomerOnly} onChange={handleChange} />
                <label className="form-check-label"><FaToggleOn className="me-2 text-success" />New Customers Only</label>
                <small className="d-block text-secondary">Use this for a first-booking campaign.</small>
              </div>
            </>
          ) : (
            <div className="alert alert-warning">
              <strong>Professional reward:</strong> this coupon grants wallet credits to the professional when successfully claimed. It is not a customer booking discount.
              <div className="mt-2">
                <label className="form-label fw-semibold text-dark">Reward Credits</label>
                <input type="number" min="1" step="1" className="form-control" name="rewardValue" value={formData.rewardValue} onChange={handleChange} required />
                <small className="text-dark">Example: 500 means 500 Fixkar credits.</small>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3"><label className="form-label"><FaCalendarAlt className="me-2" />Start Date</label><input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required /><small className="text-secondary">Coupon cannot be claimed before this date.</small></div>
            <div className="col-md-6 mb-3"><label className="form-label"><FaCalendarAlt className="me-2" />End Date</label><input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleChange} required /><small className="text-secondary">Coupon expires after this date.</small></div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3"><label className="form-label">Global Usage Limit</label><input type="number" min="1" step="1" className="form-control" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Empty = unlimited" /><small className="text-secondary">Maximum successful redemptions across all eligible users.</small></div>
            <div className="col-md-6 mb-3"><label className="form-label">Per User Limit</label><input type="number" min="1" step="1" className="form-control" name="perUserLimit" value={formData.perUserLimit} onChange={handleChange} disabled={isProfessional} /><small className="text-secondary">Customer coupons can be reused up to this limit. Professional rewards are one-time.</small></div>
          </div>

          <div className="form-check form-switch mb-3"><input type="checkbox" className="form-check-input" name="isActive" checked={formData.isActive} onChange={handleChange} /><label className="form-check-label"><FaToggleOn className="me-2 text-warning" />Active Coupon</label><small className="d-block text-secondary">Turn off to pause the campaign without deleting its history.</small></div>

          <button type="submit" className="btn btn-warning w-100 fw-bold py-2" disabled={loading}>{loading ? "Creating..." : "Create Coupon"}</button>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;
