export const BankFields = ({ register, errors }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">
        Bank Account Details
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Number
        </label>
        <input
          {...register("bank.accountNumber")}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.bank?.accountNumber ? "border-red-500" : ""
          }`}
        />
        {errors.bank?.accountNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.bank.accountNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Routing Number
          </label>
          <input
            {...register("bank.routingNumber")}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.bank?.routingNumber ? "border-red-500" : ""
            }`}
          />
          {errors.bank?.routingNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bank.routingNumber.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            {...register("bank.accountType")}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.bank?.accountType ? "border-red-500" : ""
            }`}
          >
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="current">Current</option>
          </select>
          {errors.bank?.accountType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bank.accountType.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Holder Name
        </label>
        <input
          {...register("bank.holderName")}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.bank?.holderName ? "border-red-500" : ""
          }`}
        />
        {errors.bank?.holderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.bank.holderName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          IFSC Code (India only)
        </label>
        <input
          {...register("bank.ifscCode")}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};
