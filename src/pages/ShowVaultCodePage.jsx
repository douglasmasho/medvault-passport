import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useAuth } from "../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { useDarkMode } from "../contexts/darkModeContext";
import { QrCode, Download, Printer } from "lucide-react";
import QRCode from "qrcode";

const ShowVaultCodePage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const qrCodeRef = useRef(null);

  // Centralized styling object that checks dark mode once
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600",
    card: isDarkMode ? "bg-gray-800" : "bg-gray-50",
  };

  useEffect(() => {
    const generateQRCode = async () => {
      if (!currentUser?.uid) return;

      try {
        setIsGenerating(true);
        const url = `https://medvaultapp.web.app/vault-page/${currentUser.uid}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [currentUser?.uid]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.download = `medvault-qr-code-${currentUser?.uid}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handlePrint = () => {
    if (!qrCodeDataUrl) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>MedVault QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            img {
              max-width: 400px;
              height: auto;
            }
            .text {
              margin-top: 20px;
              text-align: center;
              max-width: 500px;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <img src="${qrCodeDataUrl}" alt="MedVault QR Code" />
          <div class="text">
            <p>Show this to your doctor so that they can access your medical history.</p>
            <p>You can also print this QR code to keep it on you at all times.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${styles.container}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Show Vault Code"
            icon={<QrCode style={{ marginRight: "10px" }} color="#56BB6E" />}
          />

          <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`shadow-lg rounded-xl p-6 border ${styles.container} ${styles.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex flex-col items-center justify-center py-8">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#56BB6E] mb-4"></div>
                    <p className={styles.textSecondary}>Generating QR Code...</p>
                  </div>
                ) : (
                  <>
                    <div
                      ref={qrCodeRef}
                      className="bg-white p-6 rounded-lg shadow-lg mb-6"
                      style={{ maxWidth: "450px" }}
                    >
                      <img
                        src={qrCodeDataUrl}
                        alt="MedVault QR Code"
                        className="w-full h-auto"
                        style={{ maxWidth: "400px", height: "auto" }}
                      />
                    </div>

                    <div className="flex gap-4 mb-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-[#56BB6E] text-white rounded-lg font-medium hover:bg-[#4aa85c] transition-colors"
                      >
                        <Download size={20} />
                        Download
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        <Printer size={20} />
                        Print
                      </motion.button>
                    </div>

                    <div className={`text-center max-w-2xl ${styles.textSecondary}`}>
                      <p className="text-lg leading-relaxed">
                        Show this to your doctor so that they can access your medical history. You can also print this QR code to keep it on you at all times.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </main>
        </>
      )}
    </div>
  );
};

export default ShowVaultCodePage;


