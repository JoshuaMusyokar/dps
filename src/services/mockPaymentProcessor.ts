import { PaymentDetails } from "../types";
import {
  validateCardNumber,
  validateCVV,
  validateExpiry,
  maskSensitiveData,
} from "../utils/paymentSecurity";

export const processPayment = async (paymentDetails: PaymentDetails) => {
  // Validate payment details
  if (paymentDetails.method === "card") {
    if (!paymentDetails.card) throw new Error("Card details missing");

    if (!validateCardNumber(paymentDetails.card.number)) {
      throw new Error("Invalid card number");
    }

    if (!validateCVV(paymentDetails.card.cvv, paymentDetails.card.brand)) {
      throw new Error("Invalid CVV");
    }

    if (
      !validateExpiry(
        paymentDetails.card.expiryMonth,
        paymentDetails.card.expiryYear
      )
    ) {
      throw new Error("Card expired or invalid expiry date");
    }
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate random success/failure
  const isSuccess = Math.random() > 0.2; // 80% success rate

  if (!isSuccess) {
    throw new Error(
      "Payment failed. Please try again or use a different payment method."
    );
  }

  // Generate mock response
  return {
    id: `txn_${Math.random().toString(36).substring(2, 10)}`,
    status: "succeeded",
    amount: paymentDetails.amount,
    currency: paymentDetails.currency,
    method: paymentDetails.method,
    timestamp: new Date().toISOString(),
    maskedData: maskSensitiveData(paymentDetails),
  };
};
