import { useState, useEffect } from "react";

export const CardNumberInput = ({ value, onChange, error }: any) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value) {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setDisplayValue(formatted);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\s/g, "").replace(/\D/g, "");

    // Limit to 16-19 digits based on card type
    if (input.length > 19) input = input.substring(0, 19);

    // Detect card brand
    let brand = "unknown";
    if (/^4/.test(input)) brand = "visa";
    else if (/^5[1-5]/.test(input)) brand = "mastercard";
    else if (/^3[47]/.test(input)) brand = "amex";
    else if (/^6(?:011|5)/.test(input)) brand = "discover";
    else if (/^3(?:0[0-5]|[68])/.test(input)) brand = "diners";
    else if (/^(?:2131|1800|35)/.test(input)) brand = "jcb";
    else if (/^62/.test(input)) brand = "unionpay";

    onChange(input, brand);
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="1234 5678 9012 3456"
      className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
        error ? "border-red-500" : ""
      }`}
    />
  );
};
