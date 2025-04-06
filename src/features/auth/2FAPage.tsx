import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";

interface TwoFactorSetupProps {
  userId: string;
  onComplete: (success: boolean) => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  userId,
  onComplete,
}) => {
  const [step, setStep] = useState<"generate" | "verify">("generate");
  const [secret, setSecret] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recoveryKeys, setRecoveryKeys] = useState<string[]>([]);

  // Generate 2FA secret when component mounts
  useEffect(() => {
    const generateSecret = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would call your API here
        // Simulate API call to generate secret
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock generated secret and QR code URL
        const mockSecret = "JBSWY3DPEHPK3PXP"; // Example TOTP secret
        const mockAppName = "YourPaymentGateway";
        const mockQrUrl = `otpauth://totp/${mockAppName}:${userId}?secret=${mockSecret}&issuer=${mockAppName}`;

        setSecret(mockSecret);
        setQrUrl(mockQrUrl);

        // Generate recovery keys
        const mockRecoveryKeys = [
          "ABCD-EFGH-IJKL-MNOP",
          "QRST-UVWX-YZ12-3456",
          "WXYZ-7890-ABCD-EFGH",
          "IJKL-MNOP-QRST-UVWX",
          "YZ12-3456-WXYZ-7890",
        ];
        setRecoveryKeys(mockRecoveryKeys);
      } catch (err: any) {
        setError("Failed to generate 2FA secret. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (step === "generate") {
      generateSecret();
    }
  }, [userId, step]);

  // Render QR code to canvas
  useEffect(() => {
    if (qrUrl && step === "generate") {
      const canvas = document.getElementById("qrcode") as HTMLCanvasElement;
      if (canvas) {
        QRCode.toCanvas(canvas, qrUrl, { width: 200 }, (error) => {
          if (error) console.error("Error generating QR code:", error);
        });
      }
    }
  }, [qrUrl, step]);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call your API here to verify the code
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock verification (in real app, server would validate against TOTP algorithm)
      // For demo purposes, accept any 6-digit code
      if (/^\d{6}$/.test(verificationCode)) {
        onComplete(true);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onComplete(false);
  };

  const copyToClipboard = (text: string, type: "secret" | "keys") => {
    navigator.clipboard.writeText(text);
    alert(
      `${type === "secret" ? "Secret" : "Recovery keys"} copied to clipboard!`
    );
  };

  if (isLoading && step === "generate") {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Generating your 2FA credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {step === "generate"
            ? "Set Up Two-Factor Authentication"
            : "Verify Your Code"}
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === "generate" && (
          <div>
            <p className="mb-4 text-gray-600">
              Two-factor authentication adds an extra layer of security to your
              account. Follow these steps to set it up:
            </p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Step 1: Scan QR Code
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, Microsoft Authenticator, etc.).
              </p>
              <div className="flex justify-center mb-4">
                <canvas
                  id="qrcode"
                  className="border border-gray-200 rounded"
                ></canvas>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Step 2: Or Enter This Code Manually
              </h3>
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                <code className="text-sm font-mono break-all">{secret}</code>
                <button
                  onClick={() => copyToClipboard(secret, "secret")}
                  className="text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Step 3: Save Your Recovery Keys
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Keep these recovery keys in a safe place. You can use them to
                access your account if you lose your device.
              </p>
              <div className="bg-gray-50 p-3 rounded mb-2">
                <div className="grid grid-cols-1 gap-2">
                  {recoveryKeys.map((key, index) => (
                    <code key={index} className="text-sm font-mono">
                      {key}
                    </code>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(recoveryKeys.join("\n"), "keys")}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy all recovery keys
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep("verify")}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div>
            <p className="mb-4 text-gray-600">
              Enter the 6-digit verification code from your authenticator app to
              complete the setup.
            </p>

            <div className="mb-6">
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                maxLength={6}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStep("generate")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Verifying..." : "Verify and Enable 2FA"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TwoFactorSetup;
