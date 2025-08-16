// Mock payment API for demonstration
// In production, this would be a proper backend endpoint

export const createPaymentIntent = async ({ phoneNumber, amount, currency, description }) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return a mock client secret
  // In production, this would create a real Stripe payment intent
  return {
    clientSecret: `pi_mock_${Date.now()}_secret_mock`,
    paymentIntentId: `pi_mock_${Date.now()}`,
    amount,
    currency,
    description
  };
};

// Mock Stripe payment confirmation
export const mockStripeConfirmPayment = async (clientSecret, paymentMethod) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful payment (90% success rate for demo)
  const isSuccess = Math.random() > 0.1;
  
  if (!isSuccess) {
    throw new Error('Your card was declined. Please try a different payment method.');
  }
  
  return {
    paymentIntent: {
      id: clientSecret.replace('_secret_mock', ''),
      status: 'succeeded',
      amount: 115,
      currency: 'usd'
    }
  };
};
