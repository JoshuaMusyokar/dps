import React, { useState } from "react";

interface KYCFormProps {
  onSubmit: (data: KYCFormData) => Promise<void>;
  initialData?: Partial<KYCFormData>;
}

interface KYCFormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idType: "passport" | "nationalId" | "drivingLicense";
  idNumber: string;

  // Address Information
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Financial Information
  occupation: string;
  employerName: string;
  annualIncome: string;
  sourceOfFunds: string;

  // Bank Details
  bankName: string;
  accountNumber: string;
  accountType: "savings" | "checking" | "current";
  swiftCode: string;
  routingNumber: string;
}

const KYCForm: React.FC<KYCFormProps> = ({ onSubmit, initialData = {} }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<KYCFormData>>({
    idType: "passport",
    accountType: "current",
    ...initialData,
  });

  const [fileUploads, setFileUploads] = useState<{
    idFront: File | null;
    idBack: File | null;
    selfie: File | null;
    proofOfAddress: File | null;
  }>({
    idFront: null,
    idBack: null,
    selfie: null,
    proofOfAddress: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      setFileUploads({
        ...fileUploads,
        [name]: files[0],
      });
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep((step + 1) as 2 | 3 | 4);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form before submitting
      const requiredFields: (keyof KYCFormData)[] = [
        "fullName",
        "dateOfBirth",
        "nationality",
        "idType",
        "idNumber",
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "country",
        "occupation",
        "sourceOfFunds",
        "bankName",
        "accountNumber",
        "accountType",
      ];

      const missingFields = requiredFields.filter((field) => !formState[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      // Check if all required files are uploaded
      if (
        !fileUploads.idFront ||
        !fileUploads.selfie ||
        !fileUploads.proofOfAddress
      ) {
        throw new Error("Please upload all required documents");
      }

      // Call API to submit KYC form
      await onSubmit(formState as KYCFormData);

      // Show success message
      setSuccessMessage(
        "Your KYC information has been submitted successfully and is pending review."
      );
    } catch (err: any) {
      setError(
        err.message || "An error occurred while submitting your information."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Personal Information
      </h3>

      {/* ... existing personal info fields ... */}
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Address Information</h3>

      {/* ... existing address info fields ... */}
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Financial Information
      </h3>

      {/* ... existing financial info fields ... */}
    </div>
  );

  const renderBankInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>

      {/* ... existing bank info fields ... */}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderAddressInfo();
      case 3:
        return renderFinancialInfo();
      case 4:
        return renderBankInfo();
      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <div className="border-b pb-4">
      <nav className="flex justify-center" aria-label="Progress">
        <ol className="flex items-center space-x-5 sm:space-x-10">
          {[1, 2, 3, 4].map((stepNum) => (
            <li key={stepNum}>
              <div className="relative flex items-center">
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-full ${
                    stepNum < step
                      ? "bg-blue-600"
                      : stepNum === step
                      ? "ring-2 ring-blue-600 ring-offset-2 bg-white"
                      : "bg-gray-200"
                  }`}
                >
                  {stepNum < step ? (
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        stepNum === step ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {stepNum}
                    </span>
                  )}
                </div>
                <span className="sr-only">Step {stepNum}</span>
                <span className="hidden sm:block text-sm font-medium text-gray-500 ml-2">
                  {
                    {
                      1: "Personal",
                      2: "Address",
                      3: "Financial",
                      4: "Bank",
                    }[stepNum]
                  }
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

  if (successMessage) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <form onSubmit={handleSubmit}>
        {renderStepIndicator()}

        <div className="mt-10">{renderStepContent()}</div>

        <div className="mt-10 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit KYC"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default KYCForm;
