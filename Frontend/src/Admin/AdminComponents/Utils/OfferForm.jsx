import axios from "axios";
import React, { useState } from "react";
import { FaTag, FaPercentage, FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { server_url } from "../../../App";
import { toast } from "react-toastify";

const OfferForm = () => {
  const { services = [] } = useSelector((state) => state.services);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ couponCode: "", offerTitle: "", description: "", audience: ["customer"], benefitType: "CUSTOMER_DISCOUNT", serviceId: [], discountType: "percentage", discountValue: "", minBookingAmount: "", maxDiscount: "", startDate: "", endDate: "", usageLimit: "", perUserLimit: 1, newCustomerOnly: false, isActive: true });

  const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value })); };
  const toggleAudience = (role) => setFormData((prev) => ({ ...prev, audience: prev.audience.includes(role) ? prev.audience.filter((r) => r !== role) : [...prev.audience, role] }));
  const toggleService = (id) => setFormData((prev) => ({ ...prev, serviceId: prev.serviceId.includes(id) ? prev.serviceId.filter((x) => x !== id) : [...prev.serviceId, id] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.couponCode.trim()) return toast.error("Coupon code is required");
    if (!formData.audience.length) return toast.error("Select at least one audience");
    if (!formData.startDate || !formData.endDate) return toast.error("Validity dates are required");
    try {
      setLoading(true);
      await axios.post(`${server_url}/api/admin/create-offer`, { ...formData, couponCode: formData.couponCode.trim().toUpperCase(), discountValue: Number(formData.discountValue), minBookingAmount: formData.minBookingAmount === "" ? null : Number(formData.minBookingAmount), maxDiscount: formData.discountType === "percentage" && formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null, usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit), perUserLimit: Number(formData.perUserLimit) }, { withCredentials: true });
      toast.success("Coupon created successfully");
      setFormData({ couponCode: "", offerTitle: "", description: "", audience: ["customer"], benefitType: "CUSTOMER_DISCOUNT", serviceId: [], discountType: "percentage", discountValue: "", minBookingAmount: "", maxDiscount: "", startDate: "", endDate: "", usageLimit: "", perUserLimit: 1, newCustomerOnly: false, isActive: true });
    } catch (error) { toast.error(error.response?.data?.message || "Failed to create coupon"); }
    finally { setLoading(false); }
  };

  return <div className="container py-4"><div className="card bg-dark text-light shadow-lg border-0 rounded-4 p-4">
    <div className="d-flex align-items-center mb-4"><MdOutlineLocalOffer size={28} className="me-2 text-warning" /><div><h3 className="mb-0 fw-bold">Create Coupon</h3><small className="text-light opacity-75">Users must enter the code; no public offer feed is exposed.</small></div></div>
    <form onSubmit={handleSubmit}>
      <div className="row"><div className="col-md-6 mb-3"><label className="form-label fw-semibold">Coupon Code</label><input className="form-control bg-secondary text-light border-0" name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="FIXKAR100" maxLength={30} required /></div><div className="col-md-6 mb-3"><label className="form-label fw-semibold">Offer Title</label><input className="form-control bg-secondary text-light border-0" name="offerTitle" value={formData.offerTitle} onChange={handleChange} placeholder="100 OFF on plumbing" required /></div></div>
      <div className="mb-3"><label className="form-label fw-semibold">Description</label><textarea className="form-control bg-secondary text-light border-0" name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Short customer-facing description" /></div>
      <div className="mb-4"><label className="form-label fw-semibold d-block">Who can claim?</label><div className="d-flex gap-4"><div className="form-check"><input className="form-check-input" type="checkbox" checked={formData.audience.includes("customer")} onChange={() => toggleAudience("customer")} /><label className="form-check-label">Customer</label></div><div className="form-check"><input className="form-check-input" type="checkbox" checked={formData.audience.includes("professional")} onChange={() => toggleAudience("professional")} /><label className="form-check-label">Professional</label></div></div></div>
      <div className="mb-4"><label className="form-label fw-semibold"><MdOutlineLocalOffer className="me-2 text-success" />Services</label><div className="row">{services.map((service) => <div className="col-md-4 mb-2" key={service._id}><div className="form-check bg-secondary rounded-3 p-2"><input className="form-check-input" type="checkbox" checked={formData.serviceId.includes(service._id)} onChange={() => toggleService(service._id)} /><label className="form-check-label ms-2">{service.name}</label></div></div>)}</div><small className="text-muted">Leave all unchecked to allow every service.</small></div>
      <div className="row"><div className="col-md-6 mb-3"><label className="form-label fw-semibold"><FaPercentage className="me-2" />Discount Type</label><select className="form-select bg-secondary text-light border-0" name="discountType" value={formData.discountType} onChange={handleChange}><option value="percentage">Percentage</option><option value="flat">Flat</option></select></div><div className="col-md-6 mb-3"><label className="form-label fw-semibold">Discount Value</label><input type="number" min="0.01" className="form-control bg-secondary text-light border-0" name="discountValue" value={formData.discountValue} onChange={handleChange} required /></div></div>
      <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Minimum Booking Amount</label><input type="number" min="0" className="form-control bg-secondary text-light border-0" name="minBookingAmount" value={formData.minBookingAmount} onChange={handleChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Max Discount (percentage only)</label><input type="number" min="0" disabled={formData.discountType === "flat"} className="form-control bg-secondary text-light border-0" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} /></div></div>
      <div className="row"><div className="col-md-6 mb-3"><label className="form-label"><FaCalendarAlt className="me-2" />Start Date</label><input type="date" className="form-control bg-secondary text-light border-0" name="startDate" value={formData.startDate} onChange={handleChange} required /></div><div className="col-md-6 mb-3"><label className="form-label"><FaCalendarAlt className="me-2" />End Date</label><input type="date" className="form-control bg-secondary text-light border-0" name="endDate" value={formData.endDate} onChange={handleChange} required /></div></div>
      <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Global Usage Limit</label><input type="number" min="1" className="form-control bg-secondary text-light border-0" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Empty = unlimited" /></div><div className="col-md-6 mb-3"><label className="form-label">Per User Limit</label><input type="number" min="1" className="form-control bg-secondary text-light border-0" name="perUserLimit" value={formData.perUserLimit} onChange={handleChange} required /></div></div>
      <div className="form-check form-switch mb-3"><input type="checkbox" className="form-check-input" name="newCustomerOnly" checked={formData.newCustomerOnly} onChange={handleChange} /><label className="form-check-label"><FaToggleOn className="me-2 text-success" />New Customers Only</label></div>
      <div className="form-check form-switch mb-4"><input type="checkbox" className="form-check-input" name="isActive" checked={formData.isActive} onChange={handleChange} /><label className="form-check-label"><FaToggleOn className="me-2 text-warning" />Active Coupon</label></div>
      <button type="submit" className="btn btn-warning w-100 fw-bold py-2" disabled={loading}>{loading ? "Creating..." : "Create Coupon"}</button>
    </form>
  </div></div>;
};
export default OfferForm;
