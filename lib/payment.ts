// This is a mock payment processing module
// In a real application, this would integrate with Stripe, PayPal, etc.

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  cardDetails: CardDetails;
  billingAddress: Address;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Validate card number (very basic validation for demo)
  if (!request.cardDetails.cardNumber || request.cardDetails.cardNumber.length < 15) {
    return {
      success: false,
      error: 'Invalid card number'
    };
  }
  
  // Validate expiry date (very basic validation for demo)
  if (!request.cardDetails.expiryDate || !request.cardDetails.expiryDate.includes('/')) {
    return {
      success: false,
      error: 'Invalid expiry date'
    };
  }
  
  // Validate CVV (very basic validation for demo)
  if (!request.cardDetails.cvv || request.cardDetails.cvv.length < 3) {
    return {
      success: false,
      error: 'Invalid CVV'
    };
  }
  
  // For demo purposes, always succeed unless card number ends with '0000'
  if (request.cardDetails.cardNumber.endsWith('0000')) {
    return {
      success: false,
      error: 'Card declined. Please try a different payment method.'
    };
  }
  
  // Generate a fake transaction ID
  const transactionId = 'txn_' + Math.random().toString(36).substring(2, 15);
  
  return {
    success: true,
    transactionId
  };
}

// Function to validate a credit card (basic Luhn algorithm)
export function validateCreditCard(cardNumber: string): boolean {
  // Remove spaces and non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits in reverse
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

// Function to format credit card number with spaces
export function formatCreditCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const groups = [];
  
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  
  return groups.join(' ');
}

// Function to get card type based on number
export function getCardType(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(digits)) {
    return 'Visa';
  } else if (/^5[1-5]/.test(digits)) {
    return 'Mastercard';
  } else if (/^3[47]/.test(digits)) {
    return 'American Express';
  } else if (/^6(?:011|5)/.test(digits)) {
    return 'Discover';
  } else {
    return 'Unknown';
  }
}