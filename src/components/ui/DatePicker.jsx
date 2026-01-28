const DatePicker = ({
  label,
  value,
  onChange,
  availableDates = [],
  disabled,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {availableDates.length === 0 ? (
        <p className="text-sm text-gray-500">No dates available.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {availableDates.map((date) => (
            <button
              key={date}
              type="button"
              disabled={disabled}
              onClick={() => onChange(date)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                value === date
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border-gray-200 text-gray-600 hover:border-primary-300"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {date}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
