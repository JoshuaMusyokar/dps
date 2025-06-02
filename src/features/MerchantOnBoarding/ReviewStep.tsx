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

  // Status indicator component
  const StatusIndicator: React.FC<{ isComplete: boolean; label: string }> = ({
    isComplete,
    label,
  }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          isComplete
            ? "bg-green-500 dark:bg-green-400"
            : "bg-red-500 dark:bg-red-400"
        }`}
      >
        {isComplete ? (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          isComplete
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300"
        }`}
      >
        {label}
      </span>
    </div>
  );

  // Info row component
  const InfoRow: React.FC<{
    label: string;
    value: string;
    className?: string;
  }> = ({ label, value, className = "" }) => (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 ${className}`}
    >
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[140px]">
        {label}:
      </p>
      <p className="text-sm text-gray-900 dark:text-gray-100 flex-1 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Review Your Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please review all information carefully before final submission
            </p>
          </div>
        </div>

        {/* Completion Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
            <StatusIndicator
              isComplete={
                !!businessName && !!businessType && hasAllRequiredDocuments()
              }
              label="Business Details"
            />
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
            <StatusIndicator
              isComplete={
                !!ownerFirstName &&
                !!ownerLastName &&
                hasAllRequiredOwnerDocuments()
              }
              label="Owner Information"
            />
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
            <StatusIndicator
              isComplete={!!bankName && !!accountNumber && !!statementDocument}
              label="Bank Details"
            />
          </div>
        </div>
      </section>

      {/* Business Details Summary */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Business Details
          </h4>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoRow label="Business Name" value={businessName} />
              <InfoRow
                label="Trading Name"
                value={tradingName || "Same as business name"}
              />
              <InfoRow label="Business Type" value={getBusinessTypeDisplay()} />
              <InfoRow label="Industry" value={industry} />
            </div>
            <div className="space-y-4">
              <InfoRow label="License Type" value={getLicenseTypeDisplay()} />
              <InfoRow
                label="Documents Status"
                value={
                  hasAllRequiredDocuments()
                    ? "✓ All required documents uploaded"
                    : "⚠ Missing required documents"
                }
                className={
                  hasAllRequiredDocuments()
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <InfoRow
              label="Business Address"
              value={`${address || ""} ${city || ""} ${postalCode || ""}, ${
                country || ""
              }`
                .trim()
                .replace(/,\s*$/, "")}
              className="lg:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* Owner Details Summary */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Owner Information
          </h4>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoRow
                label="Full Name"
                value={`${ownerFirstName || ""} ${ownerLastName || ""}`.trim()}
              />
              <InfoRow label="Email Address" value={ownerEmail} />
              <InfoRow label="Phone Number" value={ownerPhone} />
            </div>
            <div className="space-y-4">
              <InfoRow label="ID/Passport Number" value={ownerIdNumber} />
              <InfoRow
                label="Documents Status"
                value={
                  hasAllRequiredOwnerDocuments()
                    ? "✓ All required documents uploaded"
                    : "⚠ Missing required documents"
                }
                className={
                  hasAllRequiredOwnerDocuments()
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <InfoRow label="Residential Address" value={ownerAddress} />
          </div>
        </div>
      </section>

      {/* Bank Details Summary */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Bank Account Details
          </h4>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoRow label="Bank Name" value={bankName} />
              <InfoRow label="Account Number" value={accountNumber} />
              <InfoRow label="Branch Code" value={branchCode} />
            </div>
            <div className="space-y-4">
              <InfoRow
                label="SWIFT/BIC Code"
                value={swiftCode || "Not provided"}
              />
              <InfoRow
                label="Bank Statement"
                value={statementDocument ? "✓ Uploaded" : "⚠ Not uploaded"}
                className={
                  statementDocument
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final Review Checklist */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Pre-Submission Checklist
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  businessName && businessType ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {businessName && businessType && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Business information completed
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  ownerFirstName && ownerLastName && ownerEmail
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {ownerFirstName && ownerLastName && ownerEmail && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Owner details provided
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  bankName && accountNumber ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {bankName && accountNumber && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Bank account details added
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  hasAllRequiredDocuments() ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {hasAllRequiredDocuments() && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Business documents uploaded
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  hasAllRequiredOwnerDocuments()
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {hasAllRequiredOwnerDocuments() && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Identity documents uploaded
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  statementDocument ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {statementDocument && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Bank statement uploaded
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <InfoBox
          title="Terms & Conditions"
          items={[
            "By submitting this form, you confirm that all information provided is accurate, complete, and up-to-date",
            "Any false, incomplete, or misleading information may result in application rejection, account suspension, or legal action",
            "You acknowledge that you have read, understood, and agree to comply with our Terms of Service and Privacy Policy",
            "You consent to the collection, processing, and storage of your personal and business data as outlined in our Privacy Policy",
            "You understand that additional verification may be required and processing times may vary based on document review",
          ]}
          variant="warning"
          className="border-0 bg-transparent shadow-none p-0"
        />
      </section>
    </div>
  );
};
