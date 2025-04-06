import { useEffect, useState } from "react";

export const ExpiryInput = ({
  month,
  year,
  onChange,
  error,
}: {
  month?: string;
  year?: string;
  onChange: (month: string, year: string) => void;
  error?: boolean;
}) => {
  const [monthValue, setMonthValue] = useState(month || "");
  const [yearValue, setYearValue] = useState(year || "");

  useEffect(() => {
    if (monthValue.length === 2 || yearValue.length === 4) {
      onChange(monthValue, yearValue);
    }
  }, [monthValue, yearValue, onChange]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.substring(0, 2);
    setMonthValue(value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    setYearValue(value);
  };

  return (
    <div
      className={`flex rounded-md border ${
        error ? "border-red-500" : "border-gray-300"
      } shadow-sm`}
    >
      <input
        type="text"
        value={monthValue}
        onChange={handleMonthChange}
        placeholder="MM"
        maxLength={2}
        className="w-1/2 rounded-l-md border-0 bg-transparent py-2 px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
      />
      <span className="flex items-center px-2 text-gray-500 sm:text-sm">/</span>
      <input
        type="text"
        value={yearValue}
        onChange={handleYearChange}
        placeholder="YYYY"
        maxLength={4}
        className="w-1/2 rounded-r-md border-0 bg-transparent py-2 px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
};
