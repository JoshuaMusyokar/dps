// components/Avatar.tsx
import React from "react";
import { User } from "lucide-react";
import { UserDetails } from "../../types";

interface AvatarProps {
  user?: UserDetails | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar: React.FC<AvatarProps> = ({
  user,
  size = "md",
  className = "",
}) => {
  const getInitials = () => {
    if (!user) return "";

    // Use first letters of first and last names if available
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(
        0
      )}`.toUpperCase();
    }

    // Fallback to first letter of first name or last name
    if (user.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user.last_name) return user.last_name.charAt(0).toUpperCase();

    // Fallback to email initial
    if (user.email) return user.email.charAt(0).toUpperCase();

    return "";
  };

  const getBackgroundColor = () => {
    // Generate consistent color based on user's name or email
    const nameToHash =
      user?.first_name || user?.last_name || user?.email || "user";
    let hash = 0;
    for (let i = 0; i < nameToHash.length; i++) {
      hash = nameToHash.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-fuchsia-500",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials();
  const bgColor = getBackgroundColor();

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {initials ? (
        <div
          className={`flex items-center justify-center h-full w-full ${bgColor} text-white font-medium`}
          aria-label={initials}
        >
          {initials}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">
          <User className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
