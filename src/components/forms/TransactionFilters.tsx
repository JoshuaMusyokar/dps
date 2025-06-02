import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const filterSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export const TransactionFilters = ({
  onSubmit,
}: {
  onSubmit: (values: FilterFormValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                selectsStart
                startDate={field.value}
                endDate={control._formValues.endDate}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-dark-primary-400 dark:focus:ring-dark-primary-400 sm:text-sm transition-colors duration-200"
                calendarClassName="dark:bg-gray-800 dark:border-gray-600"
                dayClassName={(date) =>
                  "dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-dark-primary-900/30"
                }
                monthClassName={() => "dark:text-gray-200"}
                timeClassName={() => "dark:text-gray-200"}
                weekDayClassName={() => "dark:text-gray-400"}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                selectsEnd
                startDate={control._formValues.startDate}
                endDate={field.value}
                minDate={control._formValues.startDate}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-dark-primary-400 dark:focus:ring-dark-primary-400 sm:text-sm transition-colors duration-200"
                calendarClassName="dark:bg-gray-800 dark:border-gray-600"
                dayClassName={(date) =>
                  "dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-dark-primary-900/30"
                }
                monthClassName={() => "dark:text-gray-200"}
                timeClassName={() => "dark:text-gray-200"}
                weekDayClassName={() => "dark:text-gray-400"}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-dark-primary-400 dark:focus:ring-dark-primary-400 sm:text-sm transition-colors duration-200"
          >
            <option value="">All</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Method
          </label>
          <select
            {...register("paymentMethod")}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-dark-primary-400 dark:focus:ring-dark-primary-400 sm:text-sm transition-colors duration-200"
          >
            <option value="">All</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="wallet">Digital Wallet</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-primary-600 dark:bg-dark-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 dark:hover:bg-dark-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Amount Range Filters (Optional - can be added) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("minAmount", { valueAsNumber: true })}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-dark-primary-400 dark:focus:ring-dark-primary-400 sm:text-sm transition-colors duration-200"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("maxAmount", { valueAsNumber: true })}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-dark-primary-400 dark:focus:ring-dark-primary-400 sm:text-sm transition-colors duration-200"
            placeholder="No limit"
          />
        </div>
      </div>
    </form>
  );
};
