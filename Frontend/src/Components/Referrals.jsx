import React, { useState , useEffect} from "react";
import {
  FaArrowRight,
  FaCheck,
  FaClipboard,
  FaCoins,
  FaCopy,
  FaGift,
  FaLink,
  FaPeopleGroup,
  FaShareNodes,
  FaUserCheck,
  FaUserClock,
  FaUserGroup,
  FaUserPlus,
  FaUsers,
  FaWallet,
  FaWandSparkles,
  FaXmark,
} from "react-icons/fa6";
import "../css/Referrals.css";
import { formatDate } from "../utils/formatTime&Date";
import axios from 'axios'
import { server_url } from "../App";
import { useNavigate } from "react-router-dom";

const Referrals = () => {
  const [copied, setCopied] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();
  const [referralData, setReferralData] = useState({
    referralCode: "",
    links: {
      customer:
        "",

      professional:
        "",
    },
    stats: {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      reversedReferrals: 0,
      totalEarned: 0,
    },
    rewardCredits: null,
    referrals: [],
  });

  useEffect(()=>{
    const getReferrals = async ()=>{
        const referralsResponse = await axios.get(`${server_url}/api/referral/get-my-referral`, {withCredentials : true});
        setReferralData(referralsResponse?.data?.referral)
    }

    getReferrals();
  },[])


  const copyLink = async (type, link) => {
    try {
      await navigator.clipboard.writeText(link);

      setCopied(type);

      setTimeout(() => {
        setCopied(null);
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const shareLink = async (type, link) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Fixkar",
          text:
            type === "customer"
              ? "Join Fixkar and get reliable local services."
              : "Join Fixkar as a professional and grow your service business.",
          url: link,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }

      return;
    }

    await copyLink(type, link);
  };


  const getStatusLabel = (status) => {
    switch (status) {
      case "REWARDED":
        return "Rewarded";

      case "REGISTERED":
        return "Pending";

      case "REVERSED":
        return "Reversed";

      case "ELIGIBLE":
        return "Eligible";

      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "REWARDED":
        return <FaCheck />;

      case "REGISTERED":
        return <FaUserClock />;

      case "REVERSED":
        return <FaXmark />;

      default:
        return <FaUserCheck />;
    }
  };

  return (
    <main className="referrals-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="referrals-hero">

        <div className="referrals-hero-glow referrals-glow-one" />
        <div className="referrals-hero-glow referrals-glow-two" />

        <div className="referrals-hero-content">

          <div className="referrals-eyebrow">
            <FaWandSparkles />
            <span>FIXKAR REFER & EARN</span>
          </div>

          <h1>
            Refer friends.
            <br />
            <h3>Earn rewards.</h3>
          </h1>

          <p>
            Share Fixkar with your friends and earn exciting
            rewards when they complete their first booking.
          </p>

          <div className="referrals-code-box">
            <div className="referrals-code-icon">
              <FaLink />
            </div>

            <div>
              <span>Your referral code</span>
              <strong>{referralData.referralCode}</strong>
            </div>
          </div>

        </div>

        <div className="referrals-hero-visual">

          <div className="referrals-orbit referrals-orbit-one" />
          <div className="referrals-orbit referrals-orbit-two" />

          <div className="referrals-gift-card">
            <div className="referrals-gift-main">
              <FaGift />
            </div>

            <span>Earn up to</span>

            <strong>₹100</strong>

            <small>per successful referral</small>
          </div>

          <div className="referrals-floating-coin coin-one">
            <FaCoins />
          </div>

          <div className="referrals-floating-coin coin-two">
            <FaCoins />
          </div>

          <div className="referrals-floating-user">
            <FaUserPlus />
          </div>

        </div>

      </section>


      {/* =========================================
          STATS
      ========================================= */}

      <section className="referrals-stats">

        <div className="referral-stat-card">
          <div className="referral-stat-icon">
            <FaUsers />
          </div>

          <div>
            <span>Total Referrals</span>
            <strong>
              {referralData.stats.totalReferrals}
            </strong>
          </div>
        </div>

        <div className="referral-stat-card">
          <div className="referral-stat-icon">
            <FaUserCheck />
          </div>

          <div>
            <span>Successful</span>
            <strong>
              {referralData.stats.successfulReferrals}
            </strong>
          </div>
        </div>

        <div className="referral-stat-card">
          <div className="referral-stat-icon">
            <FaUserClock />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {referralData.stats.pendingReferrals}
            </strong>
          </div>
        </div>

        <div className="referral-stat-card referral-stat-highlight">
          <div className="referral-stat-icon">
            <FaWallet />
          </div>

          <div>
            <span>Total Earned</span>
            <strong>
              ₹{referralData.stats.totalEarned}
            </strong>
          </div>
        </div>

      </section>


      {/* =========================================
          SHARE LINKS
      ========================================= */}

      <section className="referrals-section">

        <div className="referrals-section-heading">
          <div>
            <span className="referrals-section-kicker">
              SHARE & EARN
            </span>

            <h2>Choose who you want to refer</h2>

            <p>
              Use the right link depending on whether you're
              referring a customer or a professional.
            </p>
          </div>
        </div>


        <div className="referral-link-grid">

          {/* Customer */}

          <article className="referral-link-card referral-customer-card">

            <div className="referral-link-card-top">

              <div className="referral-role-icon">
                <FaUserGroup />
              </div>

              <div className="referral-role-reward">
                <span>Earn</span>
                <strong>₹20</strong>
              </div>

            </div>

            <h3>Refer a Customer</h3>

            <p>
              Invite someone looking for trusted local
              service professionals.
            </p>

            <div className="referral-url-box">
              <FaLink />

              <span>
                {referralData.links.customer}
              </span>
            </div>

            <div className="referral-card-actions">

              <button
                type="button"
                className="referral-copy-btn"
                onClick={() =>
                  copyLink(
                    "customer",
                    referralData.links.customer
                  )
                }
              >
                {copied === "customer" ? (
                  <>
                    <FaCheck />
                    Copied
                  </>
                ) : (
                  <>
                    <FaCopy />
                    Copy Link
                  </>
                )}
              </button>

              <button
                type="button"
                className="referral-share-btn"
                onClick={() =>
                  shareLink(
                    "customer",
                    referralData.links.customer
                  )
                }
              >
                <FaShareNodes />
              </button>

            </div>

          </article>


          {/* Professional */}

          <article className="referral-link-card referral-professional-card">

            <div className="referral-link-card-top">

              <div className="referral-role-icon">
                <FaPeopleGroup />
              </div>

              <div className="referral-role-reward">
                <span>Earn</span>
                <strong>₹100</strong>
              </div>

            </div>

            <h3>Refer a Professional</h3>

            <p>
              Invite skilled professionals to join Fixkar
              and grow their business.
            </p>

            <div className="referral-url-box">
              <FaLink />

              <span>
                {referralData.links.professional}
              </span>
            </div>

            <div className="referral-card-actions">

              <button
                type="button"
                className="referral-copy-btn"
                onClick={() =>
                  copyLink(
                    "professional",
                    referralData.links.professional
                  )
                }
              >
                {copied === "professional" ? (
                  <>
                    <FaCheck />
                    Copied
                  </>
                ) : (
                  <>
                    <FaCopy />
                    Copy Link
                  </>
                )}
              </button>

              <button
                type="button"
                className="referral-share-btn"
                onClick={() =>
                  shareLink(
                    "professional",
                    referralData.links.professional
                  )
                }
              >
                <FaShareNodes />
              </button>

            </div>

          </article>

        </div>

      </section>


      {/* =========================================
          CUSTOMER CREDITS
      ========================================= */}

      {referralData.rewardCredits !== null &&
        referralData.rewardCredits !== undefined ? (
          <section className="referral-credit-banner">

            <div className="referral-credit-icon">
              <FaCoins />
            </div>

            <div className="referral-credit-content">
              <span>Your available reward credits</span>

              <strong>
                ₹{referralData.rewardCredits}
              </strong>
            </div>

            <button type="button" onClick={()=> navigate('/customer/hire-professionals')}>
              Use Credits
              <FaArrowRight />
            </button>

          </section>
        ) :  <section className="referral-credit-banner referral-wallet-banner">

    <div className="referral-credit-icon">
      <FaWallet />
    </div>

    <div className="referral-credit-content">
      <span>Your referral rewards</span>

      <strong>
        Go to your wallet
      </strong>

      <p>
        Your referral rewards will be transferred to your wallet
        as pending balance and will be available for withdrawal
        according to the wallet terms.
      </p>
    </div>

    <FaArrowRight className="referral-wallet-arrow" />

  </section>
  
  }


      {/* =========================================
          HISTORY
      ========================================= */}

      <section className="referrals-section referrals-history-section">

        <div className="referrals-section-heading history-heading">

          <div>
            <span className="referrals-section-kicker">
              ACTIVITY
            </span>

            <h2>Referral history</h2>

            <p>
              Keep track of everyone you've referred and
              your earned rewards.
            </p>
          </div>

          <div className="referral-history-count">
            <FaUserGroup />
            <span>
              {referralData.referrals.length} referrals
            </span>
          </div>

        </div>


        {referralData.referrals.length > 0 ? (

          <div className="referrals-history-list">

            {referralData.referrals.map((referral) => (

              <article
                className="referral-history-card"
                key={referral.id}
              >

                <div className="referral-history-user-icon">
                  {referral.referredRole === "professional" ? (
                    <FaPeopleGroup />
                  ) : (
                    <FaUserGroup />
                  )}
                </div>

                <div className="referral-history-user">

                  <strong>
                    {referral.referredUser?.fullName ||
                      "User"}
                  </strong>

                  <span>
                    {referral.referredRole ===
                    "professional"
                      ? "Professional"
                      : "Customer"}
                  </span>

                </div>

                <div className="referral-history-date">
                  <span>Joined</span>
                  <strong>
                    {formatDate(
                      referral.createdAt
                    )}
                  </strong>
                </div>

                <div className="referral-history-reward">

                  <span>Reward</span>

                  <strong>
                    {referral.status === "REWARDED"
                      ? `₹${referral.rewardAmount}`
                      : "—"}
                  </strong>

                </div>

                <div
                  className={`referral-status referral-status-${referral.status.toLowerCase()}`}
                >
                  {getStatusIcon(
                    referral.status
                  )}

                  <span>
                    {getStatusLabel(
                      referral.status
                    )}
                  </span>
                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="referrals-empty">

            <div className="referrals-empty-icon">
              <FaUserPlus />
            </div>

            <h3>No referrals yet</h3>

            <p>
              Share your referral link and start earning
              rewards.
            </p>

          </div>

        )}

      </section>

    </main>
  );
};

export default Referrals;