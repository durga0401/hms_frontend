const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = "",
  icon,
  iconPosition = "left",
}) => {
  const baseStyles =
    "font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 inline-flex items-center justify-center gap-2 transform active:scale-[0.98]";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-200 disabled:from-primary-300 disabled:to-primary-400 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-200 disabled:bg-gray-50 disabled:text-gray-400 border border-gray-200",
    danger:
      "bg-gradient-to-r from-danger-500 to-danger-600 text-white hover:from-danger-600 hover:to-danger-700 focus:ring-danger-200 disabled:from-danger-300 disabled:to-danger-400 shadow-lg shadow-danger-500/25",
    success:
      "bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 focus:ring-success-200 disabled:from-success-300 disabled:to-success-400 shadow-lg shadow-success-500/25",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-200 disabled:border-primary-200 disabled:text-primary-300 bg-transparent",
    ghost:
      "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200 disabled:text-gray-300",
    white:
      "bg-white text-gray-700 hover:bg-gray-50 focus:ring-white/50 shadow-lg border border-gray-100",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading ? (
        <svg
          className={`animate-spin ${iconSizes[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
