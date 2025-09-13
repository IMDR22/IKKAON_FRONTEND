import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/homePage.css";
import logo from "../assets/MINI_LOGO.png";
import regular from "../assets/regular_pastil.jpg";
import pastilEgg from "../assets/pastil_egg.jpg";
import pastilHotdog from "../assets/pastil_hotdog.jpg";
import { BACKEND_API } from "../API";
import CartReviewModal from "../component/CartReviewModal.jsx";
import PaymentModal from "../component/paymentModal.jsx";
import Swal from "sweetalert2";


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartReviewModalOpen, setIsCartReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_API}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/", { replace: true });
        }
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (product) => {
    console.log('Prev Cart:', cart);  // Log the current state of the cart
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product_id === product.product_id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  
  
  

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  const openCartReviewModal = () => {
    setIsCartReviewModalOpen(true);
  };

  const openPaymentModal = () => {
    setIsCartReviewModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const productImages = {
    1: regular,
    2: pastilHotdog,
    3: pastilEgg,
  };


const placeOrder = async (method) => {
  setPlacingOrder(true);
  try {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!method || !["Cash", "GCash"].includes(method)) {
      alert("Please select a valid payment method (Cash or GCash).");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in again.");
      navigate("/", { replace: true });
      return;
    }

    // 1) Create order
    const orderResponse = await axios.post(
      `${BACKEND_API}/orders`,
      {
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: method,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!orderResponse?.data?.order_id) {
      throw new Error("Order creation failed. Please try again.");
    }

    const orderId = orderResponse.data.order_id;

    // 2) Create payment (only if order succeeded)
    await createPayment(orderId, method);

    // 3) Update UI on success
    setOrderSuccess(orderResponse.data);
    setCart([]);

    // Close modal only after success
    setIsPaymentModalOpen(false);

    // Optional: nice success message
    // If you use SweetAlert2 here, import Swal at top of HomePage.jsx
    // (You already use it in PaymentModal)
    // eslint-disable-next-line no-undef
    Swal.fire({
      icon: "success",
      title: "Order Confirmed",
      text:
        method === "Cash"
          ? "You selected Cash on Delivery. Please prepare the exact amount. 💵"
          : "You selected GCash. Please make sure you’ve sent the payment. 📲",
    });
  } catch (error) {
    console.error("Error placing order:", error.response?.data || error.message);
    alert(error.response?.data?.error || "Failed to place order.");
  } finally {
    setPlacingOrder(false);
  }
};
  
  

  const createPayment = async (orderId, method) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_API}/payments`,
        {
          order_id: orderId,
          method, // use the argument, not state
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Payment record created:", response.data);
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error; 
    }
  };


  return (
    <div className="menu_container">
      <header className="menu_header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Filipino Delights Menu</h1>
        <button className="logout_button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="menu_list">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div className="menu_card" key={product.product_id}>
              <img
                src={productImages[product.product_id] || regular}
                alt={product.product_name}
                className="menu_img"
                loading="lazy"
              />
              <h2>{product.product_name}</h2>
              <p>{product.description}</p>
              <span className="price">₱{Number(product.price).toFixed(2)}</span>
              <button className="order_button" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {isCartReviewModalOpen && (
        <CartReviewModal
          cart={cart}
          onClose={() => setIsCartReviewModalOpen(false)}
          onProceedToPayment={openPaymentModal}
          onRemoveFromCart={handleRemoveFromCart}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          cart={cart}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirmPayment={(method) => {
            setPaymentMethod(method);
            placeOrder(method);
          }}
        />
      )}

      {cart.length > 0 && (
        <button className="view_cart_button" onClick={openCartReviewModal}>
          View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} item{cart.length > 1 ? "s" : ""})
        </button>
      )}

      {orderSuccess && (
        <div className="order-success">
          <h3>✅ Order successfully placed!</h3>

          <p className="highlight-id">
            📌 Order ID: <strong>{orderSuccess.order_id}</strong>
            <button
              onClick={() => {
                navigator.clipboard.writeText(orderSuccess.order_id);
                alert("Order ID copied to clipboard!");
              }}
              className="copy-btn"
            >
              Copy
            </button>
          </p>

          <p><strong>Total Amount:</strong> ₱{orderSuccess.totalAmount}</p>
          <p><strong>Payment Method:</strong> {orderSuccess.payment_method}</p>

          <p className="note">⚠️ Please screenshot or save your Order ID for tracking your order.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
