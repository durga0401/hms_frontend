import { useMemo, useState } from "react";
import { Badge, Button, Card } from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const PatientPrescriptions = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("ALL");

  const prescriptions = [];

  const filteredPrescriptions = useMemo(() => {
    if (filter === "ALL") return prescriptions;
    return prescriptions.filter((item) => item.status === filter);
  }, [filter, prescriptions]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <div className="flex-1">
        <Navbar title="Prescriptions" />
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Prescriptions
              </h1>
              <p className="text-gray-500">
                Manage and download your prescriptions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {["ALL", "ACTIVE", "EXPIRED"].map((status) => (
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

          {filteredPrescriptions.length === 0 ? (
            <Card className="text-center text-gray-500">
              No prescriptions yet.
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">Dr. {item.doctor}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Issued on {item.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={item.status} />
                      <Button variant="secondary">Download</Button>
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

export default PatientPrescriptions;
