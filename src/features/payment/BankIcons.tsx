import { ReactNode } from "react";

export const BankIcon = ({
  bankCode,
  className = "",
}: {
  bankCode: string;
  className?: string;
}) => {
  const getBankIcon = (code: string): ReactNode => {
    // In a real app, you would use actual bank logos
    switch (code) {
      case "HDFC":
        return "🏦";
      case "ICICI":
        return "🏛️";
      case "SBI":
        return "🏢";
      case "AXIS":
        return "🏤";
      default:
        return "🏦";
    }
  };

  return (
    <span className={`text-lg ${className}`}>{getBankIcon(bankCode)}</span>
  );
};
