import React from "react";
import "../style/cartReviewModal.css"; // Ensure you have the corresponding CSS file

const CartReviewModal = ({ cart, onClose, onProceedToPayment, onRemoveFromCart }) => {
  // Calculate the total price of the cart
  const totalPrice = cart.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0);

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal-container">
        <h2>Your Cart</h2>

        {/* Cart Items */}
        <ul className="cart-items-list">
          {cart.length === 0 ? (
            <li>Your cart is empty!</li>
          ) : (
            cart.map((item) => {
              const price = Number(item.price); // Ensure price is a number
              return (
                <li key={item.product_id} className="cart-item">
                  <div className="cart-item-info">
                    <h3>{item.product_name}</h3>
                    <p>Price: ₱{price ? price.toFixed(2) : "0.00"}</p> {/* Ensure price is displayed correctly */}
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="remove-button"
                    onClick={() => onRemoveFromCart(item.product_id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Total Price */}
        {cart.length > 0 && (
          <div className="cart-total">
            <p>Total: ₱{totalPrice ? totalPrice.toFixed(2) : "0.00"}</p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="cart-footer">
          <button onClick={onClose} className="close-button">
            Close
          </button>
          {cart.length > 0 && (
            <button onClick={onProceedToPayment} className="proceed-button">
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartReviewModal;
