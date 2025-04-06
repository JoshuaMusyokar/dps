import { CardBrand } from "../../types";

const brandOptions = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "diners", label: "Diners Club" },
  { value: "jcb", label: "JCB" },
  { value: "unionpay", label: "UnionPay" },
  { value: "unknown", label: "Other" },
];

export const CardBrandSelect = ({
  value,
  onChange,
}: {
  value?: CardBrand;
  onChange: (value: CardBrand) => void;
}) => {
  const getBrandIcon = (brand: CardBrand) => {
    switch (brand) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      case "discover":
        return "💳";
      case "diners":
        return "💳";
      case "jcb":
        return "💳";
      case "unionpay":
        return "💳";
      default:
        return "💳";
    }
  };

  return (
    <div className="relative">
      <select
        value={value || "unknown"}
        onChange={(e) => onChange(e.target.value as CardBrand)}
        className="block w-full rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {brandOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {getBrandIcon(option.value as CardBrand)} {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
