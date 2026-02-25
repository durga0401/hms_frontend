const Alert = ({ type = "info", message, onClose, className = "" }) => {
  const types = {
    success: {
      wrapper:
        "bg-gradient-to-r from-success-50 to-success-100/50 border-success-200",
      iconBg: "bg-success-500",
      text: "text-success-800",
      closeHover: "hover:bg-success-200",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    error: {
      wrapper:
        "bg-gradient-to-r from-danger-50 to-danger-100/50 border-danger-200",
      iconBg: "bg-danger-500",
      text: "text-danger-800",
      closeHover: "hover:bg-danger-200",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
    warning: {
      wrapper:
        "bg-gradient-to-r from-warning-50 to-warning-100/50 border-warning-200",
      iconBg: "bg-warning-500",
      text: "text-warning-800",
      closeHover: "hover:bg-warning-200",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      wrapper:
        "bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200",
      iconBg: "bg-primary-500",
      text: "text-primary-800",
      closeHover: "hover:bg-primary-200",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const style = types[type] || types.info;

  return (
    <div
      className={`${style.wrapper} ${style.text} border rounded-xl p-4 mb-4 animate-slide-down ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 ${style.iconBg} rounded-lg flex items-center justify-center shadow-lg`}
        >
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${style.closeHover}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
