import { QRCodeCanvas } from "qrcode.react";

function WhatsAppQRCode() {
  const phoneNumber = "1234567890"; // replace with actual number
  const message = "Hello there!";
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg">
      <QRCodeCanvas
        value={whatsappLink}
        size={80}
        bgColor="#000000"
        fgColor="#ffffff"
        className="rounded-lg"
      />
    </div>
  );
}

export default WhatsAppQRCode;
