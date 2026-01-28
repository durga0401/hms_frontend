const Navbar = ({
  title = "Patient Dashboard",
  searchValue = "",
  onSearchChange,
  onNewAppointment,
  showSearch = true,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
          H
        </div>
        <div>
          <p className="text-sm text-gray-500">Patient Portal</p>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search doctors, clinics..."
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              disabled={!onSearchChange}
              className="w-72 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        )}
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
            />
          </svg>
        </button>
        <button
          onClick={onNewAppointment}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
        >
          + New Appointment
        </button>
      </div>
    </header>
  );
};

export default Navbar;
