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
  permissions: PermissionOnAuth[];
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
export interface MappedUser {
  id: string;
  user_id: string;
  first_name: string;
  merchant_id: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface MappedUserRole {
  id: string;
  user: MappedUser;
  roles: MappedRole[];
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
// API Response Types
export interface ApiResponse<T> {
  status_code: boolean;
  details?: T;
  error?: string;
  status_description?: string;
}

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
// ROLES
export interface CreateRole {
  role_name: string;
  role_description: string;
}
export interface UpdateRole {
  role_name: string;
  role_description: string;
}
export interface Role {
  role_name: string;
  role_id: string;
  role_description: string;
  status: number;
}
export interface RolePermissionMapResponse {
  id: string;
  role: {
    id: string;
    role_id: string;
    role_name: string;
    role_description: string;
    is_active: number;
  };
  permission: {
    id: string;
    route: string;
    action: string;
    permission_id: string;
    permission_group: string;
    permission_name: string;
    permission_description: string;
    is_active: number;
  };
  role_assignment_id: string;
}

export interface MappedRole {
  id: string;
  role_id: string;
  role_name: string;
  role_description: string;
  is_active: number;
}
export interface RoleWithPermissions {
  role_name: string;
  role_id: string;
  role_description: string;
  status: number;
  permissions: Permission[];
}

export interface RoleCamelCase {
  id: string;
  role_id: string;
  role_name: string;
  role_description: string;
  is_active: number;
}

export interface FormattedRoleWithPermissions {
  role_id: string;
  role_name: string;
  role_description: string;
  is_active: number;
  permissions: {
    permission_id: string;
    permission_name: string;
    route: string;
    action: string;
    is_active: number;
  }[];
}
export interface RolePermissionMap {
  id: string;
  role_assignment_id: string;
  role: RoleCamelCase;
  permissions: PermissionCamelCase[];
}
export interface MapRolesToUserReq {
  role_ids: string[];
}
export interface MapPermissionsToRoleReq {
  permissions: string[];
}
export interface MapRolesToUserRes {}

// PERMISSIONS
export interface PermissionCamelCase {
  id: string;
  permission_id: string;
  permission_name: string;
  permission_description: string;
  route: string;
  action: string;
  is_active: number;
}
export interface CreatePermission {
  permission_group_id: string | null;
  permission_name: string;
  permission_description: string;
  route: string;
  action: string;
}
export interface CreatePermissionGroup {
  permission_group_name: string;
  permission_group_description: string;
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
  permission_group_id: string | null;
  status: number;
}
export interface PermissionOnAuth {
  route: string;
  action: string;
  permission_id: string;
  permission_name: string;
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
// Types for API requests and responses
export interface BusinessDetailsRequest {
  registered_name: string;
  trading_name?: string;
  physical_address: string;
  city: string;
  postal_code: string;
  industry_sector: string;
  business_type: string;
  business_license_type: string;
  other_license_type?: string;
  kra_pin_certificate: File;
  business_license_file: File;
  business_registration_cert: File;
  additional_documents?: File[];
}

export interface BusinessDetailsResponse {
  id: string;
  status: "pending" | "approved" | "rejected";
  verification_status: string;
}

export interface OwnerInfoRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  id_number: string;
  id_document: File;
  address_proof: File;
  passport_photo: File;
}

export interface OwnerInfoResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: "pending" | "approved" | "rejected";
  };
}

export interface BankDetailsRequest {
  bank_name: string;
  account_number: string;
  branch_code: string;
  bank_statement: File;
}

export interface BankDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    verification_status: "pending" | "verified" | "failed";
  };
}

export interface FinalSubmissionRequest {
  business_details_id: string;
  owner_info_id: string;
  bank_details_id: string;
}

export interface FinalSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    application_id: string;
    status: "submitted" | "under_review" | "approved" | "rejected";
    estimated_approval_time: string;
  };
}
// Base types for business onboarding system

/**
 * Business license types available in the system
 */
export type BusinessLicenseType =
  | "single_business_permit"
  | "trading_license"
  | "manufacturing_license"
  | "service_license";

/**
 * Industry sectors for business classification
 */
