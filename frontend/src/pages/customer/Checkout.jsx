import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '../../features/api/cartApi';
import { useInitiateCheckoutMutation, useVerifyAndCreateOrderMutation } from '../../features/api/orderApi';

const Checkout = () => {
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const [initiateCheckout, { isLoading: isInitiating }] = useInitiateCheckoutMutation();
  const [verifyOrder, { isLoading: isVerifying }] = useVerifyAndCreateOrderMutation();
  
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '',  zipCode: '', country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errorMsg, setErrorMsg] = useState('');

  // Load Razorpay Script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await initiateCheckout({ shippingAddress, paymentMethod }).unwrap();
      const { orderPreview, paymentIntent } = response.data;

      if (paymentMethod === 'COD') {
        // Formulate request for pure COD bypass
        await completeOrder(orderPreview, { method: 'COD' });
      } else if (paymentMethod === 'RAZORPAY') {
        // Trigger generic Razorpay overlay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Setup environment standard
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          name: 'Marketplace',
          description: 'Payment for your order',
          order_id: paymentIntent.id,
          handler: async function (response) {
            try {
              await completeOrder(orderPreview, {
                method: 'RAZORPAY',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });
            } catch (err) {
              setErrorMsg('Payment verification failed. Contact support.');
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: { color: "#3b82f6" }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
           setErrorMsg(response.error.description);
        });
        rzp.open();
      } else if (paymentMethod === 'WALLET') {
        await completeOrder(orderPreview, { method: 'WALLET' });
      }
    } catch (err) {
       setErrorMsg(err.data?.message || 'Checkout failed to initialize');
    }
  };

  const completeOrder = async (orderPreview, paymentData) => {
    try {
      await verifyOrder({ orderPreview, paymentData }).unwrap();
      navigate('/orders');
    } catch (err) {
      setErrorMsg(err.data?.message || 'Order creation failed');
    }
  };

  if (isCartLoading) return <div className="p-20 text-center">Loading cart details...</div>;
  
  const cart = cartData?.data?.cart;
  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.items.reduce((acc, item) => acc + (item.priceAtTime * item.quantity), 0);
  const total = subtotal + (subtotal > 500 ? 0 : 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black mb-8">Checkout</h1>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 font-medium">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="street" required placeholder="Street Address" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
              <input name="city" required placeholder="City" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
              <input name="state" required placeholder="State" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
              <input name="zipCode" required placeholder="Zip Code" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>

            <h2 className="text-xl font-bold mb-4 mt-8">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" value="RAZORPAY" checked={paymentMethod === 'RAZORPAY'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3 w-5 h-5 accent-primary-600" />
                <span className="font-medium">Credit/Debit Card, UPI, Netbanking (Razorpay)</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" value="WALLET" checked={paymentMethod === 'WALLET'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3 w-5 h-5 accent-primary-600" />
                <span className="font-medium">Marketplace Wallet</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3 w-5 h-5 accent-primary-600" />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </label>
            </div>
          </form>
        </div>

        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="space-y-2 mb-4 text-gray-600">
               <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal}</span></div>
               <div className="flex justify-between"><span>Delivery:</span><span>₹{subtotal > 500 ? 0 : 50}</span></div>
               <div className="flex justify-between font-bold text-gray-900 border-t pt-4 mt-4"><span>Total:</span><span>₹{total}</span></div>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={isInitiating || isVerifying}
              className="w-full mt-4 bg-primary-600 text-white font-bold py-4 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isInitiating || isVerifying ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
