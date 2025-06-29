import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from '../header/header';
import Footer from '../footer/footer';
import { clearCartItem } from '../cart/cartslice';
import './Order.css';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Add error handling for Stripe initialization
if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe publishable key is missing. Please check your .env file.');
}

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const history = useHistory();
  const cart = useSelector((state) => state.cart);

  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : '');
    setCardComplete(event.complete);
    console.log('Card Element Change:', event); // For debugging
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const serverPort = process.env.REACT_APP_SERVER_PORT || 5001;
      console.log('Creating payment intent for amount:', cart.totalAmount + 50);
      const response = await fetch(`http://localhost:${serverPort}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: cart.totalAmount + 50 }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Payment failed');
      }

      console.log('Payment intent created, confirming card payment...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Customer Name', // You might want to get this from a form
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      console.log('Payment successful:', paymentIntent.id);
      dispatch(clearCartItem());
      alert('Payment successful! Your order has been placed.');
      history.push('/home');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Something went wrong with the payment');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-row">
        <div className="form-group">
          <label>Card Details</label>
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          <div className="test-card-info">
            <p>Test Card Numbers:</p>
            <ul>
              <li>Success: 4242 4242 4242 4242</li>
              <li>Requires Authentication: 4000 0025 0000 3155</li>
              <li>Decline: 4000 0000 0000 9995</li>
            </ul>
            <p>Use any future date for expiry and any 3 digits for CVC</p>
          </div>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>₹{cart.totalAmount}</span>
        </div>
        <div className="summary-item">
          <span>Delivery Fee:</span>
          <span>₹50</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>₹{cart.totalAmount + 50}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing} 
        className="pay-button"
      >
        {!stripe ? 'Loading...' : processing ? 'Processing...' : `Pay ₹${cart.totalAmount + 50}`}
      </button>
    </form>
  );
};

function Order() {
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    // Debug logging
    console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    
    // Check if Stripe is initializing
    stripePromise.then(
      (stripe) => {
        console.log('Stripe initialized successfully');
      },
      (error) => {
        console.error('Stripe initialization error:', error);
        setStripeError(error.message);
      }
    );
  }, []);

  return (
    <div className="order-page">
      <Header />
      <div className="order-container">
        <h2>Complete Your Order</h2>
        {stripeError ? (
          <div className="error-message">
            Error initializing payment system: {stripeError}
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Order; 