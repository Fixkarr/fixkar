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
    } catch (error) { toast.error(error.response?.data?.message || "Unable to load reward campaigns"); }
  };

  useEffect(() => { loadClaims(); }, []);

  const claim = async () => {
    if (!code.trim()) return toast.error("Enter a coupon code");
    try {
      setLoading(true);
      await axios.post(`${server_url}/api/user/coupons/claim`, { couponCode: code.trim().toUpperCase() }, { withCredentials: true });
      toast.success("Campaign claimed. Complete the milestones to unlock rewards.");
      setCode("");
      await loadClaims();
    } catch (error) { toast.error(error.response?.data?.message || "Invalid coupon code"); }
    finally { setLoading(false); }
  };

  return <div className="card border-0 shadow-sm rounded-4 p-4">
    <h5 className="fw-bold mb-1">Professional Rewards</h5>
    <p className="text-muted small">Enter a campaign code shared by Fixkar. Claiming enrolls you; wallet credits are unlocked only after the required completed-booking milestones.</p>
    <div className="input-group mb-4"><input className="form-control text-uppercase" placeholder="Enter campaign code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} /><button className="btn btn-primary" disabled={loading} onClick={claim}>{loading ? "Checking..." : "Claim"}</button></div>
    {claims.length === 0 ? <div className="text-muted small">No reward campaigns claimed yet.</div> : claims.map((claimItem) => {
      const offer = claimItem.offerId;
      const milestones = offer?.milestones || [];
      return <div key={claimItem._id} className="border rounded-3 p-3 mb-3">
        <div className="d-flex justify-content-between align-items-start gap-2"><div><strong>{offer?.offerTitle || "Reward Campaign"}</strong><div className="small text-muted">Claimed {new Date(claimItem.claimedAt).toLocaleDateString()}</div></div><span className="badge bg-primary">{claimItem.couponCode}</span></div>
        {milestones.length > 0 && <div className="mt-3 d-flex flex-column gap-2">{milestones.map((m) => { const unlocked = (claimItem.rewardedMilestones || []).includes(Number(m.bookingCount)); return <div key={`${claimItem._id}-${m.bookingCount}`} className={`d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 ${unlocked ? "bg-light" : ""}`}><div><strong>{m.badge}</strong><div className="small text-muted">{m.bookingCount} completed {m.bookingCount === 1 ? "booking" : "bookings"}</div></div><div className={unlocked ? "text-success fw-bold" : "text-primary fw-semibold"}>{unlocked ? "✓ Unlocked" : `+${m.rewardCredits} credits`}</div></div>; })}</div>}
      </div>;
    })}
  </div>;
};

export default ProfessionalCoupons;
