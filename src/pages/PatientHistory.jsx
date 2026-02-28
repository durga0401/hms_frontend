import { useMemo, useState } from "react";
import { Badge, Card } from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const PatientHistory = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const historyItems = [];

  const filteredHistory = useMemo(() => {
    if (filter === "ALL") return historyItems;
    return historyItems.filter((item) => item.type === filter);
  }, [filter, historyItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <Navbar title="History" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Medical History
              </h1>
              <p className="text-gray-500">Track your visits and treatments.</p>
            </div>
            <div className="flex items-center gap-2">
              {["ALL", "APPOINTMENT", "LAB", "PRESCRIPTION"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    filter === status
                      ? "bg-primary-600 text-white border-primary-600"
                      : "border-gray-200 text-gray-600 hover:border-primary-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <Card className="text-center text-gray-500">
              No medical history records yet.
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                      {item.type?.[0] || "H"}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <Badge status={item.type} />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientHistory;