export type IndustrySector =
  | "Business Services"
  | "Technology"
  | "Manufacturing"
  | "Retail"
  | "Healthcare"
  | "Education"
  | "Finance"
  | "Agriculture"
  | "Construction"
  | "Transportation"
  | "Hospitality"
  | "Real Estate"
  | "Energy"
  | "Media"
  | "Government";

/**
 * Onboarding completion steps
 */
export type OnboardingStep =
  | "business_details"
  | "owner_details"
  | "bank_details"
  | "verification"
  | "compliance_check"
  | "final_approval";

/**
 * Application status
 */
export type OnboardingStatus =
  | "draft"
  | "pending"
  | "under_review"
  | "completed"
  | "approved"
  | "rejected"
  | "suspended"
  | "expired";

/**
 * Document file information
 */
export interface DocFile {
  /** File path on server */
  path: string;
  /** Original filename */
  filename?: string;
  /** File size in bytes */
  size?: number;
  /** MIME type */
  mimeType?: string;
  /** Upload timestamp */
  uploadedAt?: string;
  /** Document verification status */
  verified?: boolean;
}

/**
 * Business details information
 */
export interface BusinessDetails {
  /** Physical business address */
  physical_address: string;
  /** Legally registered business name */
  registered_name: string;
  /** City where business is located */
  city: string;
  /** Trading/DBA name */
  trading_name: string;
  /** Business industry classification */
  industry_sector: IndustrySector;
  /** Type of business entity */
  business_type: BusinessType;
  /** Type of business license */
  business_license_type: BusinessLicenseType;
  /** Postal/ZIP code */
  postal_code: string;
  /** County/State (optional) */
  county?: string;
  /** Country (optional, defaults to Kenya) */
  country?: string;
  /** Business description (optional) */
  description?: string;
  /** Website URL (optional) */
  website?: string;
  /** Business registration number (optional) */
  registration_number?: string;
  /** KRA PIN certificate document */
  kra_pin_certificate: string | DocFile;
  /** Business registration certificate */
  business_registration_cert: string | DocFile;
  /** Business license file */
  business_license_file: string | DocFile;
  /** Additional supporting documents */
  additional_documents: (string | DocFile)[];
}

/**
 * Individual owner/director details
 */
export interface OwnerDetails {
  /** Personal address */
  address: string;
  /** National ID or Passport number */
  national_id_passport: string;
  /** Phone number */
  phone: string;
  /** Last/Family name */
  last_name: string;
  /** First/Given name */
  first_name: string;
  /** Email address */
  email: string;
  /** Middle name (optional) */
  middle_name?: string;
  /** Date of birth (optional) */
  date_of_birth?: string;
  /** Nationality (optional) */
  nationality?: string;
  /** Ownership percentage (optional) */
  ownership_percentage?: number;
  /** Role in business (optional) */
  role?: string;
  /** Proof of address document */
  proof_of_address: string | DocFile;
  /** Facial/passport photo */
  facial_passport_photo: string | DocFile;
  /** Copy of national ID or passport */
  national_id_passport_copy: string | DocFile;
  /** Additional KYC documents (optional) */
  additional_kyc_documents?: (string | DocFile)[];
}

/**
 * Banking information
 */
export interface BankDetails {
  /** Bank branch code */
  branch_code: string;
  /** Bank account number */
  account_number: string;
  /** SWIFT/BIC code for international transfers */
  swift_code: string;
  /** Name of the bank */
  bank_name: string;
  /** Account holder name (optional) */
  account_holder_name?: string;
  /** Account type (optional) */
  account_type?: "checking" | "savings" | "business" | "current";
  /** Bank branch name (optional) */
  branch_name?: string;
  /** Bank statement document */
  bank_statement: string | DocFile;
  /** Additional banking documents (optional) */
  additional_bank_documents?: (string | DocFile)[];
}

/**
 * Verification and compliance information
 */
export interface VerificationDetails {
  /** KRA PIN verification status */
  kra_verification_status?: "pending" | "verified" | "failed";
  /** Business registration verification */
  business_reg_verification_status?: "pending" | "verified" | "failed";
  /** Bank account verification */
  bank_verification_status?: "pending" | "verified" | "failed";
  /** Overall compliance score */
  compliance_score?: number;
  /** Risk assessment level */
  risk_level?: "low" | "medium" | "high";
  /** AML/KYC check status */
  aml_kyc_status?: "pending" | "passed" | "failed";
  /** Verification notes */
  verification_notes?: string;
  /** Verifier information */
  verified_by?: {
    user_id: string;
    name: string;
    timestamp: string;
  };
}

