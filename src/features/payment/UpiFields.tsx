export const UpiFields = ({ register, errors }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">UPI Payment</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          UPI ID
        </label>
        <input
          {...register("upi.id")}
          placeholder="username@upi"
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.upi?.id ? "border-red-500" : ""
          }`}
        />
        {errors.upi?.id && (
          <p className="mt-1 text-sm text-red-600">{errors.upi.id.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="qr-code-toggle"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          {...register("upi.qrCode")}
        />
        <label
          htmlFor="qr-code-toggle"
          className="ml-2 block text-sm text-gray-700"
        >
          I have a UPI QR code to scan
        </label>
      </div>
    </div>
  );
};
