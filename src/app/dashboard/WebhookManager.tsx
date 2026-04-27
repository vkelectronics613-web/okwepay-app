'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WebhookManager({ initialWebhookUrl }: { initialWebhookUrl: string | null }) {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_url: webhookUrl || null }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Webhook URL saved successfully');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save webhook');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mt-8">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Webhook Configuration</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Receive real-time HTTP POST notifications when a payment succeeds.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
        <form onSubmit={handleSave} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="webhook" className="block text-sm font-medium text-gray-700">Webhook URL</label>
            <input
              type="url"
              id="webhook"
              placeholder="https://your-domain.com/api/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-5 w-5" /> Save</>}
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
