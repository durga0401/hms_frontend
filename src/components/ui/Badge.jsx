const Badge = ({
  status = "",
  variant = "",
  className = "",
  children,
  size = "md",
  dot = false,
}) => {
  const normalized = status?.toUpperCase();

  // Status-based styles (for appointments)
  const statusStyles = {
    PENDING: "bg-warning-100 text-warning-700 border-warning-200",
    CONFIRMED: "bg-success-100 text-success-700 border-success-200",
    CANCELLED: "bg-danger-100 text-danger-700 border-danger-200",
    COMPLETED: "bg-primary-100 text-primary-700 border-primary-200",
  };

  // Variant-based styles (for roles and general use)
  const variantStyles = {
    primary: "bg-primary-100 text-primary-700 border-primary-200",
    success: "bg-success-100 text-success-700 border-success-200",
    danger: "bg-danger-100 text-danger-700 border-danger-200",
    warning: "bg-warning-100 text-warning-700 border-warning-200",
    secondary: "bg-gray-100 text-gray-600 border-gray-200",
    accent: "bg-accent-100 text-accent-700 border-accent-200",
  };

  // Role-based styles
  const roleStyles = {
    ADMIN: "bg-danger-100 text-danger-700 border-danger-200",
    DOCTOR: "bg-success-100 text-success-700 border-success-200",
    PATIENT: "bg-primary-100 text-primary-700 border-primary-200",
  };

  // Dot colors for status indicators
  const dotColors = {
    PENDING: "bg-warning-500",
    CONFIRMED: "bg-success-500",
    CANCELLED: "bg-danger-500",
    COMPLETED: "bg-primary-500",
    ADMIN: "bg-danger-500",
    DOCTOR: "bg-success-500",
    PATIENT: "bg-primary-500",
  };

  // Size variants
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  // Determine which style to use
  let style = "bg-gray-100 text-gray-600 border-gray-200";
  if (variant && variantStyles[variant]) {
    style = variantStyles[variant];
  } else if (statusStyles[normalized]) {
    style = statusStyles[normalized];
  } else if (roleStyles[normalized]) {
    style = roleStyles[normalized];
  }

  // Display text: children first, then status
  const displayText = children || status;
  const dotColor = dotColors[normalized] || "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizes[size]} rounded-full font-semibold border ${style} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {displayText}
    </span>
  );
};

export default Badge;
