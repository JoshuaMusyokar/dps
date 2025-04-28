// src/pages/BusinessRegistration.tsx
import React, { useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  setCurrentStep,
  setSubmitting,
  saveDraft,
  setErrors,
} from "../../store/slices/business-registration";
import { ProgressStepper } from "../../components/ui/ProgressStepper";
import { Button } from "../../components/ui/Button";
import { BusinessDetailsStep } from "./BusinessDetailsStep";
import { OwnerInfoStep } from "./OwnerInfoStep";
import { BankDetailsStep } from "./BankDetailStep";
import { ReviewStep } from "./ReviewStep";

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

  const {
    currentStep,
    formErrors,
    isSubmitting,
    businessName,
    address,
    businessType,
    licenseType,
    otherLicenseType,
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
  } = useAppSelector((state) => state.registration);

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 1 validation
    if (currentStep === 1) {
      if (!businessName) newErrors.businessName = "Business name is required";
      if (!address) newErrors.address = "Address is required";
      if (!businessType) newErrors.businessType = "Business type is required";
      if (!licenseType) newErrors.licenseType = "License type is required";
      if (licenseType === "other" && !otherLicenseType) {
        newErrors.otherLicenseType = "Please specify license type";
      }

      // Required documents
      const requiredDocs = [
        "kra_pin",
        "business_license",
        "business_registration",
      ];
      requiredDocs.forEach((docId) => {
        if (!documents.some((doc) => doc.id === docId)) {
          newErrors[docId] = `This document is required`;
        }
      });
    }

    // Step 2 validation
    else if (currentStep === 2) {
      if (!ownerFirstName) newErrors.ownerFirstName = "First name is required";
      if (!ownerLastName) newErrors.ownerLastName = "Last name is required";
      if (!ownerIdNumber)
        newErrors.ownerIdNumber = "ID/Passport number is required";
      if (!ownerEmail) newErrors.ownerEmail = "Email is required";
      if (!ownerPhone) newErrors.ownerPhone = "Phone number is required";
      if (!ownerAddress) newErrors.ownerAddress = "Address is required";

      // Required documents
      const requiredDocs = ["id_document", "address_proof", "passport_photo"];
      requiredDocs.forEach((docId) => {
        if (!ownerDocuments.some((doc) => doc.id === docId)) {
          newErrors[docId] = `This document is required`;
        }
      });
    }

    // Step 3 validation
    else if (currentStep === 3) {
      if (!bankName) newErrors.bankName = "Bank name is required";
      if (!accountNumber)
        newErrors.accountNumber = "Account number is required";
      if (!branchCode) newErrors.branchCode = "Branch code is required";
      if (!statementDocument)
        newErrors.bank_statement = "Bank statement is required";
    }

    // If there are errors, set them and return false
    if (Object.keys(newErrors).length > 0) {
      dispatch(setErrors(newErrors));
      return false;
    }

    return true;
  };

  // Submit final form
  const submitForm = () => {
    dispatch(setSubmitting(true));

    // Simulating API call
    setTimeout(() => {
      dispatch(setSubmitting(false));
      // In a real application, you would handle the response here
      alert("Form submitted successfully!");
    }, 2000);
  };

  // Handle navigation
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length) {
        dispatch(setCurrentStep(currentStep + 1));
      } else if (currentStep === STEPS.length) {
        submitForm();
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const handleSaveDraft = () => {
    dispatch(setSubmitting(true));
    // Simulate saving
    setTimeout(() => {
      dispatch(setSubmitting(false));
      dispatch(saveDraft());
      alert("Draft saved successfully!");
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

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Merchant Onboarding
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mt-2">
          Business Registration
        </h2>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <ProgressStepper
          steps={STEPS}
          activeStep={currentStep}
          compact={isMobile}
        />
      </div>

      {/* Form content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToNextStep();
        }}
      >
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-between pt-4 border-t border-gray-200 gap-2">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
          >
            ← Back
          </Button>

          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            loading={isSubmitting}
          >
            Save Draft
          </Button>

          <Button type="submit" variant="primary" loading={isSubmitting}>
            {getButtonText()}
          </Button>
        </div>
      </form>
    </div>
  );
}
// import { useState, useRef, ChangeEvent, FormEvent } from "react";
// import { useMediaQuery } from "../../hooks/useMediaQuery";
// import { ProgressStepper } from "../../components/ui/ProgressStepper";
// import { FileUploader } from "../../components/ui/FileUpload";
// import { RadioGroup } from "../../components/ui/RadioGroup";
// import { TextField } from "../../components/ui/TextField";
// import { InfoBox } from "../../components/ui/InfoBox";
// import { Button } from "../../components/ui/Button";

// // Types
// export type BusinessType =
//   | "sole_proprietorship"
//   | "partnership"
//   | "limited_company"
//   | "corporation"
//   | "ngo"
//   | "other";

// export type LicenseType =
//   | "single_business"
//   | "county_trade"
//   | "national"
//   | "other";

// export type DocumentFile = {
//   id: string;
//   file: File;
//   type: string;
//   uploaded: boolean;
//   validated: boolean;
// };

// export type BusinessRegistrationData = {
//   businessName: string;
//   tradingName: string;
//   address: string;
//   city: string;
//   postalCode: string;
//   country: string;
//   businessType: BusinessType | "";
//   taxId: string;
//   licenseType: LicenseType | "";
//   otherLicenseType: string;
//   documents: DocumentFile[];
//   industry: string;
//   yearEstablished: string;
//   employeeCount: string;
// };

// // Steps for the onboarding process
// const STEPS = [
//   { id: 1, label: "Business Details" },
//   { id: 2, label: "Owner Info" },
//   { id: 3, label: "Bank Details" },
//   { id: 4, label: "Review" },
// ];

// // File size limit in bytes (5MB)
// const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
// const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

// export default function BusinessRegistration() {
//   const isMobile = useMediaQuery("(max-width: 640px)");

//   // Form state
//   const [formData, setFormData] = useState<BusinessRegistrationData>({
//     businessName: "",
//     tradingName: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "Kenya", // Default country
//     businessType: "",
//     taxId: "",
//     licenseType: "",
//     otherLicenseType: "",
//     documents: [],
//     industry: "",
//     yearEstablished: "",
//     employeeCount: "",
//   });

//   // UI state
//   const [activeStep, setActiveStep] = useState<number>(1);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
//     {}
//   );

//   // Business types
//   const businessTypes = [
//     { value: "sole_proprietorship", label: "Sole Proprietorship" },
//     { value: "partnership", label: "Partnership" },
//     { value: "limited_company", label: "Limited Company" },
//     { value: "corporation", label: "Corporation" },
//     { value: "ngo", label: "NGO/Non-Profit" },
//     { value: "other", label: "Other" },
//   ];

//   // License types
//   const licenseTypes = [
//     { value: "single_business", label: "Single Business Permit" },
//     { value: "county_trade", label: "County Trade License" },
//     { value: "national", label: "National Business License" },
//     { value: "other", label: "Other" },
//   ];

//   const requiredDocuments = [
//     { id: "kra_pin", label: "KRA PIN Certificate", required: true },
//     {
//       id: "business_license",
//       label: "Business License/Permit",
//       required: true,
//     },
//     {
//       id: "business_registration",
//       label: "Business Registration Certificate",
//       required: true,
//     },
//   ];

//   // Handle form field changes
//   const handleInputChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error for this field if it exists
//     if (formErrors[name]) {
//       setFormErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (documentId: string, file: File) => {
//     // Validate file type and size
//     if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [documentId]: "Invalid file type. Please upload PDF, JPG, or PNG.",
//       }));
//       return;
//     }

//     if (file.size > FILE_SIZE_LIMIT) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [documentId]: "File size exceeds 5MB limit.",
//       }));
//       return;
//     }

//     // Clear error if exists
//     if (formErrors[documentId]) {
//       setFormErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[documentId];
//         return newErrors;
//       });
//     }

//     // Simulate upload progress
//     setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));

//     // Simulate upload
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         const current = prev[documentId] || 0;
//         const newProgress = Math.min(current + 10, 100);

//         if (newProgress === 100) {
//           clearInterval(interval);

//           // Add document to state after "upload" completes
//           setFormData((prev) => ({
//             ...prev,
//             documents: [
//               ...prev.documents.filter((doc) => doc.id !== documentId),
//               {
//                 id: documentId,
//                 file,
//                 type: file.type,
//                 uploaded: true,
//                 validated: false,
//               },
//             ],
//           }));
//         }

//         return { ...prev, [documentId]: newProgress };
//       });
//     }, 200);
//   };

//   // Remove document
//   const removeDocument = (documentId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       documents: prev.documents.filter((doc) => doc.id !== documentId),
//     }));

//     // Clear any errors for this document
//     if (formErrors[documentId]) {
//       setFormErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[documentId];
//         return newErrors;
//       });
//     }

//     // Clear upload progress
//     setUploadProgress((prev) => {
//       const newProgress = { ...prev };
//       delete newProgress[documentId];
//       return newProgress;
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     // Validate fields
//     const newErrors: Record<string, string> = {};

//     // Required fields
//     if (!formData.businessName)
//       newErrors.businessName = "Business name is required";
//     if (!formData.address) newErrors.address = "Address is required";
//     if (!formData.businessType)
//       newErrors.businessType = "Business type is required";
//     if (!formData.licenseType)
//       newErrors.licenseType = "License type is required";
//     if (formData.licenseType === "other" && !formData.otherLicenseType) {
//       newErrors.otherLicenseType = "Please specify license type";
//     }

//     // Required documents
//     requiredDocuments.forEach((doc) => {
//       if (!formData.documents.some((d) => d.id === doc.id)) {
//         newErrors[doc.id] = `${doc.label} is required`;
//       }
//     });

//     // If there are errors, display them and stop
//     if (Object.keys(newErrors).length > 0) {
//       setFormErrors(newErrors);
//       return;
//     }

//     // Set saving state
//     setIsSaving(true);

//     // Simulating API call
//     setTimeout(() => {
//       setIsSaving(false);
//       setActiveStep(2); // Move to next step
//       // Would typically send formData to backend API here
//     }, 1500);
//   };

//   // Handle navigation
//   const goBack = () => {
//     if (activeStep > 1) {
//       setActiveStep(activeStep - 1);
//     }
//   };

//   const saveAsDraft = () => {
//     // Implement draft saving logic
//     setIsSaving(true);
//     setTimeout(() => setIsSaving(false), 1000);
//     // Would typically save to local storage or backend
//   };

//   // Find a document by ID
//   const findDocument = (id: string) => {
//     return formData.documents.find((doc) => doc.id === id);
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
//       <form onSubmit={handleSubmit}>
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">
//             Merchant Onboarding
//           </h1>
//           <h2 className="text-xl font-semibold text-gray-700 mt-2">
//             Business Registration
//           </h2>
//         </div>

//         {/* Progress Stepper */}
//         <div className="mb-8">
//           <ProgressStepper
//             steps={STEPS}
//             activeStep={activeStep}
//             compact={isMobile}
//           />
//         </div>

//         {/* Upload Documents Section */}
//         <section className="mb-8">
//           <h3 className="text-lg font-medium text-gray-800 mb-4">
//             Upload Required Documents
//           </h3>
//           <p className="text-sm text-gray-500 mb-4">
//             (All fields marked * are mandatory)
//           </p>

//           <div className="space-y-6">
//             {/* KRA PIN Certificate */}
//             <div>
//               <FileUploader
//                 id="kra_pin"
//                 label="KRA PIN Certificate*"
//                 description="Must be a valid KRA PIN registered under the business name"
//                 acceptedFormats="PDF, JPG, PNG (Max 5MB)"
//                 onFileSelect={(file) => handleFileUpload("kra_pin", file)}
//                 onRemove={() => removeDocument("kra_pin")}
//                 error={formErrors.kra_pin}
//                 file={findDocument("kra_pin")?.file}
//                 progress={uploadProgress.kra_pin}
//               />
//             </div>

//             {/* Business License */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Business License/Permit*
//               </label>

//               <RadioGroup
//                 name="licenseType"
//                 options={licenseTypes}
//                 value={formData.licenseType}
//                 onChange={(value) => handleInputChange("licenseType", value)}
//                 error={formErrors.licenseType}
//               />

//               {formData.licenseType === "other" && (
//                 <TextField
//                   name="otherLicenseType"
//                   placeholder="Please specify"
//                   value={formData.otherLicenseType}
//                   onChange={(e) =>
//                     handleInputChange("otherLicenseType", e.target.value)
//                   }
//                   error={formErrors.otherLicenseType}
//                   className="mt-2 w-full max-w-xs"
//                 />
//               )}

//               <div className="mt-2">
//                 <FileUploader
//                   id="business_license"
//                   description="Upload your business license or permit"
//                   acceptedFormats="PDF, JPG, PNG (Max 5MB)"
//                   onFileSelect={(file) =>
//                     handleFileUpload("business_license", file)
//                   }
//                   onRemove={() => removeDocument("business_license")}
//                   error={formErrors.business_license}
//                   file={findDocument("business_license")?.file}
//                   progress={uploadProgress.business_license}
//                 />
//               </div>
//             </div>

//             {/* Business Registration Certificate */}
//             <div>
//               <FileUploader
//                 id="business_registration"
//                 label="Business Registration Certificate*"
//                 description="Certificate of registration/incorporation"
//                 acceptedFormats="PDF, JPG, PNG (Max 5MB)"
//                 onFileSelect={(file) =>
//                   handleFileUpload("business_registration", file)
//                 }
//                 onRemove={() => removeDocument("business_registration")}
//                 error={formErrors.business_registration}
//                 file={findDocument("business_registration")?.file}
//                 progress={uploadProgress.business_registration}
//               />
//             </div>

//             {/* Additional Documents */}
//             <div>
//               <FileUploader
//                 id="additional_doc"
//                 label="Additional Documents (Optional)"
//                 description="Any other relevant business documents"
//                 acceptedFormats="PDF, JPG, PNG (Max 5MB)"
//                 onFileSelect={(file) =>
//                   handleFileUpload(`additional_${Date.now()}`, file)
//                 }
//                 multiple
//                 additionalFiles={formData.documents
//                   .filter((doc) => doc.id.startsWith("additional_"))
//                   .map((doc) => ({
//                     id: doc.id,
//                     file: doc.file,
//                     onRemove: () => removeDocument(doc.id),
//                   }))}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Business Details Section */}
//         <section className="mb-8">
//           <h3 className="text-lg font-medium text-gray-800 mb-4">
//             Business Details
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <TextField
//               label="Registered Business Name*"
//               name="businessName"
//               value={formData.businessName}
//               onChange={(e) =>
//                 handleInputChange("businessName", e.target.value)
//               }
//               placeholder="As per KRA"
//               error={formErrors.businessName}
//             />

//             <TextField
//               label="Trading Name (if different)"
//               name="tradingName"
//               value={formData.tradingName}
//               onChange={(e) => handleInputChange("tradingName", e.target.value)}
//             />

//             <TextField
//               label="Physical Address*"
//               name="address"
//               value={formData.address}
//               onChange={(e) => handleInputChange("address", e.target.value)}
//               error={formErrors.address}
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <TextField
//                 label="City*"
//                 name="city"
//                 value={formData.city}
//                 onChange={(e) => handleInputChange("city", e.target.value)}
//                 error={formErrors.city}
//               />

//               <TextField
//                 label="Postal Code*"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={(e) =>
//                   handleInputChange("postalCode", e.target.value)
//                 }
//                 error={formErrors.postalCode}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Business Type*
//               </label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {businessTypes.map((option) => (
//                   <label key={option.value} className="flex items-center">
//                     <input
//                       type="radio"
//                       name="businessType"
//                       checked={formData.businessType === option.value}
//                       onChange={() =>
//                         handleInputChange("businessType", option.value)
//                       }
//                       className="h-4 w-4 text-blue-600"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       {option.label}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               {formErrors.businessType && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {formErrors.businessType}
//                 </p>
//               )}
//             </div>

//             <TextField
//               label="Industry/Sector*"
//               name="industry"
//               value={formData.industry}
//               onChange={(e) => handleInputChange("industry", e.target.value)}
//               error={formErrors.industry}
//             />
//           </div>
//         </section>

//         {/* Next Steps Info */}
//         <InfoBox
//           title="Next Steps"
//           items={[
//             "Documents will be verified within 2 business days.",
//             "You'll receive an email/SMS once approved.",
//             "After approval, you'll complete owner and bank details.",
//           ]}
//           variant="info"
//           className="mb-8"
//         />

//         {/* Navigation Buttons */}
//         <div className="flex flex-wrap justify-between pt-4 border-t border-gray-200 gap-2">
//           <Button
//             variant="outline"
//             onClick={goBack}
//             disabled={activeStep === 1}
//           >
//             ← Back
//           </Button>

//           <Button variant="secondary" onClick={saveAsDraft} loading={isSaving}>
//             Save Draft
//           </Button>

//           <Button type="submit" variant="primary" loading={isSaving}>
//             Continue →
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
