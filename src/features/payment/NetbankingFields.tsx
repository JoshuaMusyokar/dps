import { BankIcon } from "./BankIcons";

const popularBanks = [
  { code: "HDFC", name: "HDFC Bank" },
  { code: "ICICI", name: "ICICI Bank" },
  { code: "SBI", name: "State Bank of India" },
  { code: "AXIS", name: "Axis Bank" },
  { code: "BOB", name: "Bank of Baroda" },
  { code: "CITI", name: "Citibank" },
  { code: "HSBC", name: "HSBC Bank" },
  { code: "YES", name: "Yes Bank" },
];

export const NetbankingFields = ({ register, errors }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Net Banking</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Bank
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularBanks.map((bank) => (
            <div key={bank.code} className="flex items-center">
              <input
                id={`bank-${bank.code}`}
                type="radio"
                value={bank.code}
                {...register("netbanking.bankCode")}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`bank-${bank.code}`}
                className="ml-2 block text-sm text-gray-700 flex items-center"
              >
                <BankIcon bankCode={bank.code} className="mr-2" />
                {bank.name}
              </label>
            </div>
          ))}
        </div>
        {errors.netbanking?.bankCode && (
          <p className="mt-1 text-sm text-red-600">
            {errors.netbanking.bankCode.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bank User ID (if required)
        </label>
        <input
          {...register("netbanking.userId")}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">How it works</h4>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>You'll be redirected to your bank's secure page</li>
          <li>Login with your net banking credentials</li>
          <li>Authorize the payment</li>
          <li>Return to merchant site</li>
        </ul>
      </div>
    </div>
  );
};
