const Loader = ({
  label = "Loading...",
  size = "md",
  variant = "default",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const variants = {
    default: "text-primary-600",
    white: "text-white",
    gray: "text-gray-400",
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Modern multi-ring spinner */}
      <div className="relative">
        {/* Outer glow */}
        <div
          className={`absolute inset-0 ${sizes[size]} rounded-full bg-primary-400/20 blur-md animate-pulse`}
        ></div>

        {/* Main spinner */}
        <svg
          className={`${sizes[size]} ${variants[variant]} animate-spin relative z-10`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        {/* Inner rotating ring */}
        {(size === "lg" || size === "xl") && (
          <div
            className={`absolute inset-0 flex items-center justify-center`}
            style={{ animation: "spin 1.5s linear infinite reverse" }}
          >
            <div
              className={`${size === "xl" ? "h-8 w-8" : "h-5 w-5"} rounded-full border-2 border-transparent border-t-primary-300 border-r-primary-300`}
            ></div>
          </div>
        )}
      </div>

      {/* Label with subtle animation */}
      {label && (
        <span
          className={`${textSizes[size]} font-medium text-gray-600 animate-pulse`}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">{spinnerContent}</div>
  );
};

export default Loader;
