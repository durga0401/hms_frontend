const EmptyState = ({ title = "No data found", description, action }) => {
  return (
    <div className="text-center text-gray-500 py-10">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 9h8m-8 4h6m-2 7H6a2 2 0 01-2-2V6a2 2 0 012-2h9l5 5v9a2 2 0 01-2 2h-2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
