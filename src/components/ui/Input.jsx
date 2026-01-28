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
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            aria-label={rightIconLabel}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
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
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${icon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-primary-200 focus:border-primary-500"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
