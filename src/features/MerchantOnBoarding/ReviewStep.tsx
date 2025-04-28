import React from "react";
import { useAppSelector } from "../../hooks";
import { InfoBox } from "../../components/ui/InfoBox";

// Map business type to readable string
const businessTypeLabels: Record<string, string> = {
  sole_proprietorship: "Sole Proprietorship",
  partnership: "Partnership",
  limited_company: "Limited Company",
  corporation: "Corporation",
  ngo: "NGO/Non-Profit",
  other: "Other",
};

// Map license type to readable string
const licenseTypeLabels: Record<string, string> = {
  single_business: "Single Business Permit",
  county_trade: "County Trade License",
  national: "National Business License",
  other: "Other",
};

export const ReviewStep: React.FC = () => {
  const registration = useAppSelector((state) => state.registration);

  const {
    // Business Details
    businessName,
    tradingName,
    address,
    city,
    postalCode,
    country,
    businessType,
    licenseType,
    otherLicenseType,
    industry,
    documents,

    // Owner Details
    ownerFirstName,
    ownerLastName,
    ownerEmail,
    ownerPhone,
    ownerAddress,
    ownerIdNumber,
    ownerDocuments,

    // Bank Details
    bankName,
    accountNumber,
    branchCode,
    swiftCode,
    statementDocument,
  } = registration;

  // Get business type display name
  const getBusinessTypeDisplay = () => {
    return businessType
      ? businessTypeLabels[businessType] || businessType
      : "Not provided";
  };

  // Get license type display name
  const getLicenseTypeDisplay = () => {
    if (!licenseType) return "Not provided";
    if (licenseType === "other") return otherLicenseType || "Other";
    return licenseTypeLabels[licenseType] || licenseType;
  };

  // Check if we have all required documents
  const hasAllRequiredDocuments = () => {
    const requiredDocIds = [
      "kra_pin",
      "business_license",
      "business_registration",
    ];
    return requiredDocIds.every((id) => documents.some((doc) => doc.id === id));
  };

  // Check if we have all required owner documents
  const hasAllRequiredOwnerDocuments = () => {
    const requiredDocIds = ["id_document", "address_proof", "passport_photo"];
    return requiredDocIds.every((id) =>
      ownerDocuments.some((doc) => doc.id === id)
    );
  };

  return (
    <>
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Review Your Information
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Please review all the information before final submission.
        </p>

        {/* Business Details Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-base font-medium text-gray-700 mb-3">
            Business Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Business Name:
              </p>
              <p className="text-sm text-gray-800">
                {businessName || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Trading Name:</p>
              <p className="text-sm text-gray-800">
                {tradingName || "Same as business name"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Business Type:
              </p>
              <p className="text-sm text-gray-800">
                {getBusinessTypeDisplay()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Industry:</p>
              <p className="text-sm text-gray-800">
                {industry || "Not provided"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">Address:</p>
              <p className="text-sm text-gray-800">{`${address || ""} ${
                city || ""
              } ${postalCode || ""}, ${country || ""}`}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">License Type:</p>
              <p className="text-sm text-gray-800">{getLicenseTypeDisplay()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Documents:</p>
              <p className="text-sm text-gray-800">
                {hasAllRequiredDocuments()
                  ? "All required documents uploaded"
                  : "Missing required documents"}
              </p>
            </div>
          </div>
        </div>

        {/* Owner Details Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-base font-medium text-gray-700 mb-3">
            Owner Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Full Name:</p>
              <p className="text-sm text-gray-800">{`${ownerFirstName || ""} ${
                ownerLastName || ""
              }`}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                ID/Passport Number:
              </p>
              <p className="text-sm text-gray-800">
                {ownerIdNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email:</p>
              <p className="text-sm text-gray-800">
                {ownerEmail || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone:</p>
              <p className="text-sm text-gray-800">
                {ownerPhone || "Not provided"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">
                Residential Address:
              </p>
              <p className="text-sm text-gray-800">
                {ownerAddress || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Identity Documents:
              </p>
              <p className="text-sm text-gray-800">
                {hasAllRequiredOwnerDocuments()
                  ? "All required documents uploaded"
                  : "Missing required documents"}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-base font-medium text-gray-700 mb-3">
            Bank Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Bank Name:</p>
              <p className="text-sm text-gray-800">
                {bankName || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Account Number:
              </p>
              <p className="text-sm text-gray-800">
                {accountNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Branch Code:</p>
              <p className="text-sm text-gray-800">
                {branchCode || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                SWIFT/BIC Code:
              </p>
              <p className="text-sm text-gray-800">
                {swiftCode || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bank Statement:
              </p>
              <p className="text-sm text-gray-800">
                {statementDocument ? "Uploaded" : "Not uploaded"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <InfoBox
        title="Terms & Conditions"
        items={[
          "By submitting this form, you confirm all information provided is accurate and complete.",
          "False information may result in account suspension or termination.",
          "You agree to our Terms of Service and Privacy Policy.",
        ]}
        variant="info"
        className="mb-8"
      />
    </>
  );
};
