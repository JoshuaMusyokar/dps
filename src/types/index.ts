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
export interface LoginResponse {
  status_code: number;
  status_description: string;
  token_details: TokenDetails;
  organization_details: OrganizationDetails;
  user_details: UserDetails;
}

export interface OrganizationDetails {
  organization_identify: string;
  sub_organization_identifiers: string[];
}

export interface TokenDetails {
  token_type: string;
  access_token: string;
  issued_at: string;
  expires_at: string;
}

export interface UserDetails {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}
export interface LoginCredential {
  organization_id: string;
  email_address: string;
  password: string;
}
// src/types/registration.ts
export type BusinessType =
  | "sole_proprietorship"
  | "partnership"
  | "limited_company"
  | "corporation"
  | "ngo"
  | "other";

export type LicenseType =
  | "single_business"
  | "county_trade"
  | "national"
  | "other";

export type DocumentFile = {
  id: string;
  file: File;
  type: string;
  uploaded: boolean;
  validated: boolean;
};

export type BusinessRegistrationData = {
  // Step 1: Business Details
  businessName: string;
  tradingName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  businessType: BusinessType | "";
  taxId: string;
  licenseType: LicenseType | "";
  otherLicenseType: string;
  documents: DocumentFile[];
  industry: string;
  yearEstablished: string;
  employeeCount: string;

  // Step 2: Owner Info
  ownerFirstName: string;
  ownerLastName: string;
  ownerIdNumber: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  ownerDocuments: DocumentFile[];

  // Step 3: Bank Details
  bankName: string;
  accountNumber: string;
  branchCode: string;
  swiftCode: string;
  statementDocument: DocumentFile | null;

  // Form state
  currentStep: number;
  formErrors: Record<string, string>;
  isSubmitting: boolean;
  draftSaved: boolean;
};
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: "public" | "private";
  environment: "test" | "live";
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  lastDelivery: {
    timestamp: string;
    status: string;
    responseCode: number;
  } | null;
}
export interface RolesResponse {
  status_code: number;
  status_description: string;
  details: Role[];
}

export interface Role {
  role_name: string;
  role_id: string;
  role_description: string;
  status: number;
}
export interface PermissionResponse {
  status_code: number;
  status_description: string;
  details: Permission[];
}

export interface Permission {
  route: string;
  permission_description: string;
  action: string;
  permission_group: string;
  permission_id: string;
  permission_name: string;
  status: number;
}
export interface PermissionGroupResponse {
  status_code: number;
  status_description: string;
  details: PermissionGroup[];
}

export interface PermissionGroup {
  group_id: string;
  group_name: string;
  group_description: string;
  status: number;
}
