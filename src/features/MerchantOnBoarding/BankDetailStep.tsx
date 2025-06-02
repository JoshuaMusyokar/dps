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
    <div className="space-y-8">
      {/* Bank Account Details Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Bank Account Details
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account must be registered under the business name
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TextField
              label="Bank Name*"
              name="bankName"
              value={bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
              placeholder="Select or enter bank name"
              error={formErrors.bankName}
              className="w-full"
            />

            <TextField
              label="Account Number*"
              name="accountNumber"
              value={accountNumber}
              onChange={(e) =>
                handleInputChange("accountNumber", e.target.value)
              }
              placeholder="Enter account number"
              error={formErrors.accountNumber}
              className="w-full"
            />
          </div>

          <div className="space-y-6">
            <TextField
              label="Branch Code*"
              name="branchCode"
              value={branchCode}
              onChange={(e) => handleInputChange("branchCode", e.target.value)}
              placeholder="Enter branch code"
              error={formErrors.branchCode}
              className="w-full"
            />

            <TextField
              label="SWIFT/BIC Code"
              name="swiftCode"
              value={swiftCode}
              onChange={(e) => handleInputChange("swiftCode", e.target.value)}
              placeholder="For international transfers (optional)"
              error={formErrors.swiftCode}
              className="w-full"
            />
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Account Verification
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                We'll verify your bank account details with your uploaded
                statement. Ensure all information matches exactly to avoid
                delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Statement Section */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-center">
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
              Bank Statement Upload
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide recent statement for account verification
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <FileUploader
            id="bank_statement"
            label="Recent Bank Statement*"
            description="Statement from the last 3 months showing the business name and account details"
            acceptedFormats="PDF, JPG, PNG (Max 5MB)"
            onFileSelect={(file) => handleFileUpload("bank_statement", file)}
            onRemove={removeDocument}
            error={formErrors.bank_statement}
            file={statementDocument?.file}
            progress={uploadProgress.bank_statement}
          />

          {/* Statement Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
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
                </div>
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Required Information
                </h4>
              </div>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <li>• Business name clearly visible</li>
                <li>• Account number matching above</li>
                <li>• Recent transactions (last 3 months)</li>
                <li>• Bank letterhead/logo</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Important Notes
                </h4>
              </div>
              <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <li>• No handwritten statements</li>
                <li>• Must be official bank document</li>
                <li>• Personal statements not accepted</li>
                <li>• Clear, legible scans only</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Notice */}
      <section className="glass dark:glass-dark rounded-2xl p-6 md:p-8 shadow-soft dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
        <InfoBox
          title="Security & Compliance Information"
          items={[
            "All bank details are encrypted and stored securely in compliance with banking regulations",
            "Your account information will only be used for business transaction processing",
            "Bank details cannot be changed without additional verification and documentation",
            "Any suspicious activity will be reported to relevant financial authorities",
            "We never store your full account details - only encrypted references for processing",
          ]}
          variant="warning"
          className="border-0 bg-transparent shadow-none p-0"
        />
      </section>
    </div>
  );
};
