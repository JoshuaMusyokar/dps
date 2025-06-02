// src/utils/formDataUtils.ts
import { BusinessRegistrationData, DocumentFile } from "../types";

export const prepareBusinessDetailsFormData = (
  data: BusinessRegistrationData
): FormData => {
  const formData = new FormData();

  // Add text fields
  formData.append("registered_name", data.businessName);
  if (data.tradingName) {
    formData.append("trading_name", data.tradingName);
  }
  formData.append("physical_address", data.address);
  formData.append("city", data.city);
  formData.append("postal_code", data.postalCode);
  formData.append("industry_sector", data.industry);
  formData.append("business_type", data.businessType);

  // Handle license type
  if (data.licenseType === "other" && data.otherLicenseType) {
    formData.append("business_license_type", data.otherLicenseType);
  } else {
    formData.append("business_license_type", data.licenseType);
  }

  // Add required documents
  const findDocument = (id: string): DocumentFile | undefined => {
    return data.documents.find((doc) => doc.id === id);
  };

  const kraPin = findDocument("kra_pin");
  const businessLicense = findDocument("business_license");
  const businessRegistration = findDocument("business_registration");

  if (kraPin?.file) {
    formData.append("kra_pin_certificate", kraPin.file);
  }
  if (businessLicense?.file) {
    formData.append("business_license_file", businessLicense.file);
  }
  if (businessRegistration?.file) {
    formData.append("business_registration_cert", businessRegistration.file);
  }

  // Add additional documents
  const additionalDocs = data.documents.filter((doc) =>
    doc.id.startsWith("additional_")
  );
  additionalDocs.forEach((doc, index) => {
    if (doc.file) {
      formData.append(`additional_documents`, doc.file);
    }
  });

  return formData;
};

export const prepareOwnerDetailsFormData = (
  data: BusinessRegistrationData,
  businessId: string
): FormData => {
  const formData = new FormData();

  formData.append("business_id", businessId);
  formData.append("first_name", data.ownerFirstName);
  formData.append("last_name", data.ownerLastName);
  formData.append("id_number", data.ownerIdNumber);
  formData.append("email", data.ownerEmail);
  formData.append("phone", data.ownerPhone);
  formData.append("address", data.ownerAddress);

  // Add owner documents
  const findOwnerDocument = (id: string): DocumentFile | undefined => {
    return data.ownerDocuments.find((doc) => doc.id === id);
  };

  const idDocument = findOwnerDocument("id_document");
  const addressProof = findOwnerDocument("address_proof");
  const passportPhoto = findOwnerDocument("passport_photo");

  if (idDocument?.file) {
    formData.append("id_document", idDocument.file);
  }
  if (addressProof?.file) {
    formData.append("address_proof", addressProof.file);
  }
  if (passportPhoto?.file) {
    formData.append("passport_photo", passportPhoto.file);
  }

  return formData;
};

export const prepareBankDetailsFormData = (
  data: BusinessRegistrationData,
  businessId: string
): FormData => {
  const formData = new FormData();

  formData.append("business_id", businessId);
  formData.append("bank_name", data.bankName);
  formData.append("account_number", data.accountNumber);
  formData.append("branch_code", data.branchCode);

  if (data.swiftCode) {
    formData.append("swift_code", data.swiftCode);
  }

  if (data.statementDocument?.file) {
    formData.append("bank_statement", data.statementDocument.file);
  }

  return formData;
};

// Error handling utility
export const handleApiErrors = (error: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (error?.data?.errors) {
    // Handle validation errors from API
    Object.entries(error.data.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        errors[field] = messages[0];
      }
    });
  } else if (error?.data?.message) {
    // Handle general error message
    errors.general = error.data.message;
  } else if (error?.message) {
    // Handle network or other errors
    errors.general = error.message;
  } else {
    // Fallback error
    errors.general = "An unexpected error occurred. Please try again.";
  }

  return errors;
};
