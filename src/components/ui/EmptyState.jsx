const EmptyState = ({
  title = "No data found",
  description,
  action,
  icon,
  variant = "default",
}) => {
  const variants = {
    default: {
      bg: "from-primary-50 to-primary-100",
      iconBg: "from-primary-500 to-primary-700",
      iconColor: "text-white",
      border: "border-primary-100",
    },
    warning: {
      bg: "from-amber-50 to-orange-50",
      iconBg: "from-amber-500 to-orange-600",
      iconColor: "text-white",
      border: "border-amber-100",
    },
    success: {
      bg: "from-emerald-50 to-teal-50",
      iconBg: "from-emerald-500 to-teal-600",
      iconColor: "text-white",
      border: "border-emerald-100",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div
      className={`
      text-center py-16 px-6 
      bg-gradient-to-br ${style.bg} 
      rounded-2xl border ${style.border}
      transition-all duration-300
    `}
    >
      {/* Animated icon container */}
      <div className="relative mx-auto w-20 h-20 mb-6">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-20 blur-xl animate-pulse"></div>

        {/* Icon background */}
        <div
          className={`
          relative w-full h-full rounded-2xl 
          bg-gradient-to-br ${style.iconBg}
          flex items-center justify-center
          shadow-lg shadow-primary-500/30
          transform transition-transform hover:scale-105
        `}
        >
          {icon || (
            <svg
              className={`w-10 h-10 ${style.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {/* Action button */}
      {action && <div className="mt-6">{action}</div>}

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-200/30 to-primary-300/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-primary-200/30 to-primary-300/30 rounded-full blur-2xl"></div>
    </div>
  );
};

export default EmptyState;
