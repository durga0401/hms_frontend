const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  icon,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <span className="text-gray-400 group-focus-within:text-primary-500 transition-colors">
              {icon}
            </span>
          </div>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-xl 
            focus:outline-none focus:ring-4 transition-all duration-200 
            appearance-none cursor-pointer
            text-gray-700 font-medium
            ${icon ? "pl-12" : "pl-4"}
            ${
              error
                ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500 bg-rose-50/50"
                : "border-gray-200 focus:ring-primary-100 focus:border-primary-500 hover:border-gray-300"
            }
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed text-gray-500"
                : "bg-white hover:shadow-md"
            }
          `}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="py-2">
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <div
            className={`
            p-1 rounded-full transition-colors
            ${error ? "text-rose-400" : "text-gray-400 group-focus-within:text-primary-500"}
          `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Focus ring effect */}
        <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:ring-4 group-focus-within:ring-primary-100"></div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-rose-600">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Select;
