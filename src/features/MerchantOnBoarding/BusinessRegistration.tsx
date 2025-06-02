// src/pages/BusinessRegistration.tsx
import React, { useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  setCurrentStep,
  setSubmitting,
  saveDraft,
  setErrors,
  setBusinessId,
  setStepSubmissionStatus,
  setSubmissionMessage,
  clearSubmissionMessage,
} from "../../store/slices/business-registration";
import { useSubmitBusinessDetailsMutation } from "../../store/apis/public-api";
import {
  prepareBusinessDetailsFormData,
  handleApiErrors,
} from "../../utils/form";
import { ProgressStepper } from "../../components/ui/ProgressStepper";
import { Button } from "../../components/ui/Button";
// import { Toast } from "../../components/ui/Toast"; // Assuming you have a Toast component
import { BusinessDetailsStep } from "./BusinessDetailsStep";
import { OwnerInfoStep } from "./OwnerInfoStep";
import { BankDetailsStep } from "./BankDetailStep";
import { ReviewStep } from "./ReviewStep";
import { Toast } from "../../components/ui/Toast";

// Steps for the onboarding process
const STEPS = [
  { id: 1, label: "Business Details" },
  { id: 2, label: "Owner Info" },
  { id: 3, label: "Bank Details" },
  { id: 4, label: "Review" },
];

