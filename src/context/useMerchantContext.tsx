// context/MerchantContext.tsx
import { createContext, useContext, ReactNode, useState } from "react";

// Types for merchant onboarding steps
export type OnboardingStep =
  | "business_registration"
  | "owner_information"
  | "bank_details"
  | "review"
  | "complete";

export type OnboardingStatus =
  | "not_started"
  | "in_progress"
  | "pending_verification"
  | "verification_failed"
  | "complete";

// Merchant profile information
export interface MerchantProfile {
  id?: string;
  businessName: string;
  tradingName?: string;
  businessType: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  email?: string;
  industry?: string;
  taxId?: string;
  registrationNumber?: string;
  documents: {
    kraPinCertificate?: string;
    businessLicense?: string;
    registrationCertificate?: string;
    additionalDocuments?: string[];
  };
  owners: MerchantOwner[];
  bankAccounts: BankAccount[];
  onboardingStatus: OnboardingStatus;
  currentStep: OnboardingStep;
  verificationStatus?: {
    businessVerified: boolean;
    ownerVerified: boolean;
    bankVerified: boolean;
    issues?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

// Owner information
export interface MerchantOwner {
  id?: string;
  fullName: string;
  idNumber: string;
  idType: "national_id" | "passport" | "other";
  nationality: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber: string;
  email: string;
  ownership: number; // Percentage
  isMainContact: boolean;
  documents?: {
    idCopy?: string;
    photo?: string;
    proofOfAddress?: string;
  };
}

// Bank account information
export interface BankAccount {
  id?: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchName?: string;
  branchCode?: string;
  swiftCode?: string;
  isDefault: boolean;
  verified: boolean;
}

// Context state
interface MerchantContextState {
  merchant: MerchantProfile | null;
  isLoading: boolean;
  error: string | null;
  updateMerchantProfile: (data: Partial<MerchantProfile>) => Promise<void>;
  addOwner: (owner: MerchantOwner) => Promise<void>;
  updateOwner: (id: string, data: Partial<MerchantOwner>) => Promise<void>;
  removeOwner: (id: string) => Promise<void>;
  addBankAccount: (account: BankAccount) => Promise<void>;
  updateBankAccount: (id: string, data: Partial<BankAccount>) => Promise<void>;
  removeBankAccount: (id: string) => Promise<void>;
  uploadDocument: (documentType: string, file: File) => Promise<string>;
  submitForVerification: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

// Default context values
const defaultContextValue: MerchantContextState = {
  merchant: null,
  isLoading: false,
  error: null,
  updateMerchantProfile: async () => {},
  addOwner: async () => {},
  updateOwner: async () => {},
  removeOwner: async () => {},
  addBankAccount: async () => {},
  updateBankAccount: async () => {},
  removeBankAccount: async () => {},
  uploadDocument: async () => "",
  submitForVerification: async () => {},
  resetOnboarding: async () => {},
};

// Create context
const MerchantContext =
  createContext<MerchantContextState>(defaultContextValue);

// Provider component
interface MerchantProviderProps {
  children: ReactNode;
}

export function MerchantProvider({ children }: MerchantProviderProps) {
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate API calls with a delay and local state updates
  const simulateApiCall = async <T,>(
    callback: () => T,
    delay = 1000
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    return new Promise<T>((resolve) => {
      setTimeout(() => {
        try {
          const result = callback();
          setIsLoading(false);
          resolve(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setIsLoading(false);
          throw err;
        }
      }, delay);
    });
  };

  // Update merchant profile
  const updateMerchantProfile = async (data: Partial<MerchantProfile>) => {
    await simulateApiCall(() => {
      const updatedMerchant = {
        ...merchant,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setMerchant(updatedMerchant as MerchantProfile);
      return updatedMerchant;
    });
  };

  // Add an owner
  const addOwner = async (owner: MerchantOwner) => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const newOwner = {
        ...owner,
        id: `owner-${Date.now()}`,
      };

      const updatedMerchant = {
        ...merchant,
        owners: [...(merchant.owners || []), newOwner],
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    });
  };

  // Update an owner
  const updateOwner = async (id: string, data: Partial<MerchantOwner>) => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const updatedOwners = merchant.owners.map((owner) =>
        owner.id === id ? { ...owner, ...data } : owner
      );

      const updatedMerchant = {
        ...merchant,
        owners: updatedOwners,
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    });
  };

  // Remove an owner
  const removeOwner = async (id: string) => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const updatedOwners = merchant.owners.filter((owner) => owner.id !== id);

      const updatedMerchant = {
        ...merchant,
        owners: updatedOwners,
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    });
  };

  // Add a bank account
  const addBankAccount = async (account: BankAccount) => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const newAccount = {
        ...account,
        id: `account-${Date.now()}`,
      };

      const updatedMerchant = {
        ...merchant,
        bankAccounts: [...(merchant.bankAccounts || []), newAccount],
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    });
  };

  // Update a bank account
  const updateBankAccount = async (id: string, data: Partial<BankAccount>) => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const updatedAccounts = merchant.bankAccounts.map((account) =>
        account.id === id ? { ...account, ...data } : account
      );

      const updatedMerchant = {
        ...merchant,
        bankAccounts: updatedAccounts,
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    });
  };

  // Remove a bank account
  const removeBankAccount = async (id: string) => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const updatedAccounts = merchant.bankAccounts.filter(
        (account) => account.id !== id
      );

      const updatedMerchant = {
        ...merchant,
        bankAccounts: updatedAccounts,
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    });
  };

  // Upload document
  const uploadDocument = async (
    documentType: string,
    file: File
  ): Promise<string> => {
    return simulateApiCall(() => {
      // In a real implementation, this would upload to a backend service
      // and return a document ID or URL
      return `document-${documentType}-${Date.now()}`;
    });
  };

  // Submit for verification
  const submitForVerification = async () => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const updatedMerchant = {
        ...merchant,
        onboardingStatus: "pending_verification" as OnboardingStatus,
        updatedAt: new Date().toISOString(),
      };

      setMerchant(updatedMerchant);
      return updatedMerchant;
    }, 2000);
  };

  // Reset onboarding
  const resetOnboarding = async () => {
    await simulateApiCall(() => {
      if (!merchant) throw new Error("Merchant profile not initialized");

      const resetMerchant = {
        ...merchant,
        onboardingStatus: "not_started" as OnboardingStatus,
        currentStep: "business_registration" as OnboardingStep,
        verificationStatus: undefined,
        updatedAt: new Date().toISOString(),
      };

      setMerchant(resetMerchant);
      return resetMerchant;
    });
  };

  const contextValue = {
    merchant,
    isLoading,
    error,
    updateMerchantProfile,
    addOwner,
    updateOwner,
    removeOwner,
    addBankAccount,
    updateBankAccount,
    removeBankAccount,
    uploadDocument,
    submitForVerification,
    resetOnboarding,
  };

  return (
    <MerchantContext.Provider value={contextValue}>
      {children}
    </MerchantContext.Provider>
  );
}

// Custom hook to use the context
export function useMerchant() {
  const context = useContext(MerchantContext);

  if (!context) {
    throw new Error("useMerchant must be used within a MerchantProvider");
  }

  return context;
}
