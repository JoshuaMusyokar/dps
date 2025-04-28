// src/components/registration/BusinessDetailsStep.tsx
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
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "limited_company", label: "Limited Company" },
  { value: "corporation", label: "Corporation" },
  { value: "ngo", label: "NGO/Non-Profit" },
  { value: "other", label: "Other" },
];

// License types options
const licenseTypes = [
  { value: "single_business", label: "Single Business Permit" },
  { value: "county_trade", label: "County Trade License" },
  { value: "national", label: "National Business License" },
  { value: "other", label: "Other" },
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

          // Add document to state after "upload" completes
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
    <>
      {/* Upload Documents Section */}
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Upload Required Documents
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          (All fields marked * are mandatory)
        </p>

        <div className="space-y-6">
          {/* KRA PIN Certificate */}
          <div>
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
          </div>

          {/* Business License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business License/Permit*
            </label>

            <RadioGroup
              name="licenseType"
              options={licenseTypes}
              value={licenseType}
              onChange={(value) => handleInputChange("licenseType", value)}
              error={formErrors.licenseType}
            />

            {licenseType === "other" && (
              <TextField
                name="otherLicenseType"
                placeholder="Please specify"
                value={otherLicenseType}
                onChange={(e) =>
                  handleInputChange("otherLicenseType", e.target.value)
                }
                error={formErrors.otherLicenseType}
                className="mt-2 w-full max-w-xs"
              />
            )}

            <div className="mt-2">
              <FileUploader
                id="business_license"
                description="Upload your business license or permit"
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
          </div>

          {/* Business Registration Certificate */}
          <div>
            <FileUploader
              id="business_registration"
              label="Business Registration Certificate*"
              description="Certificate of registration/incorporation"
              acceptedFormats="PDF, JPG, PNG (Max 5MB)"
              onFileSelect={(file) =>
                handleFileUpload("business_registration", file)
              }
              onRemove={() => dispatch(removeDocument("business_registration"))}
              error={formErrors.business_registration}
              file={findDocument("business_registration")?.file}
              progress={uploadProgress.business_registration}
            />
          </div>

          {/* Additional Documents */}
          <div>
            <FileUploader
              id="additional_doc"
              label="Additional Documents (Optional)"
              description="Any other relevant business documents"
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
        </div>
      </section>

      {/* Business Details Section */}
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Business Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Registered Business Name*"
            name="businessName"
            value={businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            placeholder="As per KRA"
            error={formErrors.businessName}
          />

          <TextField
            label="Trading Name (if different)"
            name="tradingName"
            value={tradingName}
            onChange={(e) => handleInputChange("tradingName", e.target.value)}
          />

          <TextField
            label="Physical Address*"
            name="address"
            value={address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            error={formErrors.address}
          />

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="City*"
              name="city"
              value={city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              error={formErrors.city}
            />

            <TextField
              label="Postal Code*"
              name="postalCode"
              value={postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              error={formErrors.postalCode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type*
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {businessTypes.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="businessType"
                    checked={businessType === option.value}
                    onChange={() =>
                      handleInputChange("businessType", option.value)
                    }
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {formErrors.businessType && (
              <p className="mt-1 text-xs text-red-500">
                {formErrors.businessType}
              </p>
            )}
          </div>

          <TextField
            label="Industry/Sector*"
            name="industry"
            value={industry}
            onChange={(e) => handleInputChange("industry", e.target.value)}
            error={formErrors.industry}
          />
        </div>
      </section>

      {/* Next Steps Info */}
      <InfoBox
        title="Next Steps"
        items={[
          "Documents will be verified within 2 business days.",
          "You'll receive an email/SMS once approved.",
          "After approval, you'll complete owner and bank details.",
        ]}
        variant="info"
        className="mb-8"
      />
    </>
  );
};
