import QRCode from 'qrcode'; 

export const generateQRCode = async (propertyId: string): Promise<string> => {
  const url = `https://localhost:5173/property/${propertyId}`;
  try {
    const qrDataURL = await QRCode.toDataURL(url);
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
