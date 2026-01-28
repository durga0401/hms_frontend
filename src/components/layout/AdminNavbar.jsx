import React from "react";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
          <p className="text-sm text-gray-500">Hospital Management System</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
