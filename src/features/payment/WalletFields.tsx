export const WalletFields = ({ register, errors }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Digital Wallet</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Wallet
        </label>
        <div className="grid grid-cols-2 gap-3">
          {["paypal", "amazonpay", "googlepay", "applepay"].map((wallet) => (
            <div key={wallet} className="flex items-center">
              <input
                id={`wallet-${wallet}`}
                type="radio"
                value={wallet}
                {...register("wallet.type")}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`wallet-${wallet}`}
                className="ml-2 block text-sm text-gray-700 capitalize"
              >
                {wallet}
              </label>
            </div>
          ))}
        </div>
        {errors.wallet?.type && (
          <p className="mt-1 text-sm text-red-600">
            {errors.wallet.type.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email (for PayPal)
        </label>
        <input
          {...register("wallet.email")}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">Note</h4>
        <p className="mt-1 text-sm text-blue-700">
          You'll be redirected to your wallet app or website to complete the
          payment authorization.
        </p>
      </div>
    </div>
  );
};
