import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  setField,
  clearError,
  addDocument,
  removeDocument,
} from "../../store/slices/business-registration";
import { FileUploader } from "../../components/ui/FileUpload";
import { RadioGroup } from "../../components/ui/RadioGroup";
import { TextField } from "../../components/ui/TextField";
import { InfoBox } from "../../components/ui/InfoBox";

// Constants
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

// Business types options
const businessTypes = [
  {
    value: "sole_proprietorship",
    label: "Sole Proprietorship",
    description: "Individual ownership",
  },
  {
    value: "partnership",
    label: "Partnership",
    description: "Two or more partners",
  },
  {
    value: "limited_company",
    label: "Limited Company",
    description: "Private limited liability",
  },
  { value: "corporation", label: "Corporation", description: "Public company" },
  {
    value: "ngo",
    label: "NGO/Non-Profit",
    description: "Non-governmental organization",
  },
  { value: "other", label: "Other", description: "Specify your business type" },
];

// License types options
const licenseTypes = [
  {
    value: "single_business",
    label: "Single Business Permit",
    description: "County-level permit",
  },
  {
    value: "county_trade",
    label: "County Trade License",
    description: "Trading license",
  },
  {
    value: "national",
    label: "National Business License",
    description: "National-level license",
  },
  { value: "other", label: "Other", description: "Specify license type" },
];

// Required documents
const requiredDocuments = [
  { id: "kra_pin", label: "KRA PIN Certificate", required: true },
  { id: "business_license", label: "Business License/Permit", required: true },
  {
    id: "business_registration",
    label: "Business Registration Certificate",
    required: true,
  },
];

