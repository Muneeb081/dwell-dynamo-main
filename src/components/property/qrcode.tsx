import React, { useEffect, useState } from 'react';
import { generateQRCode } from '@/lib/qr'; // adjust path as needed

interface QRCodeDisplayProps {
  propertyId: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ propertyId }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const url = await generateQRCode(propertyId);
        setQrUrl(url);
      } catch (err) {
        console.error('Failed to load QR Code.');
      }
    };
    fetchQRCode();
  }, [propertyId]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `property-${propertyId}.png`;
    link.click();
  };

  const handleCopy = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the "Copied" status after 2 seconds
    });
  };

  return (
    <div>
      <h3>QR Code for Property #{propertyId}</h3>
      {qrUrl && (
        <div>
          <img src={qrUrl} alt={`QR for property ${propertyId}`} />
          <div>
            <p>QR Code URL: {qrUrl}</p>
            <button onClick={handleDownload}>Download QR Code</button>
            <button onClick={handleCopy}>
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