export default function BusinessRegistration() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const dispatch = useAppDispatch();

  // RTK Query mutation
  const [
    submitBusinessDetails,
    {
      isLoading: isSubmittingBusinessDetails,
      error: businessDetailsError,
      isSuccess: businessDetailsSuccess,
    },
  ] = useSubmitBusinessDetailsMutation();

  const {
    currentStep,
    formErrors,
    isSubmitting,
    businessName,
    address,
    city,
    postalCode,
    businessType,
    licenseType,
    otherLicenseType,
    industry,
    documents,
    ownerFirstName,
    ownerLastName,
    ownerEmail,
    ownerPhone,
    ownerAddress,
    ownerIdNumber,
    ownerDocuments,
    bankName,
    accountNumber,
    branchCode,
    statementDocument,
    businessId,
    stepSubmissionStatus,
    submissionMessage,
  } = useAppSelector((state) => state.registration);

  // Handle API success/error states
  useEffect(() => {
    if (businessDetailsSuccess) {
      dispatch(setStepSubmissionStatus({ step: "step1", status: "success" }));
      dispatch(
        setSubmissionMessage("Business details submitted successfully!")
      );
    }
  }, [businessDetailsSuccess, dispatch]);

  useEffect(() => {
    if (businessDetailsError) {
      dispatch(setStepSubmissionStatus({ step: "step1", status: "error" }));
      const errors = handleApiErrors(businessDetailsError);
      dispatch(setErrors(errors));
    }
  }, [businessDetailsError, dispatch]);

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 1 validation
    if (currentStep === 1) {
      if (!businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!address.trim()) newErrors.address = "Address is required";
      if (!city.trim()) newErrors.city = "City is required";
      if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";
      if (!businessType) newErrors.businessType = "Business type is required";
      if (!licenseType) newErrors.licenseType = "License type is required";
      if (!industry.trim()) newErrors.industry = "Industry/sector is required";

      if (licenseType === "other" && !otherLicenseType?.trim()) {
        newErrors.otherLicenseType = "Please specify license type";
      }

      // Required documents validation
      const requiredDocs = [
        { id: "kra_pin", name: "KRA PIN Certificate" },
        { id: "business_license", name: "Business License" },
        {
          id: "business_registration",
          name: "Business Registration Certificate",
        },
      ];

      requiredDocs.forEach(({ id, name }) => {
        if (!documents.some((doc) => doc.id === id && doc.file)) {
          newErrors[id] = `${name} is required`;
        }
      });
    }

    // Step 2 validation
    else if (currentStep === 2) {
      if (!ownerFirstName.trim())
        newErrors.ownerFirstName = "First name is required";
      if (!ownerLastName.trim())
        newErrors.ownerLastName = "Last name is required";
      if (!ownerIdNumber.trim())
        newErrors.ownerIdNumber = "ID/Passport number is required";
      if (!ownerEmail.trim()) newErrors.ownerEmail = "Email is required";
      if (!ownerPhone.trim()) newErrors.ownerPhone = "Phone number is required";
      if (!ownerAddress.trim()) newErrors.ownerAddress = "Address is required";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (ownerEmail && !emailRegex.test(ownerEmail)) {
        newErrors.ownerEmail = "Please enter a valid email address";
      }

      // Required documents
      const requiredDocs = ["id_document", "address_proof", "passport_photo"];
      requiredDocs.forEach((docId) => {
        if (!ownerDocuments.some((doc) => doc.id === docId && doc.file)) {
          newErrors[docId] = `This document is required`;
        }
      });
    }

    // Step 3 validation
    else if (currentStep === 3) {
      if (!bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!accountNumber.trim())
        newErrors.accountNumber = "Account number is required";
      if (!branchCode.trim()) newErrors.branchCode = "Branch code is required";
      if (!statementDocument?.file)
        newErrors.bank_statement = "Bank statement is required";
    }

    // If there are errors, set them and return false
    if (Object.keys(newErrors).length > 0) {
      dispatch(setErrors(newErrors));
      return false;
    }

    // Clear any existing errors
    dispatch(setErrors({}));
    return true;
  };

  // Submit business details (Step 1)
  const submitStep1 = async () => {
    try {
      dispatch(setSubmitting(true));
      dispatch(setStepSubmissionStatus({ step: "step1", status: "pending" }));
      dispatch(clearSubmissionMessage());

      const formData = prepareBusinessDetailsFormData({
        businessName,
        tradingName: "",
        address,
        city,
        postalCode,
        country: "Kenya",
        businessType,
        taxId: "",
        licenseType,
        otherLicenseType,
        documents,
        industry,
        yearEstablished: "",
        employeeCount: "",
        ownerFirstName,
        ownerLastName,
        ownerIdNumber,
        ownerEmail,
        ownerPhone,
        ownerAddress,
        ownerDocuments,
        bankName,
        accountNumber,
        branchCode,
        swiftCode: "",
        statementDocument,
        currentStep,
        formErrors,
        isSubmitting,
        draftSaved: false,
      });

      const response = await submitBusinessDetails(formData).unwrap();

      // if (response.status_description && response.data?.id) {
      //   dispatch(setBusinessId(response.data.id));
      //   dispatch(setCurrentStep(2)); // Move to next step
      //   dispatch(
      //     setSubmissionMessage(
      //       response.message || "Business details submitted successfully!"
      //     )
      //   );
      // }
    } catch (error) {
      console.error("Error submitting business details:", error);
      // Error handling is done in useEffect above
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  // Handle navigation
  const goToNextStep = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Handle step-specific submissions
    if (currentStep === 1) {
      await submitStep1();
    } else if (currentStep === 2) {
      // Handle owner info submission (implement later)
      dispatch(setCurrentStep(currentStep + 1));
    } else if (currentStep === 3) {
      // Handle bank details submission (implement later)
      dispatch(setCurrentStep(currentStep + 1));
    } else if (currentStep === STEPS.length) {
      // Final submission (implement later)
      console.log("Final submission");
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
      dispatch(clearSubmissionMessage());
    }
  };

  const handleSaveDraft = () => {
    dispatch(setSubmitting(true));
    // Simulate saving
    setTimeout(() => {
      dispatch(setSubmitting(false));
      dispatch(saveDraft());
      dispatch(setSubmissionMessage("Draft saved successfully!"));
    }, 1000);
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessDetailsStep />;
      case 2:
        return <OwnerInfoStep />;
      case 3:
        return <BankDetailsStep />;
      case 4:
        return <ReviewStep />;
      default:
        return <BusinessDetailsStep />;
    }
  };

  // Get button text based on current step
  const getButtonText = () => {
    if (currentStep === STEPS.length) {
      return "Submit Application";
    }
    return "Continue →";
  };

  // Check if step can proceed
  const canProceed = () => {
    if (currentStep === 1) {
      return stepSubmissionStatus.step1 === "success" || !businessId;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-dark-primary-950/30 transition-colors duration-300">
      {/* Toast Notification */}
      {submissionMessage && (
        <Toast
          message={submissionMessage}
          type={stepSubmissionStatus.step1 === "error" ? "error" : "success"}
          onClose={() => dispatch(clearSubmissionMessage())}
        />
      )}

      {/* Main Container with Glassmorphism */}
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <div className="glass dark:glass-dark rounded-3xl shadow-soft-lg dark:shadow-glass-dark backdrop-blur-xl border border-white/20 dark:border-white/10 overflow-hidden">
          {/* Header with Gradient Background */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-dark-primary-900 dark:via-dark-primary-800 dark:to-accent-800 p-6 md:p-8">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-black/5 dark:to-black/10"></div>

            {/* Header Content */}
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in-down">
                Merchant Onboarding
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-white/90 animate-fade-in-down animation-delay-100">
                Business Registration
              </h2>

              {/* Show business ID if available */}
              {businessId && (
                <div className="mt-3 px-3 py-1 bg-green-500/20 rounded-lg">
                  <p className="text-sm text-white/90">
                    Registration ID:{" "}
                    <span className="font-mono">{businessId}</span>
                  </p>
                </div>
              )}

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 dark:bg-black/10 rounded-full blur-xl animate-pulse-glow"></div>
              <div className="absolute bottom-2 right-8 w-12 h-12 bg-accent-300/20 dark:bg-accent-700/20 rounded-full blur-lg animate-float"></div>
            </div>
          </div>

          {/* Progress Stepper Container */}
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/30 p-4 md:p-6">
            <ProgressStepper
              steps={STEPS.map((step, index) => ({
                ...step,
                status:
                  index + 1 < currentStep
                    ? "completed"
                    : index + 1 === currentStep
                    ? "current"
                    : "upcoming",
              }))}
              activeStep={currentStep}
              compact={isMobile}
            />
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToNextStep();
              }}
              className="space-y-6"
            >
              {/* Step Content with Animation */}
              <div className="animate-fade-in-up transition-all duration-500 ease-smooth">
                {renderStep()}
              </div>

              {/* Error Display */}
              {formErrors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                      {formErrors.general}
                    </p>
                  </div>
                </div>
              )}

              {/* Loading Indicator for API Calls */}
              {isSubmittingBusinessDetails && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                      Submitting business details...
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200/60 dark:border-gray-700/40 gap-4 sm:gap-2">
                {/* Back Button */}
                <Button
                  variant="outline"
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1 || isSubmittingBusinessDetails}
                  className="w-full sm:w-auto order-2 sm:order-1 
                    bg-white/80 dark:bg-gray-800/80 
                    border-gray-300 dark:border-gray-600 
                    text-gray-700 dark:text-gray-300 
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    hover:border-gray-400 dark:hover:border-gray-500
                    hover:text-gray-900 dark:hover:text-gray-100
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:bg-white/80 dark:disabled:hover:bg-gray-800/80
                    transition-all duration-300 ease-smooth
                    shadow-soft hover:shadow-soft-lg
                    backdrop-blur-sm"
                >
                  ← Back
                </Button>

                {/* Save Draft Button */}
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || isSubmittingBusinessDetails}
                  loading={isSubmitting && !isSubmittingBusinessDetails}
                  className="w-full sm:w-auto order-3 sm:order-2
                    bg-gray-100/80 dark:bg-gray-700/80
                    border-gray-200 dark:border-gray-600
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-200 dark:hover:bg-gray-600
                    hover:border-gray-300 dark:hover:border-gray-500
                    hover:text-gray-900 dark:hover:text-gray-100
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300 ease-smooth
                    shadow-soft hover:shadow-soft-lg
                    backdrop-blur-sm"
                >
                  Save Draft
                </Button>

                {/* Continue/Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    isSubmittingBusinessDetails ||
                    (currentStep === 1 &&
                      stepSubmissionStatus.step1 === "success" &&
                      !canProceed())
                  }
                  loading={isSubmittingBusinessDetails}
                  className="w-full sm:w-auto order-1 sm:order-3
                    bg-gradient-to-r from-primary-600 to-accent-600 
                    dark:from-dark-primary-800 dark:to-accent-700
                    border-none text-white font-semibold
                    hover:from-primary-700 hover:to-accent-700
                    dark:hover:from-dark-primary-900 dark:hover:to-accent-800
                    disabled:opacity-70 disabled:cursor-not-allowed
                    transition-all duration-300 ease-smooth
                    shadow-glow hover:shadow-glow-lg
                    transform hover:scale-105 active:scale-95
                    backdrop-blur-sm"
                >
                  {currentStep === 1 && stepSubmissionStatus.step1 === "success"
                    ? "Continue to Owner Info →"
                    : getButtonText()}
                </Button>
              </div>

              {/* Step Status Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4">
                {STEPS.map((step, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  let status = "idle";

                  if (stepNumber === 1) status = stepSubmissionStatus.step1;
                  else if (stepNumber === 2)
                    status = stepSubmissionStatus.step2;
                  else if (stepNumber === 3)
                    status = stepSubmissionStatus.step3;
                  else if (stepNumber === 4)
                    status = stepSubmissionStatus.final;

                  return (
                    <div
                      key={step.id}
                      className="flex items-center justify-center"
                    >
                      <div
                        className={`
                        px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
                        ${
                          isCompleted
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : isCurrent && status === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : isCurrent && status === "error"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : isCurrent && status === "pending"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : isCurrent
                            ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }
                      `}
                      >
                        {isCompleted || (isCurrent && status === "success")
                          ? "✓ "
                          : ""}
                        {step.label}
                        {isCurrent && status === "pending" && " ⏳"}
                        {isCurrent && status === "error" && " ✗"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          </div>

          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 dark:from-dark-primary-800 dark:via-accent-700 dark:to-dark-primary-900"></div>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-200/20 dark:bg-dark-primary-800/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-200/20 dark:bg-accent-800/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-100/10 via-transparent to-transparent dark:from-dark-primary-900/5 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
