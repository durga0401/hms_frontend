const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-500">
      <svg
        className="animate-spin h-5 w-5 text-primary-600"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
        />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Loader;
