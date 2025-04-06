import { useState } from "react";
import { PaymentForm } from "./PaymentForm";
import { processPayment } from "../../services/mockPaymentProcessor";
import { PaymentDetails } from "../../types";
import { PaymentResultModal } from "./PaymentResultModal";

export const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    transaction?: any;
  } | null>(null);

  const handleSubmit = async (data: PaymentDetails) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const transaction = await processPayment(data);
      setResult({ success: true, transaction });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Payment failed",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Payment Gateway Integration
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Secure payment processing for your business
          </p>
        </div>

        <div className="flex justify-center">
          <PaymentForm /*onSubmit={handleSubmit} isProcessing={isProcessing}*/
          />
        </div>

        <PaymentResultModal
          isOpen={result !== null}
          onClose={() => setResult(null)}
          result={result}
        />
      </div>
    </div>
  );
};
