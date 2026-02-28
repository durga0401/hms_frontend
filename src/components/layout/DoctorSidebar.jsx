import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DoctorSidebar = ({ user, isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const name = user?.name || "Doctor";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const items = [
    {
      label: "Dashboard",
      to: "/doctor/dashboard",
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Appointments",
      to: "/doctor/appointments",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Availability",
      to: "/doctor/availability",
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Patients",
      to: "/doctor/patients",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: "Notifications",
      to: "/doctor/notifications",
      icon: (
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      label: "Profile",
      to: "/doctor/profile",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 shadow-xl flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-500 z-50"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header with gradient */}
        <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-xl shadow-lg">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                MediCare
              </h1>
              <p className="text-xs text-primary-100 font-medium">
                Doctor Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {/* <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Main Menu
        </p> */}
          {items.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30 scale-[1.02]"
                    : "text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:translate-x-1"
                }`
              }
            >
              <span className="transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 flex items-center gap-3 border border-primary-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
              {initials || "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {name}
              </p>
              <p className="text-xs text-primary-600 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-4 w-full group flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DoctorSidebar;
