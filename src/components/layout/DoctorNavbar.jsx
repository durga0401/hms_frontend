import { useNavigate } from "react-router-dom";

const DoctorNavbar = ({ title = "Doctor Dashboard" }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
          H
        </div>
        <div>
          <p className="text-sm text-gray-500">Doctor Portal</p>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/doctor/notifications")}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          aria-label="View notifications"
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
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default DoctorNavbar;
