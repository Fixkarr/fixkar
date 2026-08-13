import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server_url } from "../App";

const rankLabel = { NEWCOMER: "Newcomer", BRONZE: "Bronze", SILVER: "Silver", DIAMOND: "Diamond" };

const ProfessionalCoupons = () => {
  const [code, setCode] = useState("");
  const [claims, setClaims] = useState([]);
  const [achievements, setAchievements] = useState({ completedBookings: 0, rank: "NEWCOMER" });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [claimsRes, userRes] = await Promise.all([
        axios.get(`${server_url}/api/user/coupons/my-claims`, { withCredentials: true }),
        axios.get(`${server_url}/api/user/current`, { withCredentials: true }),
      ]);
      setClaims(claimsRes.data.claims || []);
      setAchievements(userRes.data?.user?.achievements || { completedBookings: 0, rank: "NEWCOMER" });
    } catch (error) { toast.error(error.response?.data?.message || "Unable to load reward campaigns"); }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const socket = window?.socket;
    if (!socket) return undefined;
    const refresh = () => loadData();
    socket.on("professionalMilestoneUnlocked", refresh);
    return () => socket.off("professionalMilestoneUnlocked", refresh);
  }, []);

  const claim = async () => {
    if (!code.trim()) return toast.error("Enter a coupon code");
    try {
      setLoading(true);
      const response = await axios.post(`${server_url}/api/user/coupons/claim`, { couponCode: code.trim().toUpperCase() }, { withCredentials: true });
      toast.success(response.data?.message || "Reward campaign joined");
      setCode("");
      await loadData();
    } catch (error) { toast.error(error.response?.data?.message || "Invalid coupon code"); }
    finally { setLoading(false); }
  };

  return <div>
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div><h5 className="fw-bold mb-1">Professional Rewards</h5><p className="text-muted small mb-0">Join a campaign with its code. Credits unlock only after the required completed-booking milestones.</p></div>
      <span className="badge rounded-pill bg-primary px-3 py-2">{rankLabel[achievements.rank] || "Newcomer"}</span>
    </div>

    <div className="border rounded-4 p-3 mb-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2"><strong>{achievements.completedBookings || 0} completed bookings</strong><span className="small fw-semibold">{rankLabel[achievements.rank] || "Newcomer"}</span></div>
      <div className="progress" style={{ height: 8 }}><div className="progress-bar" style={{ width: `${Math.min(100, ((achievements.completedBookings || 0) / 10) * 100)}%` }} /></div>
      <div className="d-flex justify-content-between mt-2 small text-muted"><span>🥉 Bronze · 1</span><span>🥈 Silver · 5</span><span>💎 Diamond · 10</span></div>
    </div>

    <div className="input-group mb-4"><input className="form-control text-uppercase" placeholder="Enter campaign code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} /><button className="btn btn-primary" disabled={loading} onClick={claim}>{loading ? "Checking..." : "Join Campaign"}</button></div>

    {claims.length === 0 ? <div className="text-muted small">No reward campaigns claimed yet.</div> : claims.map((claimItem) => {
      const offer = claimItem.offerId;
      const milestones = offer?.milestones || [];
      return <div key={claimItem._id} className="border rounded-3 p-3 mb-3">
        <div className="d-flex justify-content-between align-items-start gap-2"><div><strong>{offer?.offerTitle || "Reward Campaign"}</strong><div className="small text-muted">Claimed {new Date(claimItem.claimedAt).toLocaleDateString()}</div></div><span className="badge bg-primary">{claimItem.couponCode}</span></div>
        {milestones.length > 0 && <div className="mt-3 d-flex flex-column gap-2">{milestones.map((m) => { const unlocked = (claimItem.rewardedMilestones || []).includes(Number(m.bookingCount)); return <div key={`${claimItem._id}-${m.bookingCount}`} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2"><div><strong>{m.badge}</strong><div className="small text-muted">{m.title || `${m.bookingCount} completed ${m.bookingCount === 1 ? "booking" : "bookings"}`}</div></div><div className={unlocked ? "text-success fw-bold" : "text-primary fw-semibold"}>{unlocked ? "✓ Unlocked" : `+${m.rewardCredits} credits`}</div></div>; })}</div>}
      </div>;
    })}
  </div>;
};

export default ProfessionalCoupons;
