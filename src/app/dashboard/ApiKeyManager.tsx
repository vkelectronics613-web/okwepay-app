'use client';

import { useState } from 'react';

type ApiKey = {
  id: string;
  public_key: string;
  secret_key: string;
  created_at: Date;
};

export default function ApiKeyManager({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [loading, setLoading] = useState(false);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keys', { method: 'POST' });
      if (res.ok) {
        const newKey = await res.json();
        setKeys([newKey, ...keys]);
      }
    } catch (error) {
      console.error('Failed to generate keys', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg leading-6 font-medium text-gray-900">API Keys</h2>
        <button
          onClick={generateKeys}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate New API Key'}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {keys.length === 0 ? (
            <li className="px-4 py-4 sm:px-6 text-gray-500 text-sm">No API keys generated yet.</li>
          ) : (
            keys.map((key) => (
              <li key={key.id} className="px-4 py-4 sm:px-6">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 w-24">Public Key:</span>
                    <code className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded flex-1 ml-2">{key.public_key}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 w-24">Secret Key:</span>
                    <code className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded flex-1 ml-2">{key.secret_key}</code>
                  </div>
                  <div className="text-xs text-gray-400 text-right mt-2">
                    Created: {new Date(key.created_at).toLocaleString()}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
