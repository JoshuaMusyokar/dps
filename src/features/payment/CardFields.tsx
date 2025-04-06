import { Controller, useFormContext } from "react-hook-form";
import { CardNumberInput } from "./CardNumberInput";
import { ExpiryInput } from "./ExpiryInput";
import { CvvInput } from "./CvvInput";
import { CardBrandSelect } from "./CardBrandSelect";

export const CardFields = ({ control, errors }: any) => {
  const { setValue } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Card Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <Controller
          name="card.number"
          control={control}
          render={({ field }) => (
            <CardNumberInput
              value={field.value}
              onChange={(value: string, brand: string) => {
                field.onChange(value);
                setValue("card.brand", brand);
              }}
              error={errors.card?.number}
            />
          )}
        />
        {errors.card?.number && (
          <p className="mt-1 text-sm text-red-600">
            {errors.card.number.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <Controller
            name={"card fields"}
            // name={["card", "expiryMonth", "card", "expiryYear"]}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ExpiryInput
                month={value?.[0]}
                year={value?.[1]}
                onChange={(month, year) => {
                  setValue("card.expiryMonth", month);
                  setValue("card.expiryYear", year);
                }}
                error={errors.card?.expiryMonth || errors.card?.expiryYear}
              />
            )}
          />
          {(errors.card?.expiryMonth || errors.card?.expiryYear) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.card?.expiryMonth?.message ||
                errors.card?.expiryYear?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <Controller
            name="card.cvv"
            control={control}
            render={({ field }) => (
              <CvvInput
                value={field.value}
                onChange={field.onChange}
                error={errors.card?.cvv}
              />
            )}
          />
          {errors.card?.cvv && (
            <p className="mt-1 text-sm text-red-600">
              {errors.card.cvv.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name
        </label>
        <input
          //   {...register("card.holderName")}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.card?.holderName ? "border-red-500" : ""
          }`}
        />
        {errors.card?.holderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.card.holderName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Brand
        </label>
        <Controller
          name="card.brand"
          control={control}
          render={({ field }) => (
            <CardBrandSelect value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );
};
