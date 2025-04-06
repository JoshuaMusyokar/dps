import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../../validations/paymentSchema";
import { PaymentDetails, PaymentMethod } from "../../types";
// import { CardBrandSelect, CardNumberInput, ExpiryInput, CvvInput } from './CardFields'
import { BankFields } from "./BankFields";
import { UpiFields } from "./UpiFields";
import { NetbankingFields } from "./NetbankingFields";
import { CardFields } from "./CardFields";
import { WalletFields } from "./WalletFields";

export const PaymentForm = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<PaymentDetails>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: "card",
      currency: "USD",
    },
  });

  const selectedMethod = watch("method");

  const onSubmit = (data: PaymentDetails) => {
    console.log("Payment data:", data);
    // Here you would normally call your payment API
  };
  const methods = useForm<PaymentDetails>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: "card",
      currency: "USD",
    },
  });
  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Integration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.amount ? "border-red-500" : ""
                }`}
                step="0.01"
                min="0.01"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                {...register("currency")}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  "card",
                  "bank",
                  "upi",
                  "netbanking",
                  "wallet",
                ] as PaymentMethod[]
              ).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setValue("method", method)}
                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                    selectedMethod === method
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register("customer.name")}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.customer?.name ? "border-red-500" : ""
                  }`}
                />
                {errors.customer?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.customer.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("customer.email")}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.customer?.email ? "border-red-500" : ""
                  }`}
                />
                {errors.customer?.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.customer.email.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("customer.phone")}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.customer?.phone ? "border-red-500" : ""
                }`}
              />
              {errors.customer?.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.customer.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Specific Fields */}
          {selectedMethod === "card" && (
            <CardFields control={control} errors={errors} />
          )}
          {selectedMethod === "bank" && (
            <BankFields register={register} errors={errors} />
          )}
          {selectedMethod === "upi" && (
            <UpiFields register={register} errors={errors} />
          )}
          {selectedMethod === "netbanking" && (
            <NetbankingFields register={register} errors={errors} />
          )}
          {selectedMethod === "wallet" && (
            <WalletFields register={register} errors={errors} />
          )}

          {/* Billing Address */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="billing-address-toggle"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onChange={(e) => {
                  if (!e.target.checked) {
                    setValue("billingAddress", undefined);
                  }
                }}
              />
              <label
                htmlFor="billing-address-toggle"
                className="ml-2 block text-sm text-gray-700"
              >
                Add billing address
              </label>
            </div>

            {watch("billingAddress") !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    {...register("billingAddress.line1")}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.billingAddress?.line1 ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.line1 && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.billingAddress.line1.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    {...register("billingAddress.line2")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    {...register("billingAddress.city")}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.billingAddress?.city ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.billingAddress.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    {...register("billingAddress.state")}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.billingAddress?.state ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.billingAddress.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    {...register("billingAddress.postalCode")}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.billingAddress?.postalCode ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.billingAddress.postalCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    {...register("billingAddress.country")}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.billingAddress?.country ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.billingAddress.country.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
