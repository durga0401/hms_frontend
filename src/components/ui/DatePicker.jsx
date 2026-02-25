const DatePicker = ({
  label,
  value,
  onChange,
  availableDates = [],
  disabled,
}) => {
  // Format date for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    return { day, month, weekday, full: dateString };
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
        </label>
      )}
      {availableDates.length === 0 ? (
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            No dates available at this time.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {availableDates.map((date) => {
            const formatted = formatDate(date);
            const isSelected = value === date;

            return (
              <button
                key={date}
                type="button"
                disabled={disabled}
                onClick={() => onChange(date)}
                className={`
                  relative group flex flex-col items-center justify-center
                  min-w-[70px] px-4 py-3 rounded-xl border-2 
                  text-center font-medium transition-all duration-200
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white border-transparent shadow-lg shadow-primary-500/30 scale-105"
                      : "bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-md"
                  } 
                  ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {/* Weekday */}
                <span
                  className={`text-xs uppercase tracking-wider mb-1 ${isSelected ? "text-primary-100" : "text-gray-400"}`}
                >
                  {formatted.weekday}
                </span>

                {/* Day number */}
                <span
                  className={`text-xl font-bold ${isSelected ? "text-white" : "text-gray-800"}`}
                >
                  {formatted.day}
                </span>

                {/* Month */}
                <span
                  className={`text-xs font-medium ${isSelected ? "text-primary-100" : "text-gray-500"}`}
                >
                  {formatted.month}
                </span>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
