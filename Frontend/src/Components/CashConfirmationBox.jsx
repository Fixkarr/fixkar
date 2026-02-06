import { FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const CashConfirmationBox = ({ amount}) => {

    const handleOnConfirm = async()=>{
        try {
            alert("Payment Recieved!")
        } catch (error) {
            
        }
    }       


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "16px" }}
      >
        <div className="card-body text-center p-4">
          
          {/* Icon */}
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #28a745, #20c997)",
              color: "#fff",
              fontSize: "28px",
            }}
          >
            <FaMoneyBillWave />
          </div>

          {/* English Text */}
          <h5 className="fw-bold mb-2">
            Confirm you received <span className="text-success">₹{amount}</span> cash
          </h5>

          {/* Hindi Text */}
          <p className="text-muted mb-4" style={{ fontSize: "15px" }}>
            कृपया पुष्टि करें कि आपको ग्राहक से{" "}
            <strong>₹{amount}</strong> नकद प्राप्त हो चुका है।
          </p>

          {/* Button */}
          <button
            className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ borderRadius: "10px", fontSize: "16px" }}
            onClick={handleOnConfirm}
          >
            <FaCheckCircle />
            Yes, I received
          </button>

        </div>
      </div>
    </div>
  );
};

export default CashConfirmationBox;
