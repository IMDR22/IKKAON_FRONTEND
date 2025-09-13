// src/component/paymentModal.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import GcashQrImage from "../assets/gcash-qr.jpg";
import '../style/PaymentModal.css';

const PaymentModal = ({ onClose, onConfirmPayment, isSubmitting = false }) => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleConfirmPayment = () => {
    if (!selectedMethod) {
      Swal.fire({
        icon: "warning",
        title: "No Payment Method Selected",
        text: "Please select Cash or GCash before confirming.",
      });
      return;
    }
    onConfirmPayment(selectedMethod); // 🔑 send chosen method up
  };

  const renderPaymentDetails = () => {
    if (selectedMethod === "Cash") {
      return (
        <div className="payment-details">
          <h4>Instructions for Cash Payment:</h4>
          <p>
            Please prepare the exact amount. Please pay when you pick up your order. 💵
          </p>
        </div>
      );
    }

    if (selectedMethod === "GCash") {
      return (
        <div className="payment-details">
          <h4>Instructions for GCash Payment:</h4>
          <p>
            Please scan the QR code or use the number below to send your payment.  
            <strong> Don’t forget to screenshot your receipt for confirmation.</strong>
          </p>
          <div className="gcash-info">
            <img
              src={GcashQrImage}
              alt="GCash QR Code"
              style={{ maxWidth: "150px", margin: "10px 0" }}
            />
            <p>
              <strong>GCash Number:</strong> 0912-345-6789
              <br />
              <strong>Account Name:</strong> Juan dela Cruz
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-container">
        <h2>Confirm Payment</h2>
        <p>Please select your preferred payment method.</p>

        <div className="payment-options">
          <label>
            <input
              type="radio"
              value="Cash"
              checked={selectedMethod === "Cash"}
              onChange={() => setSelectedMethod("Cash")}
              disabled={isSubmitting}
            />
            Cash on Pickup
          </label>

          <label>
            <input
              type="radio"
              value="GCash"
              checked={selectedMethod === "GCash"}
              onChange={() => setSelectedMethod("GCash")}
              disabled={isSubmitting}
            />
            Gcash
          </label>
        </div>

        <div className="payment-details-container">{renderPaymentDetails()}</div>

        <div className="payment-modal-footer">
          <button onClick={onClose} disabled={isSubmitting}>
            Close
          </button>
          <button
            onClick={handleConfirmPayment}
            className="confirm-button"
            disabled={!selectedMethod || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
