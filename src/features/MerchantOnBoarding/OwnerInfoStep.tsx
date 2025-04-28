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
    <>
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Owner Information
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          (All fields marked * are mandatory)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="First Name*"
            name="ownerFirstName"
            value={ownerFirstName}
            onChange={(e) =>
              handleInputChange("ownerFirstName", e.target.value)
            }
            error={formErrors.ownerFirstName}
          />

          <TextField
            label="Last Name*"
            name="ownerLastName"
            value={ownerLastName}
            onChange={(e) => handleInputChange("ownerLastName", e.target.value)}
            error={formErrors.ownerLastName}
          />

          <TextField
            label="ID/Passport Number*"
            name="ownerIdNumber"
            value={ownerIdNumber}
            onChange={(e) => handleInputChange("ownerIdNumber", e.target.value)}
            error={formErrors.ownerIdNumber}
          />

          <TextField
            label="Email Address*"
            name="ownerEmail"
            type="email"
            value={ownerEmail}
            onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
            error={formErrors.ownerEmail}
          />

          <TextField
            label="Phone Number*"
            name="ownerPhone"
            value={ownerPhone}
            onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
            error={formErrors.ownerPhone}
          />

          <TextField
            label="Residential Address*"
            name="ownerAddress"
            value={ownerAddress}
            onChange={(e) => handleInputChange("ownerAddress", e.target.value)}
            error={formErrors.ownerAddress}
          />
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Identity Documents
        </h3>

        <div className="space-y-6">
          {/* ID/Passport Document */}
          <div>
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
          </div>

          {/* Proof of Address */}
          <div>
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
          </div>

          {/* Passport Photo */}
          <div>
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
        </div>
      </section>
    </>
  );
};
