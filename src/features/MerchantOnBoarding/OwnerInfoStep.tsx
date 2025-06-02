// src/components/registration/OwnerInfoStep.tsx
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  setField,
  clearError,
  addOwnerDocument,
  removeOwnerDocument,
} from "../../store/slices/business-registration";

import { FileUploader } from "../../components/ui/FileUpload";
import { TextField } from "../../components/ui/TextField";
import { InfoBox } from "../../components/ui/InfoBox";

// Constants
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const OwnerInfoStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    ownerFirstName,
    ownerLastName,
    ownerIdNumber,
    ownerEmail,
    ownerPhone,
    ownerAddress,
    ownerDocuments,
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

  // Handle file upload for owner documents
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
            addOwnerDocument({
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
    return ownerDocuments.find((doc) => doc.id === id);
  };

  return (
    <div className="space-y-8">
      {/* Owner Information Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Owner Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide personal details of the business owner
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TextField
              label="First Name*"
              name="ownerFirstName"
              value={ownerFirstName}
              onChange={(e) =>
                handleInputChange("ownerFirstName", e.target.value)
              }
              placeholder="Enter first name"
              error={formErrors.ownerFirstName}
              className="w-full"
            />

            <TextField
              label="Last Name*"
              name="ownerLastName"
              value={ownerLastName}
              onChange={(e) =>
                handleInputChange("ownerLastName", e.target.value)
              }
              placeholder="Enter last name"
              error={formErrors.ownerLastName}
              className="w-full"
            />

            <TextField
              label="ID/Passport Number*"
              name="ownerIdNumber"
              value={ownerIdNumber}
              onChange={(e) =>
                handleInputChange("ownerIdNumber", e.target.value)
              }
              placeholder="Enter ID or passport number"
              error={formErrors.ownerIdNumber}
              className="w-full"
            />
          </div>

          <div className="space-y-6">
            <TextField
              label="Email Address*"
              name="ownerEmail"
              type="email"
              value={ownerEmail}
              onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
              placeholder="Enter email address"
              error={formErrors.ownerEmail}
              className="w-full"
            />

            <TextField
              label="Phone Number*"
              name="ownerPhone"
              value={ownerPhone}
              onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
              placeholder="Enter phone number"
              error={formErrors.ownerPhone}
              className="w-full"
            />

            <TextField
              label="Residential Address*"
              name="ownerAddress"
              value={ownerAddress}
              onChange={(e) =>
                handleInputChange("ownerAddress", e.target.value)
              }
              placeholder="Enter residential address"
              error={formErrors.ownerAddress}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Identity Documents Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 flex items-center justify-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Identity Documents
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload required identity verification documents
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* ID/Passport Document */}
          <FileUploader
            id="id_document"
            label="ID/Passport Copy*"
            description="Clear copy of both sides of ID card or passport bio page"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) => handleFileUpload("id_document", file)}
            onRemove={() => dispatch(removeOwnerDocument("id_document"))}
            error={formErrors.id_document}
            file={findDocument("id_document")?.file}
            progress={uploadProgress.id_document}
          />

          {/* Proof of Address */}
          <FileUploader
            id="address_proof"
            label="Proof of Address*"
            description="Utility bill, bank statement, or rental agreement (not older than 3 months)"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) => handleFileUpload("address_proof", file)}
            onRemove={() => dispatch(removeOwnerDocument("address_proof"))}
            error={formErrors.address_proof}
            file={findDocument("address_proof")?.file}
            progress={uploadProgress.address_proof}
          />

          {/* Passport Photo */}
          <FileUploader
            id="passport_photo"
            label="Passport-sized Photo*"
            description="Recent photo with clear face (not older than 6 months)"
            acceptedFormats="JPG, PNG (Max 5MB)"
            onFileSelect={(file) => handleFileUpload("passport_photo", file)}
            onRemove={() => dispatch(removeOwnerDocument("passport_photo"))}
            error={formErrors.passport_photo}
            file={findDocument("passport_photo")?.file}
            progress={uploadProgress.passport_photo}
          />
        </div>
      </section>

      {/* Important Notice */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <InfoBox
          title="Important Notice"
          items={[
            "All documents must be clear, legible, and in color format",
            "Ensure personal information matches exactly across all documents",
            "Documents should not be older than the specified time limits",
            "False or fraudulent documents will result in application rejection and possible legal action",
          ]}
          variant="warning"
          className="border-0 bg-transparent shadow-none p-0"
        />
      </section>
    </div>
  );
};
