const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  rightIcon,
  onRightIconClick,
  rightIconLabel = "Toggle",
  hint,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  const iconSizes = {
    sm: "pl-9",
    md: "pl-11",
    lg: "pl-12",
  };

  const rightIconSizes = {
    sm: "pr-9",
    md: "pr-11",
    lg: "pr-12",
  };

  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
            {icon}
          </div>
        )}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            aria-label={rightIconLabel}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {rightIcon}
          </button>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full ${sizes[size]} border-2 rounded-xl
            focus:outline-none focus:ring-4 transition-all duration-200
            ${icon ? iconSizes[size] : ""}
            ${rightIcon ? rightIconSizes[size] : ""}
            ${
              error
                ? "border-danger-300 focus:ring-danger-100 focus:border-danger-500 bg-danger-50/50"
                : "border-gray-200 focus:ring-primary-100 focus:border-primary-500 hover:border-gray-300"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"}
            placeholder:text-gray-400
          `}
        />
      </div>
      {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}
      {error && (
        <p className="mt-2 text-sm text-danger-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
