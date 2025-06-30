import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  Truck 
} from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import { processPayment } from '@/lib/payment';

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'GB',
    phone: '',
  });
  
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'GB',
    phone: '',
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [billingIsSameAsShipping, setBillingIsSameAsShipping] = useState(true);
  
  // Calculate totals
  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;
  
  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update billing address if same as shipping
    if (billingIsSameAsShipping) {
      setBillingAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBillingSameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setBillingIsSameAsShipping(checked);
    
    if (checked) {
      setBillingAddress(shippingAddress);
    }
  };
  
  const validateShippingForm = () => {
    // Basic validation
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || 
        !shippingAddress.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };
  
  const validatePaymentForm = () => {
    // Basic validation
    if (!paymentDetails.cardNumber || !paymentDetails.cardName || 
        !paymentDetails.expiryDate || !paymentDetails.cvv) {
      setError('Please fill in all payment details');
      return false;
    }
    
    if (!billingIsSameAsShipping) {
      if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.address1 || 
          !billingAddress.city || !billingAddress.state || !billingAddress.postalCode) {
        setError('Please fill in all billing address fields');
        return false;
      }
    }
    
    return true;
  };
  
  const handleContinue = () => {
    setError('');
    
    if (step === 1 && !validateShippingForm()) {
      return;
    }
    
    if (step === 2 && !validatePaymentForm()) {
      return;
    }
    
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Process payment
      const paymentResult = await processPayment({
        amount: total,
        currency: 'GBP',
        cardDetails: paymentDetails,
        billingAddress: billingIsSameAsShipping ? shippingAddress : billingAddress
      });
      
      if (paymentResult.success) {
        // Create order in database
        // This would typically be done via an API call
        
        // Clear cart
        clearCart();
        
        // Move to success step
        setStep(4);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(paymentResult.error || 'Payment processing failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };
  
  // Shipping methods
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 4.99, days: '3-5 business days', free: subtotal >= 50 },
    { id: 'express', name: 'Express Shipping', price: 9.99, days: '1-2 business days', free: false },
  ];
  
  // Render different steps
  const renderShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={shippingAddress.firstName}
            onChange={handleShippingInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={shippingAddress.lastName}
            onChange={handleShippingInputChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address1">Address Line 1 *</Label>
        <Input
          id="address1"
          name="address1"
          value={shippingAddress.address1}
          onChange={handleShippingInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address2">Address Line 2</Label>
        <Input
          id="address2"
          name="address2"
          value={shippingAddress.address2}
          onChange={handleShippingInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={shippingAddress.city}
            onChange={handleShippingInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">County/State *</Label>
          <Input
            id="state"
            name="state"
            value={shippingAddress.state}
            onChange={handleShippingInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleShippingInputChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <select
            id="country"
            name="country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={shippingAddress.phone}
            onChange={handleShippingInputChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-gray-900">Shipping Method</h3>
        
        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <div 
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                shippingMethod === method.id ? 'border-lumicea-navy bg-lumicea-navy/5' : 'border-gray-200'
              }`}
              onClick={() => setShippingMethod(method.id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id={method.id}
                  name="shippingMethod"
                  value={method.id}
                  checked={shippingMethod === method.id}
                  onChange={() => setShippingMethod(method.id)}
                  className="h-4 w-4 text-lumicea-navy border-gray-300 focus:ring-lumicea-navy"
                />
                <label htmlFor={method.id} className="ml-3 cursor-pointer">
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.days}</div>
                </label>
              </div>
              <div className="font-medium">
                {method.free ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatCurrency(method.price)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-6">
        <Button onClick={() => navigate('/cart')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
        <Button onClick={handleContinue} className="lumicea-button-primary">
          Continue to Payment
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Card Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number *</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handlePaymentInputChange}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardName">Name on Card *</Label>
          <Input
            id="cardName"
            name="cardName"
            value={paymentDetails.cardName}
            onChange={handlePaymentInputChange}
            placeholder="John Smith"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handlePaymentInputChange}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">Security Code (CVV) *</Label>
            <Input
              id="cvv"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handlePaymentInputChange}
              placeholder="123"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
          <Lock className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="billingIsSame"
            checked={billingIsSameAsShipping}
            onChange={handleBillingSameChange}
            className="h-4 w-4 rounded border-gray-300 text-lumicea-navy focus:ring-lumicea-navy"
          />
          <Label htmlFor="billingIsSame">Billing address is same as shipping</Label>
        </div>
        
        {!billingIsSameAsShipping && (
          <div className="space-y-4 pt-2">
            <h3 className="font-medium text-gray-900">Billing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingFirstName">First Name *</Label>
                <Input
                  id="billingFirstName"
                  name="firstName"
                  value={billingAddress.firstName}
                  onChange={handleBillingInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingLastName">Last Name *</Label>
                <Input
                  id="billingLastName"
                  name="lastName"
                  value={billingAddress.lastName}
                  onChange={handleBillingInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingAddress1">Address Line 1 *</Label>
              <Input
                id="billingAddress1"
                name="address1"
                value={billingAddress.address1}
                onChange={handleBillingInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingAddress2">Address Line 2</Label>
              <Input
                id="billingAddress2"
                name="address2"
                value={billingAddress.address2}
                onChange={handleBillingInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City *</Label>
                <Input
                  id="billingCity"
                  name="city"
                  value={billingAddress.city}
                  onChange={handleBillingInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingState">County/State *</Label>
                <Input
                  id="billingState"
                  name="state"
                  value={billingAddress.state}
                  onChange={handleBillingInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPostalCode">Postal Code *</Label>
                <Input
                  id="billingPostalCode"
                  name="postalCode"
                  value={billingAddress.postalCode}
                  onChange={handleBillingInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCountry">Country *</Label>
                <select
                  id="billingCountry"
                  name="country"
                  value={billingAddress.country}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPhone">Phone Number *</Label>
                <Input
                  id="billingPhone"
                  name="phone"
                  value={billingAddress.phone}
                  onChange={handleBillingInputChange}
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shipping
        </Button>
        <Button onClick={handleContinue} className="lumicea-button-primary">
          Review Order
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Items</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center border-b pb-4">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.variant}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.price)}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shipping Address */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Shipping Address</h3>
          <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
            Edit
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
          <p>{shippingAddress.address1}</p>
          {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
          <p>{shippingAddress.country}</p>
          <p>{shippingAddress.phone}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Truck className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">
            {shippingMethods.find(m => m.id === shippingMethod)?.name} - 
            {shippingMethods.find(m => m.id === shippingMethod)?.free 
              ? ' Free' 
              : ` ${formatCurrency(shippingMethods.find(m => m.id === shippingMethod)?.price || 0)}`
            }
          </span>
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Payment Method</h3>
          <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
            Edit
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
          <div>
            <p className="font-medium">Credit/Debit Card</p>
            <p className="text-sm text-gray-600">
              {paymentDetails.cardNumber ? 
                `**** **** **** ${paymentDetails.cardNumber.slice(-4)}` : 
                'Card details will be entered on the next step'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Billing Address */}
      {!billingIsSameAsShipping && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Billing Address</h3>
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              Edit
            </Button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{billingAddress.firstName} {billingAddress.lastName}</p>
            <p>{billingAddress.address1}</p>
            {billingAddress.address2 && <p>{billingAddress.address2}</p>}
            <p>{billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}</p>
            <p>{billingAddress.country}</p>
            <p>{billingAddress.phone}</p>
          </div>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-gray-900">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="termsAgree"
            className="h-4 w-4 rounded border-gray-300 text-lumicea-navy focus:ring-lumicea-navy"
          />
          <Label htmlFor="termsAgree">
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </div>
        
        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Button>
          <Button 
            onClick={handlePlaceOrder} 
            className="lumicea-button-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
            {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
  
  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your order. We've received your payment and will process your order shortly.
        You will receive a confirmation email with your order details.
      </p>
      <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-md mx-auto">
        <p className="font-medium text-gray-900 mb-2">Order Reference: #LUM-{Math.floor(100000 + Math.random() * 900000)}</p>
        <p className="text-sm text-gray-600">Please keep this reference for your records.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/account/orders')} className="lumicea-button-primary">
          View Order Status
        </Button>
        <Button onClick={() => navigate('/')} variant="outline">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-lumicea-navy text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-lumicea-navy' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-lumicea-navy text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-lumicea-navy' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-lumicea-navy text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>
      )}
      
      {/* Step Content */}
      {step === 1 && renderShippingStep()}
      {step === 2 && renderPaymentStep()}
      {step === 3 && renderReviewStep()}
      {step === 4 && renderSuccessStep()}
    </div>
  );
}
