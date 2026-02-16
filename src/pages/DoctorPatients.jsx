import { useEffect, useState } from "react";
import { doctorAPI } from "../services/api";
import { Badge, Card, EmptyState, Input, Loader } from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const DoctorPatients = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getMyAppointments();
      setAppointments(res.data?.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Extract unique patients from appointments
  const patientsMap = new Map();
  appointments.forEach((appt) => {
    if (appt.patient_id && !patientsMap.has(appt.patient_id)) {
      patientsMap.set(appt.patient_id, {
        id: appt.patient_id,
        name: appt.patient_name || "Patient",
        email: appt.patient_email || "",
        phone: appt.patient_phone || "",
        appointmentCount: 0,
        lastVisit: null,
      });
    }
    if (appt.patient_id) {
      const p = patientsMap.get(appt.patient_id);
      p.appointmentCount += 1;
      const apptDate = appt.appointment_date?.includes("T")
        ? appt.appointment_date.split("T")[0]
        : appt.appointment_date;
      if (!p.lastVisit || apptDate > p.lastVisit) {
        p.lastVisit = apptDate;
      }
    }
  });

  const patients = Array.from(patientsMap.values());

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar user={user} />
      <div className="flex-1">
        <DoctorNavbar title="Patients" />
        <main className="p-6">
          <div className="max-w-4xl space-y-6">
            {/* Search */}
            <Card>
              <Input
                placeholder="Search patients by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Card>

            {/* Patients List */}
            {loading ? (
              <Loader />
            ) : filteredPatients.length === 0 ? (
              <EmptyState
                title="No patients found"
                description={
                  search
                    ? "No patients match your search."
                    : "You have no patients with appointments yet."
                }
              />
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Patient
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Contact
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Appointments
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Last Visit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                                {(patient.name[0] || "P").toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-800">
                                {patient.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {patient.email || patient.phone || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="primary">
                              {patient.appointmentCount}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(patient.lastVisit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorPatients;
