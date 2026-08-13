import React, { useEffect, useState } from "react";
import { FaSearch, FaTag, FaCalendarAlt, FaPercent, FaRupeeSign, FaCopy } from "react-icons/fa";
import axios from "axios";
import { server_url } from "../../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const adminpath = import.meta.env.VITE_ADMIN_PATH;

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getAllOffers = async () => { try { const res = await axios.get(`${server_url}/api/admin/get-all-offers`, { withCredentials: true }); setOffers(res?.data?.offers || []); } catch (error) { toast.error(error?.response?.data?.message || "Failed to load coupons"); } };
  useEffect(() => { getAllOffers(); }, []);
  const handleRemoveOffer = async (offerId) => { try { setLoading(true); const res = await axios.delete(`${server_url}/api/admin/delete-offer/${offerId}`, { withCredentials: true }); setOffers((current) => current.map((offer) => offer._id === offerId ? { ...offer, isActive: false, archivedAt: new Date().toISOString() } : offer)); toast.success(res.data.message || "Coupon archived"); } catch (error) { toast.error(error?.response?.data?.message || "Failed to archive coupon"); } finally { setLoading(false); } };
  const copyCode = async (code) => { try { await navigator.clipboard.writeText(code); toast.success("Coupon code copied"); } catch { toast.error("Unable to copy coupon code"); } };
  const filteredOffers = offers.filter((offer) => { const q = search.toLowerCase(); return offer.couponCode?.toLowerCase().includes(q) || offer.offerTitle?.toLowerCase().includes(q); });
  return <div className="container-fluid p-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
    <div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="fw-bold text-dark mb-1">Coupon Dashboard</h2><div className="text-muted small">Create, control and track coupon campaigns</div></div></div>
    <div className="mb-4"><div className="input-group" style={{ maxWidth: 420 }}><span className="input-group-text bg-white"><FaSearch /></span><input className="form-control" placeholder="Search by coupon code or title..." value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
    <div className="row">{filteredOffers.map((offer) => { const usageText = offer.usageLimit == null ? `${offer.usedCount || 0} used / Unlimited` : `${offer.usedCount || 0}/${offer.usageLimit}`; const usagePercent = offer.usageLimit ? Math.min(100, ((offer.usedCount || 0) / offer.usageLimit) * 100) : 0; return <div className="col-xl-4 col-md-6 mb-4" key={offer._id}><div className="p-4 h-100 shadow-sm bg-white" style={{ borderRadius: 16, border: "1px solid #e5e7eb" }}>
      <div className="d-flex justify-content-between align-items-start mb-3"><div><div className="small text-muted mb-1">COUPON CODE</div><div className="d-flex align-items-center gap-2"><span className="badge bg-primary fs-6">{offer.couponCode}</span><button className="btn btn-sm btn-light" onClick={() => copyCode(offer.couponCode)}><FaCopy /></button></div></div><span className={`badge ${offer.isActive ? "bg-success" : "bg-secondary"}`}>{offer.isActive ? "Active" : "Archived"}</span></div>
      <h5 className="fw-bold"><FaTag className="me-2 text-primary" />{offer.offerTitle}</h5>{offer.description && <p className="small text-muted">{offer.description}</p>}
      <div className="mb-3 text-success fw-bold fs-5">{offer.discountType === "percentage" ? <><FaPercent /> {offer.discountValue}% OFF {offer.maxDiscount != null && <span className="small text-muted">(Max ₹{offer.maxDiscount})</span>}</> : <><FaRupeeSign /> ₹{offer.discountValue} OFF</>}</div>
      <div className="small mb-3"><strong>Audience:</strong> {offer.audience?.join(" + ") || "—"}</div><div className="small text-muted mb-3"><strong>Services:</strong> {offer.serviceId?.length ? offer.serviceId.map((s) => s.name).join(", ") : "All services"}</div>
      <div className="small text-muted mb-3">Min booking: ₹{offer.minBookingAmount || 0}<br />Per user: {offer.perUserLimit || 1}<br />{offer.newCustomerOnly && <span className="text-warning fw-semibold">New customers only</span>}</div>
      <div className="mb-3"><div className="d-flex justify-content-between small mb-1"><span>Redemptions</span><span>{usageText}</span></div>{offer.usageLimit != null && <div className="progress" style={{ height: 6 }}><div className="progress-bar" style={{ width: `${usagePercent}%` }} /></div>}</div>
      <div className="small text-muted mb-3"><FaCalendarAlt className="me-1" />{new Date(offer.startDate).toLocaleDateString()} → {new Date(offer.endDate).toLocaleDateString()}</div>
      <button className="btn btn-outline-primary w-100" onClick={() => navigate(`${adminpath}/offer/update-offer/${offer._id}`)}>Update Coupon</button>{offer.isActive && <button className="btn btn-danger w-100 mt-2" disabled={loading} onClick={() => handleRemoveOffer(offer._id)}>Archive Coupon</button>}
    </div></div>; })}</div>{filteredOffers.length === 0 && <div className="text-center mt-5 text-muted">No coupons found</div>}
  </div>;
};
export default AllOffers;
