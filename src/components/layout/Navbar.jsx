import { useNavigate } from "react-router-dom";

const Navbar = ({
  title = "Patient Dashboard",
  searchValue = "",
  onSearchChange,
  onNewAppointment,
  onNotificationsClick,
  onMenuClick,
  showSearch = true,
  showNewAppointment = true,
}) => {
  const navigate = useNavigate();

  const handleNewAppointment = () => {
    if (onNewAppointment) {
      onNewAppointment();
      return;
    }
    navigate("/patient/appointments/book");
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
      return;
    }
    navigate("/patient/notifications");
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger menu for mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600"
            aria-label="Open menu"
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
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs font-medium text-primary-600 uppercase tracking-wider">
              Patient Portal
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search bar */}
          {showSearch && onSearchChange && (
            <div className="relative hidden md:block">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
              />
            </div>
          )}

          {/* Notifications */}
          <button
            type="button"
            onClick={handleNotificationsClick}
            className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200 border border-gray-100"
            aria-label="Open notifications"
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
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* New Appointment */}
          {showNewAppointment && (
            <button
              type="button"
              onClick={handleNewAppointment}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">New Appointment</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
