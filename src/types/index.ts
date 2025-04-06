export type DashboardStats = {
  totalRevenue: number;
  revenueChange: number;
  totalTransactions: number;
  transactionsChange: number;
  successfulPayments: number;
  successRateChange: number;
  refunds: number;
  refundRateChange: number;
  paymentMethods: {
    card: number;
    bank: number;
    wallet: number;
  };
};

export type RevenueData = {
  date: string;
  amount: number;
};

export type Transaction = {
  id: string;
  amount: number;
  status: "successful" | "failed" | "pending" | "refunded";
  paymentMethod: "card" | "bank" | "wallet";
  customer: string;
  date: string;
};
export type PaymentMethod = "card" | "bank" | "wallet" | "upi" | "netbanking";

export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "diners"
  | "jcb"
  | "unionpay"
  | "unknown";

export type BankAccountType = "savings" | "checking" | "current";

export type UpiType = "id" | "qr";

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  card?: CardDetails;
  bank?: BankDetails;
  wallet?: WalletDetails;
  upi?: UpiDetails;
  netbanking?: NetbankingDetails;
  metadata?: Record<string, string>;
}

export interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
  brand?: CardBrand;
  token?: string; // For saved cards
}

export interface BankDetails {
  accountNumber: string;
  routingNumber: string;
  holderName: string;
  accountType: BankAccountType;
  ifscCode?: string; // For Indian banks
  token?: string; // For saved accounts
}

export interface WalletDetails {
  type: "paypal" | "amazonpay" | "googlepay" | "applepay";
  email?: string;
  token?: string;
}

export interface UpiDetails {
  type: UpiType;
  id: string;
  qrCode?: string;
}

export interface NetbankingDetails {
  bankCode: string;
  userId?: string;
}
