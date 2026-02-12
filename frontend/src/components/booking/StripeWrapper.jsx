import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from '../../config/config';

// Initialiser Stripe
const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

function StripeWrapper({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

export default StripeWrapper;