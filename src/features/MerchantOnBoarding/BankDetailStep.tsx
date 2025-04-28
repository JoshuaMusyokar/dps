// src/components/registration/BankDetailsStep.tsx
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  setField,
  clearError,
  setStatementDocument,
} from "../../store/slices/business-registration";
import { FileUploader } from "../../components/ui/FileUpload";
import { TextField } from "../../components/ui/TextField";
import { InfoBox } from "../../components/ui/InfoBox";

// Constants
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const BankDetailsStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    bankName,
    accountNumber,
    branchCode,
    swiftCode,
    statementDocument,
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

  // Handle file upload for bank statement
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
            setStatementDocument({
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

  // Remove bank statement document
  const removeDocument = () => {
    dispatch(setStatementDocument(null));
  };

  return (
    <>
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Bank Account Details
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          (Account must be registered under the business name)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Bank Name*"
            name="bankName"
            value={bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            error={formErrors.bankName}
          />

          <TextField
            label="Account Number*"
            name="accountNumber"
            value={accountNumber}
            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
            error={formErrors.accountNumber}
          />

          <TextField
            label="Branch Code*"
            name="branchCode"
            value={branchCode}
            onChange={(e) => handleInputChange("branchCode", e.target.value)}
            error={formErrors.branchCode}
          />

          <TextField
            label="SWIFT/BIC Code (for international transfers)"
            name="swiftCode"
            value={swiftCode}
            onChange={(e) => handleInputChange("swiftCode", e.target.value)}
          />
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Bank Statement
        </h3>

        <div>
          <FileUploader
            id="bank_statement"
            label="Recent Bank Statement*"
            description="Statement from the last 3 months showing the business name"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) => handleFileUpload("bank_statement", file)}
            onRemove={removeDocument}
            error={formErrors.bank_statement}
            file={statementDocument?.file}
            progress={uploadProgress.bank_statement}
          />
        </div>
      </section>

      <InfoBox
        title="Important Information"
        items={[
          "Your bank account must be registered in the same business name.",
          "All payments will be processed to this account.",
          "Bank details cannot be changed without verification.",
        ]}
        variant="warning"
        className="mb-8"
      />
    </>
  );
};
