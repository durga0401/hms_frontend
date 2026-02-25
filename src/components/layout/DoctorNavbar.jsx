import { useNavigate } from "react-router-dom";

const DoctorNavbar = ({ title = "Doctor Dashboard" }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
            Doctor Portal
          </p>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-200">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search patients..."
            className="bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 w-40"
          />
        </div>

        {/* Notification Button */}
        <button
          type="button"
          onClick={() => navigate("/doctor/notifications")}
          className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-600 transition-all duration-200 group"
          aria-label="View notifications"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:scale-110"
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
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* Quick Action */}
        <button
          type="button"
          onClick={() => navigate("/doctor/appointments")}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:scale-[1.02]"
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
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Appointments</span>
        </button>
      </div>
    </header>
  );
};

export default DoctorNavbar;
