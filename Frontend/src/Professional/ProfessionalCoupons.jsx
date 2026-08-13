import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server_url } from "../App";

const ProfessionalCoupons = () => {
  const [code, setCode] = useState("");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClaims = async () => {
    try {
      const res = await axios.get(`${server_url}/api/user/coupons/my-claims`, { withCredentials: true });
      setClaims(res.data.claims || []);
    } catch (error) { toast.error(error.response?.data?.message || "Unable to load coupons"); }
  };

  useEffect(() => { loadClaims(); }, []);

  const claim = async () => {
    if (!code.trim()) return toast.error("Enter a coupon code");
    try {
      setLoading(true);
      await axios.post(`${server_url}/api/user/coupons/claim`, { couponCode: code.trim().toUpperCase() }, { withCredentials: true });
      toast.success("Coupon claimed successfully");
      setCode("");
      await loadClaims();
    } catch (error) { toast.error(error.response?.data?.message || "Invalid coupon code"); }
    finally { setLoading(false); }
  };

  return <div className="card border-0 shadow-sm rounded-4 p-4">
    <h5 className="fw-bold mb-1">My Coupons</h5>
    <p className="text-muted small">Enter a coupon code shared by Fixkar. Available coupons are never exposed as a public list.</p>
    <div className="input-group mb-4"><input className="form-control text-uppercase" placeholder="Enter coupon code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} /><button className="btn btn-primary" disabled={loading} onClick={claim}>{loading ? "Checking..." : "Claim"}</button></div>
    {claims.length === 0 ? <div className="text-muted small">No claimed coupons yet.</div> : claims.map((claimItem) => <div key={claimItem._id} className="border rounded-3 p-3 mb-2"><div className="d-flex justify-content-between"><strong>{claimItem.offerId?.offerTitle || "Coupon"}</strong><span className="badge bg-primary">{claimItem.couponCode}</span></div><small className="text-muted">Claimed {new Date(claimItem.claimedAt).toLocaleDateString()}</small></div>)}
  </div>;
};

export default ProfessionalCoupons;