export const BusinessDetailsStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    businessName,
    tradingName,
    address,
    city,
    postalCode,
    businessType,
    licenseType,
    otherLicenseType,
    industry,
    documents,
    formErrors,
  } = useAppSelector((state) => state.registration);

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  // Handle input change
  const handleInputChange = (name: string, value: string) => {
    dispatch(setField({ field: name, value }));
    dispatch(clearError(name));
  };

  // Handle file upload
  const handleFileUpload = (documentId: string, file: File) => {
    // Validate file type and size
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      dispatch(
        setField({
          field: "formErrors",
          value: {
            ...formErrors,
            [documentId]: "Invalid file type. Please upload PDF, JPG, or PNG.",
          },
        })
      );
      return;
    }

    if (file.size > FILE_SIZE_LIMIT) {
      dispatch(
        setField({
          field: "formErrors",
          value: {
            ...formErrors,
            [documentId]: "File size exceeds 5MB limit.",
          },
        })
      );
      return;
    }

    // Clear error if exists
    if (formErrors[documentId]) {
      dispatch(clearError(documentId));
    }

    // Simulate upload progress
    setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));

    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[documentId] || 0;
        const newProgress = Math.min(current + 10, 100);

        if (newProgress === 100) {
          clearInterval(interval);
          dispatch(
            addDocument({
              id: documentId,
              file,
              type: file.type,
              uploaded: true,
              validated: false,
            })
          );
        }

        return { ...prev, [documentId]: newProgress };
      });
    }, 200);
  };

  // Find document by ID
  const findDocument = (id: string) => {
    return documents.find((doc) => doc.id === id);
  };

  return (
    <div className="space-y-8">
      {/* Upload Documents Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 dark:from-dark-primary-600 dark:to-accent-600 flex items-center justify-center">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Upload Required Documents
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All fields marked with * are mandatory
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* KRA PIN Certificate */}
          <FileUploader
            id="kra_pin"
            label="KRA PIN Certificate*"
            description="Must be a valid KRA PIN registered under the business name"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) => handleFileUpload("kra_pin", file)}
            onRemove={() => dispatch(removeDocument("kra_pin"))}
            error={formErrors.kra_pin}
            file={findDocument("kra_pin")?.file}
            progress={uploadProgress.kra_pin}
          />

          {/* Business License */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Business License/Permit Type*
              </label>
              <RadioGroup
                name="licenseType"
                options={licenseTypes}
                value={licenseType}
                onChange={(value) => handleInputChange("licenseType", value)}
                error={formErrors.licenseType}
                inline={false}
              />
            </div>

            {licenseType === "other" && (
              <TextField
                name="otherLicenseType"
                placeholder="Please specify your license type"
                value={otherLicenseType}
                onChange={(e) =>
                  handleInputChange("otherLicenseType", e.target.value)
                }
                error={formErrors.otherLicenseType}
                className="max-w-md"
              />
            )}

            <FileUploader
              id="business_license"
              label="Upload Business License Document*"
              description="Upload your business license or permit document"
              acceptedFormats="PDF, JPG, PNG (Max 5MB)"
              onFileSelect={(file) =>
                handleFileUpload("business_license", file)
              }
              onRemove={() => dispatch(removeDocument("business_license"))}
              error={formErrors.business_license}
              file={findDocument("business_license")?.file}
              progress={uploadProgress.business_license}
            />
          </div>

          {/* Business Registration Certificate */}
          <FileUploader
            id="business_registration"
            label="Business Registration Certificate*"
            description="Certificate of registration or incorporation from relevant authority"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) =>
              handleFileUpload("business_registration", file)
            }
            onRemove={() => dispatch(removeDocument("business_registration"))}
            error={formErrors.business_registration}
            file={findDocument("business_registration")?.file}
            progress={uploadProgress.business_registration}
          />

          {/* Additional Documents */}
          <FileUploader
            id="additional_doc"
            label="Additional Documents (Optional)"
            description="Any other relevant business documents that support your application"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) =>
              handleFileUpload(`additional_${Date.now()}`, file)
            }
            multiple
            additionalFiles={documents
              .filter((doc) => doc.id.startsWith("additional_"))
              .map((doc) => ({
                id: doc.id,
                file: doc.file,
                onRemove: () => dispatch(removeDocument(doc.id)),
              }))}
          />
        </div>
      </section>

      {/* Business Details Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-primary-500 dark:from-secondary-600 dark:to-primary-600 flex items-center justify-center">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Business Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide your business details and registration information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TextField
              label="Registered Business Name*"
              name="businessName"
              value={businessName}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              placeholder="As registered with KRA"
              error={formErrors.businessName}
              className="w-full"
            />

            <TextField
              label="Trading Name (if different)"
              name="tradingName"
              value={tradingName}
              onChange={(e) => handleInputChange("tradingName", e.target.value)}
              placeholder="Business trading name"
              className="w-full"
            />

            <TextField
              label="Physical Address*"
              name="address"
              value={address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Street address, building name"
              error={formErrors.address}
              className="w-full"
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="City*"
                name="city"
                value={city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="City"
                error={formErrors.city}
              />

              <TextField
                label="Postal Code*"
                name="postalCode"
                value={postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                placeholder="00100"
                error={formErrors.postalCode}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Business Type*
              </label>
              <RadioGroup
                name="businessType"
                options={businessTypes}
                value={businessType}
                onChange={(value) => handleInputChange("businessType", value)}
                error={formErrors.businessType}
                inline={false}
              />
            </div>

            <TextField
              label="Industry/Sector*"
              name="industry"
              value={industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              placeholder="e.g., Technology, Retail, Manufacturing"
              error={formErrors.industry}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Next Steps Info */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <InfoBox
          title="What happens next?"
          items={[
            "Your uploaded documents will be verified within 2-3 business days",
            "You'll receive email and SMS notifications once verification is complete",
            "After approval, you can proceed to complete owner details and banking information",
            "Our support team will contact you if any additional information is required",
          ]}
          variant="info"
          className="border-0 bg-transparent shadow-none p-0"
        />
      </section>
    </div>
  );
};