/**
 * Complete onboarding record
 */
export interface BusinessOnboarding {
  /** Unique registration identifier */
  registration_id: string;
  /** Current onboarding status */
  status: OnboardingStatus;
  /** Last completed step */
  step_completed: OnboardingStep;
  /** Application creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at?: string;
  /** Expected completion date */
  expected_completion_date?: string;
  /** Assigned reviewer (optional) */
  assigned_reviewer?: string;
  /** Application priority */
  priority?: "low" | "normal" | "high" | "urgent";
  /** Business information */
  business_details: BusinessDetails;
  /** Owner/director information (optional for early steps) */
  owners_details?: OwnerDetails[];
  /** Banking information (optional for early steps) */
  bank_details?: BankDetails;
  /** Verification details (optional) */
  verification_details?: VerificationDetails;
  /** Application notes and comments */
  notes?: {
    id: string;
    content: string;
    author: string;
    timestamp: string;
    type: "internal" | "external" | "system";
  }[];
  /** Rejection reasons (if applicable) */
  rejection_reasons?: string[];
  /** Approval information (if applicable) */
  approval_details?: {
    approved_by: string;
    approved_at: string;
    approval_notes?: string;
  };
}

/**
 * API Response wrapper for onboarding data
 */
export interface OnboardingApiResponse {
  /** HTTP status code */
  status_code: number;
  /** Status description */
  status_description: string;
  /** Array of onboarding records */
  details: BusinessOnboarding[];
  /** Pagination metadata (optional) */
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Filter options for onboarding list
 */
export interface OnboardingFilters {
  /** Search term for names and IDs */
  search?: string;
  /** Filter by status */
  status?: OnboardingStatus | "all";
  /** Filter by completion step */
  step?: OnboardingStep | "all";
  /** Filter by industry sector */
  industry?: IndustrySector | "all";
  /** Filter by business type */
  businessType?: BusinessType | "all";
  /** Filter by date range */
  dateRange?: {
    from: string;
    to: string;
  };
  /** Filter by city */
  city?: string;
  /** Filter by assigned reviewer */
  assignedReviewer?: string;
  /** Filter by priority */
  priority?: "low" | "normal" | "high" | "urgent" | "all";
}

/**
 * Sort options for onboarding list
 */
export interface OnboardingSortOptions {
  /** Field to sort by */
  field:
    | "created_at"
    | "updated_at"
    | "registered_name"
    | "status"
    | "step_completed";
  /** Sort direction */
  direction: "asc" | "desc";
}

/**
 * Query parameters for RTK Query
 */
export interface OnboardingQueryParams {
  /** Pagination */
  page?: number;
  limit?: number;
  /** Filters */
  filters?: OnboardingFilters;
  /** Sorting */
  sort?: OnboardingSortOptions;
}

/**
 * RTK Query hook return type
 */
export interface UseOnboardingListQuery {
  data?: OnboardingApiResponse;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  refetch: () => void;
}

// Utility types for form handling

/**
 * Form data for business details step
 */
export type BusinessDetailsForm = Omit<
  BusinessDetails,
  | "kra_pin_certificate"
  | "business_registration_cert"
  | "business_license_file"
  | "additional_documents"
> & {
  kra_pin_certificate?: File;
  business_registration_cert?: File;
  business_license_file?: File;
  additional_documents?: File[];
};

/**
 * Form data for owner details step
 */
export type OwnerDetailsForm = Omit<
  OwnerDetails,
  | "proof_of_address"
  | "facial_passport_photo"
  | "national_id_passport_copy"
  | "additional_kyc_documents"
> & {
  proof_of_address?: File;
  facial_passport_photo?: File;
  national_id_passport_copy?: File;
  additional_kyc_documents?: File[];
};

/**
 * Form data for bank details step
 */
export type BankDetailsForm = Omit<
  BankDetails,
  "bank_statement" | "additional_bank_documents"
> & {
  bank_statement?: File;
  additional_bank_documents?: File[];
};
