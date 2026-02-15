import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DoctorSidebar = ({ user }) => {
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
    { label: "Dashboard", icon: "🏠", to: "/doctor/dashboard" },
    { label: "Appointments", icon: "📅", to: "/doctor/appointments" },
    { label: "Availability", icon: "🕐", to: "/doctor/availability" },
    { label: "Patients", icon: "👥", to: "/doctor/patients" },
    { label: "Notifications", icon: "🔔", to: "/doctor/notifications" },
    { label: "Profile", icon: "👤", to: "/doctor/profile" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">MediCare</h1>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </div>
        </div>
      </div>

      <nav className="px-4">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left mb-1 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
            {initials || "DR"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">{user?.email || ""}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100"
        >
          <span>Logout</span>
          <span aria-hidden>🚪</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
