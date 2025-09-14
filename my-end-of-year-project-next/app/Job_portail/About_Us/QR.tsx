

'use client';
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function LinkToQrCodePage() {
  const [url, setUrl] = useState('https://modest-integral-ibex.ngrok-free.app/');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">URL to QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter a full URL (e.g., https://google.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full max-w-md mb-6"
      />

      {url ? (
        <div className="bg-white p-4 rounded shadow">
          <QRCodeSVG
            value={url}
            size={300}
            includeMargin={true}
          />
          <p className="mt-4 text-center break-words">{url}</p>
        </div>
      ) : (
        <p>Enter a URL to generate its QR code.</p>
      )}
    </div>
  );
}
