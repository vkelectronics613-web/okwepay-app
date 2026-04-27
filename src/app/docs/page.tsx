import Link from 'next/link';
import { Activity, ArrowLeft, Code, Terminal, Webhook } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-3xl font-bold text-gray-900">OkwePay Developer Docs</h1>
          </div>
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="space-y-12">
          {/* Intro */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accepting okwebank Payments</h2>
            <p className="text-gray-600 mb-4 text-lg">
              OkwePay allows you to easily accept payments from any user on the OkweBank ecosystem. We provide a simple API to create payment sessions and a drop-in JavaScript SDK to display a beautiful checkout popup on your website.
            </p>
          </section>

          {/* Step 1 */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <Terminal className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Step 1: Create a Payment (Backend)</h2>
            </div>
            <p className="text-gray-600 mb-4">
              When a user is ready to checkout on your site, call our API from your secure backend to create a payment session.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400">
                <code>{`// Node.js Example
const response = await fetch('https://okwepay.vercel.app/api/create-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk_test_YOUR_SECRET_KEY'
  },
  body: JSON.stringify({
    amount: 150,
    description: 'Shopping Cart Order #1234'
  })
});

const { payment_id } = await response.json();
// Send this payment_id to your frontend frontend!`}</code>
              </pre>
            </div>
          </section>

          {/* Step 2 */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <Code className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Step 2: Drop-in UI (Frontend)</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Include our lightweight JavaScript SDK on your frontend. When the user clicks "Pay", trigger the popup modal using the <code className="bg-gray-100 px-1 rounded">payment_id</code> from Step 1.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
              <pre className="text-sm text-blue-400">
                <code>{`<!-- 1. Include the OkwePay SDK in your HTML -->
<script src="https://okwepay.vercel.app/checkout.js"></script>

<!-- 2. Create a Pay button -->
<button id="pay-btn">Pay with OkweBank</button>

<script>
  document.getElementById('pay-btn').onclick = function() {
    
    // 3. Trigger the checkout popup
    Okwepay.checkout({
      payment_id: "pay_123456789", // The ID you got from your backend
      onSuccess: function(data) {
        console.log("Payment successful!", data);
        alert("Thanks for your payment!");
        // Refresh your page or redirect to success page
      },
      onClose: function() {
        console.log("User closed the popup.");
      }
    });
    
  };
</script>`}</code>
              </pre>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Why embedded?</strong> The SDK creates a seamless iframe overlay on top of your website so the user never leaves your domain.
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <Webhook className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Step 3: Webhooks (Optional but Recommended)</h2>
            </div>
            <p className="text-gray-600 mb-4">
              While the frontend <code className="bg-gray-100 px-1 rounded">onSuccess</code> callback is useful for updating the UI, you should never trust the client to fulfill the order. Instead, rely on our Webhook system.
            </p>
            <p className="text-gray-600 mb-4">
              Configure your Webhook URL in your Dashboard. As soon as the user's OkweBank payment is verified and processed, we will immediately send a POST request to your server.
            </p>
            
            <h3 className="font-semibold text-gray-900 mt-6 mb-2">Webhook Payload Example</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-yellow-400">
                <code>{`// POST https://your-server.com/api/webhook

{
  "payment_id": "pay_530c14c3...",
  "amount": 150,
  "status": "success",
  "created_at": "2024-11-20T10:30:00Z"
}`}</code>
              </pre>
            </div>
            
            <h3 className="font-semibold text-gray-900 mt-6 mb-2">Manual Verification (Fallback)</h3>
            <p className="text-gray-600 mb-4 text-sm">
              If you don't use webhooks, you can verify a payment manually before fulfilling the order:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400">
                <code>{`// GET /api/verify-payment?payment_id=pay_123...
// Header: Authorization: Bearer sk_test_...

{
  "status": "success",
  "amount": 150
}`}</code>
              </pre>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
