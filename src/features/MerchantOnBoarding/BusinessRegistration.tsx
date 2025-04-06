import { useState, useRef, ChangeEvent } from "react";

type BusinessType =
  | "sole_proprietorship"
  | "partnership"
  | "limited_company"
  | "ngo_other";
type LicenseType = "single_business" | "county_trade" | "other";

export default function BusinessRegistration() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [kraPinFile, setKraPinFile] = useState<File | null>(null);
  const [licenseType, setLicenseType] = useState<LicenseType | "">("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([]);
  const [businessName, setBusinessName] = useState<string>("");
  const [tradingName, setTradingName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [businessType, setBusinessType] = useState<BusinessType | "">("");
  const [otherLicense, setOtherLicense] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "kra" | "license" | "additional"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "kra") {
      setKraPinFile(file);
    } else if (type === "license") {
      setLicenseFile(file);
    } else {
      setAdditionalDocs((prev) => [...prev, file]);
    }
  };

  const removeAdditionalDoc = (index: number) => {
    setAdditionalDocs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Merchant Onboarding</h1>
      <h2 className="text-xl font-semibold text-gray-700 mt-2">
        Business Registration
      </h2>

      {/* Progress Indicator */}
      <div className="mt-6 mb-8">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${
                    activeStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 ${
                    activeStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Business Details</span>
          <span>Owner Info</span>
          <span>Bank Details</span>
          <span>Review</span>
        </div>
      </div>

      {/* Upload Documents Section */}
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Upload Required Documents
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          (All fields marked * are mandatory)
        </p>

        {/* KRA PIN Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            KRA PIN Certificate*
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, "kra")}
              className="hidden"
              accept=".pdf,.jpg,.png"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100"
            >
              Browse files...
            </button>
            {kraPinFile && (
              <span className="ml-3 text-sm text-gray-700">
                {kraPinFile.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-red-500">
            {!kraPinFile &&
              "❗ Must be a valid KRA PIN registered under the business name."}
          </p>
        </div>

        {/* Business License Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business License/Permit*
          </label>
          <div className="flex flex-wrap gap-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="licenseType"
                checked={licenseType === "single_business"}
                onChange={() => setLicenseType("single_business")}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">
                Single Business Permit
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="licenseType"
                checked={licenseType === "county_trade"}
                onChange={() => setLicenseType("county_trade")}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">
                County Trade License
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="licenseType"
                checked={licenseType === "other"}
                onChange={() => setLicenseType("other")}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Other</span>
              {licenseType === "other" && (
                <input
                  type="text"
                  value={otherLicense}
                  onChange={(e) => setOtherLicense(e.target.value)}
                  placeholder="specify"
                  className="ml-2 px-2 py-1 text-sm border rounded"
                />
              )}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="file"
              ref={licenseInputRef}
              onChange={(e) => handleFileUpload(e, "license")}
              className="hidden"
              accept=".pdf,.jpg,.png"
            />
            <button
              onClick={() => licenseInputRef.current?.click()}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100"
            >
              Browse files...
            </button>
            {licenseFile && (
              <span className="ml-3 text-sm text-gray-700">
                {licenseFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Additional Documents */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Documents (Optional)
          </label>
          <div className="space-y-2">
            {additionalDocs.map((file, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  onClick={() => removeAdditionalDoc(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2">
            <input
              type="file"
              ref={additionalInputRef}
              onChange={(e) => handleFileUpload(e, "additional")}
              className="hidden"
              accept=".pdf,.jpg,.png"
            />
            <button
              onClick={() => additionalInputRef.current?.click()}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md border border-gray-200 hover:bg-gray-100"
            >
              Add More +
            </button>
          </div>
        </div>
      </section>

      {/* Business Details Section */}
      <section className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Business Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registered Business Name*
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="As per KRA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trading Name (if different)
            </label>
            <input
              type="text"
              value={tradingName}
              onChange={(e) => setTradingName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Physical Address*
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type*
            </label>
            <div className="space-y-2">
              {[
                { value: "sole_proprietorship", label: "Sole Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "limited_company", label: "Limited Company" },
                { value: "ngo_other", label: "NGO/Other" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="businessType"
                    checked={businessType === option.value}
                    onChange={() =>
                      setBusinessType(option.value as BusinessType)
                    }
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Info */}
      <div className="bg-blue-50 p-4 rounded-md mb-8">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Next Steps</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>
              Documents will be verified within <strong>2 business days</strong>
              .
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>You'll receive an email/SMS once approved.</span>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          ← Back
        </button>
        <button className="px-6 py-2 border border-transparent rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300">
          Save Draft
        </button>
        <button className="px-6 py-2 border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700">
          Continue →
        </button>
      </div>
    </div>
  );
}
