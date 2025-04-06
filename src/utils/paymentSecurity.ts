// Luhn algorithm for card validation
export const validateCardNumber = (cardNumber: string): boolean => {
  let sum = 0;
  let alternate = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  return sum % 10 === 0;
};

// CVV validation based on card brand
export const validateCVV = (cvv: string, cardBrand?: string): boolean => {
  if (!cvv) return false;

  if (cardBrand === "amex") {
    return /^\d{4}$/.test(cvv);
  }
  return /^\d{3}$/.test(cvv);
};

// Expiry validation
export const validateExpiry = (month: string, year: string): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  if (expiryYear > currentYear + 20) return false; // Cards can't be valid for more than 20 years

  if (expiryYear === currentYear) {
    return expiryMonth >= currentMonth;
  }

  return expiryYear > currentYear;
};

// Mask sensitive data for logging
export const maskSensitiveData = (data: any): any => {
  if (typeof data !== "object" || data === null) return data;

  const masked = { ...data };
  if (masked.card) {
    masked.card = {
      ...masked.card,
      number: masked.card.number?.replace(/.(?=.{4})/g, "*"),
      cvv: "***",
    };
  }
  if (masked.bank) {
    masked.bank = {
      ...masked.bank,
      accountNumber: masked.bank.accountNumber?.replace(/.(?=.{4})/g, "*"),
    };
  }
  return masked;
};
