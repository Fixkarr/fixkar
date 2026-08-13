import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { server_url } from "../../../App";
import { toast } from "react-toastify";

const initialForm = {
  couponCode: "",
  offerTitle: "",
  description: "",
  serviceId: [],
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
};

const OfferForm = () => {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    let mounted = true;
    axios.get(`${server_url}/api/user/get-services`)
      .then((res) => {
        const list = res.data?.services || res.data?.data || [];
        if (mounted) setServices(Array.isArray(list) ? list : []);
      })
      .catch(() => { if (mounted) toast.error("Unable to load services"); })
      .finally(() => { if (mounted) setServicesLoading(false); });
    return () => { mounted = false; };
  }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleService = (id) => {
    setFormData((prev) => ({
      ...prev,
      serviceId: prev.serviceId.includes(id)
        ? prev.serviceId.filter((item) => item !== id)
        : [...prev.serviceId, id],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.couponCode.trim()) return toast.error("Enter a coupon code.");
    if (!formData.offerTitle.trim()) return toast.error("Enter an offer title.");
    if (!formData.startDate || !formData.endDate) return toast.error("Select validity dates.");
    if (new Date(formData.endDate) < new Date(formData.startDate)) return toast.error("End date cannot be before start date.");

    const value = Number(formData.discountValue);
    if (!Number.isFinite(value) || value <= 0) return toast.error("Enter a discount greater than ₹0.");
    if (formData.discountType === "percentage" && value > 100) return toast.error("Percentage discount cannot exceed 100%.");
    if (formData.discountType === "flat" && formData.maxDiscount !== "") return toast.error("Maximum discount is only for percentage coupons.");

    try {
      setLoading(true);
      await axios.post(`${server_url}/api/admin/create-offer`, {
        couponCode: formData.couponCode,
        offerTitle: formData.offerTitle,
        description: formData.description,
        audience: ["customer"],
        benefitType: "CUSTOMER_DISCOUNT",
        serviceId: formData.serviceId,
        discountType: formData.discountType,
        discountValue: value,
        minBookingAmount: formData.minBookingAmount === "" ? null : Number(formData.minBookingAmount),
        maxDiscount: formData.discountType === "percentage" && formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
        perUserLimit: Number(formData.perUserLimit),
        newCustomerOnly: formData.newCustomerOnly,
        isActive: formData.isActive,
      }, { withCredentials: true });
      toast.success("Customer coupon created successfully");
      setFormData({ ...initialForm });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
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
            <h3 className="mb-0 fw-bold">Create Customer Coupon</h3>
            <small className="text-light opacity-75">Create discount coupons that customers can apply to eligible bookings.</small>
          </div>
        </div>

        <div className="alert alert-info py-2 small">
          <strong>How it works:</strong> Customer enters the coupon code during an eligible booking/payment flow. The discount is validated on the server before it is applied.
        </div>

        <form onSubmit={submit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Coupon Code</label>
              <input className="form-control" name="couponCode" value={formData.couponCode} onChange={change} placeholder="WELCOME200" maxLength={30} required />
              <small className="text-secondary">3–30 characters: letters, numbers, - or _. Saved uppercase.</small>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Campaign Title</label>
              <input className="form-control" name="offerTitle" value={formData.offerTitle} onChange={change} placeholder="Welcome Discount" maxLength={120} required />
              <small className="text-secondary">Use a clear name describing the customer benefit.</small>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Description</label>
            <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={change} maxLength={500} placeholder="Example: Get 10% off your first eligible booking." />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Applicable Services</label>
            <div className="border rounded-3 p-3 bg-white text-dark">
              {servicesLoading ? <div className="small text-muted">Loading services...</div> : services.length === 0 ? <div className="small text-muted">No services available.</div> : (
                <div className="row g-2">
                  {services.map((service) => (
                    <div className="col-12 col-md-4" key={service._id}>
                      <label className="d-flex align-items-center gap-2 border rounded-3 p-2 h-100">
                        <input type="checkbox" checked={formData.serviceId.includes(service._id)} onChange={() => toggleService(service._id)} />
                        <span>{service.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <small className="text-muted d-block mt-2">No service selected = coupon applies to all services.</small>
            </div>
          </div>

          <div className="border rounded-4 p-3 mb-4">
            <h6 className="fw-bold">Customer Discount</h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Discount Type</label>
                <select className="form-select" name="discountType" value={formData.discountType} onChange={change}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Discount Value</label>
                <input type="number" min="0.01" step="0.01" className="form-control" name="discountValue" value={formData.discountValue} onChange={change} required />
                <small className="text-secondary">{formData.discountType === "percentage" ? "Enter 1–100. Example: 10 means 10% off." : "Enter the amount. ₹200 is valid."}</small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Minimum Booking Amount</label>
                <input type="number" min="0" step="0.01" className="form-control" name="minBookingAmount" value={formData.minBookingAmount} onChange={change} />
                <small className="text-secondary">Optional minimum eligible booking value.</small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Maximum Discount</label>
                <input type="number" min="0.01" step="0.01" disabled={formData.discountType !== "percentage"} className="form-control" name="maxDiscount" value={formData.maxDiscount} onChange={change} />
                <small className="text-secondary">Optional cap for percentage coupons.</small>
              </div>
            </div>
          </div>

          <div className="form-check form-switch mb-4">
            <input type="checkbox" className="form-check-input" name="newCustomerOnly" checked={formData.newCustomerOnly} onChange={change} />
            <label className="form-check-label"><FaToggleOn className="me-2 text-success" />New Customers Only</label>
            <small className="d-block text-secondary">Use this for a first-booking customer campaign.</small>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label"><FaCalendarAlt className="me-2" />Start Date</label>
              <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={change} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label"><FaCalendarAlt className="me-2" />End Date</label>
              <input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={change} required />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Global Usage Limit</label>
              <input type="number" min="1" step="1" className="form-control" name="usageLimit" value={formData.usageLimit} onChange={change} placeholder="Unlimited" />
              <small className="text-secondary">Maximum total customer redemptions. Empty = unlimited.</small>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Per Customer Limit</label>
              <input type="number" min="1" step="1" className="form-control" name="perUserLimit" value={formData.perUserLimit} onChange={change} required />
              <small className="text-secondary">How many times one customer can use this coupon.</small>
            </div>
          </div>

          <div className="form-check form-switch mb-4">
            <input type="checkbox" className="form-check-input" name="isActive" checked={formData.isActive} onChange={change} />
            <label className="form-check-label"><FaToggleOn className="me-2 text-warning" />Active Campaign</label>
            <small className="d-block text-secondary">Turn off to pause the coupon without deleting its history.</small>
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold py-2" disabled={loading}>{loading ? "Creating..." : "Create Customer Coupon"}</button>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;
