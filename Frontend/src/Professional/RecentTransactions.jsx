import { FaArrowRight, FaArrowTrendDown, FaArrowTrendUp, FaWallet } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useGetTransaction from "../hooks/useGetTransaction";

const RecentTransactions = ({ professionalId }) => {
  const navigate = useNavigate();
  const { transactions, loading } = useGetTransaction(professionalId, 5);

  return (
    <section className="card recent-transactions border-0 rounded-4 h-100">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1">Recent Transactions</h5>
            <small className="text-muted">Latest wallet activity</small>
          </div>
          <button
            type="button"
            onClick={() => navigate("/professional/transaction-history")}
            className="btn btn-sm btn-outline-primary rounded-pill px-3"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="recent-transactions__state">
            <ClipLoader size={24} color="#0d6efd" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="recent-transactions__state text-center">
            <FaWallet className="text-primary mb-2" size={26} />
            <div className="fw-semibold small">No transactions yet</div>
            <small className="text-muted">Completed work and withdrawals will appear here.</small>
          </div>
        ) : (
          <div className="recent-transactions__list">
            {transactions.map((transaction) => {
              const isCredit = transaction.type === "CREDIT";
              const amount = isCredit
                ? transaction.professionalAmount
                : transaction.paymentProof?.amount;

              return (
                <button
                  type="button"
                  key={transaction._id}
                  className="recent-transactions__item"
                  onClick={() => navigate("/professional/transaction-history")}
                >
                  <span className={`recent-transactions__icon ${isCredit ? "is-credit" : "is-debit"}`}>
                    {isCredit ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                  </span>
                  <span className="flex-grow-1 text-start overflow-hidden">
                    <span className="d-block fw-semibold text-dark small">
                      {isCredit ? "Booking earning" : "Withdrawal"}
                    </span>
                    <span className="d-block text-muted recent-transactions__date">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span className={`fw-bold small ${isCredit ? "text-success" : "text-warning"}`}>
                    {isCredit ? "+" : "-"}₹{Number(amount || 0).toFixed(2)}
                  </span>
                  <FaArrowRight className="text-primary ms-1" size={12} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentTransactions;
