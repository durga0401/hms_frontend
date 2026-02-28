import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Input,
  Loader,
  Modal,
  Select,
} from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const DoctorCard = ({ doctor, onViewAvailability }) => {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-lg">
          {doctor.name?.[0] || "D"}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Dr. {doctor.name}
          </h3>
          <p className="text-sm text-gray-500">
            {doctor.specialization || "General"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div>
          <p className="text-xs uppercase text-gray-400">Experience</p>
          <p className="font-medium">{doctor.experience || 0} years</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400">Qualification</p>
          <p className="font-medium">{doctor.qualification || "MBBS"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400">Consultation Fee</p>
          <p className="font-medium">₹{doctor.consultation_fee || 0}</p>
        </div>
      </div>
      <Button onClick={() => onViewAvailability(doctor)} variant="primary">
        View Availability
      </Button>
    </Card>
  );
};

const TimeSlotGrid = ({ slots = [] }) => {
  if (slots.length === 0) {
    return <p className="text-sm text-gray-500">No slots available.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="px-3 py-2 rounded-lg border text-sm font-medium border-gray-200 text-gray-600"
        >
          {slot.start_time}
          {slot.end_time ? ` - ${slot.end_time}` : ""}
        </div>
      ))}
    </div>
  );
};

const PatientDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const normalizeDate = (dateValue) => {
    if (!dateValue) return "";
    return String(dateValue).split("T")[0];
  };

  const normalizeTime = (timeValue) => {
    if (!timeValue) return "";
    return String(timeValue).slice(0, 5);
  };

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/doctors");
        setDoctors(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const specializationOptions = useMemo(() => {
    const unique = Array.from(
      new Set(doctors.map((doc) => doc.specialization).filter(Boolean)),
    );
    return unique.map((item) => ({ value: item, label: item }));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesSpec = specialization
        ? doctor.specialization === specialization
        : true;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, search, specialization]);

  const fetchAvailability = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    try {
      setAvailabilityLoading(true);
      const response = await api.get(`/doctors/${doctor.id}/availability`);
      const slots = (response.data?.data || []).map((slot) => ({
        ...slot,
        available_date: normalizeDate(slot.available_date),
        start_time: normalizeTime(slot.start_time),
        end_time: normalizeTime(slot.end_time),
      }));
      setAvailability(slots);
    } catch (err) {
      setAvailability([]);
      setError(
        err.response?.data?.message || "Failed to load doctor availability.",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const availabilityDates = useMemo(() => {
    const dates = availability.map((slot) => slot.available_date);
    return Array.from(new Set(dates));
  }, [availability]);

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return availability.filter((slot) => slot.available_date === selectedDate);
  }, [availability, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <Navbar
          title="Browse Doctors"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Doctors Directory
              </h1>
              <p className="text-gray-500">
                Search specialists and view availability.
              </p>
            </div>
            <Badge status="PATIENT" className="uppercase" />
          </div>

          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search Doctor"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
              />
              <Select
                label="Specialization"
                name="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                options={specializationOptions}
                placeholder="All specializations"
              />
              <div className="flex items-end">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setSpecialization("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </Card>

          {error && (
            <Card className="mb-4">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {loading ? (
            <Card className="text-center">
              <Loader label="Loading doctors..." />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewAvailability={fetchAvailability}
                />
              ))}
            </div>
          )}

          <Modal
            title="Doctor Availability"
            isOpen={!!selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
            size="xl"
          >
            {!selectedDoctor ? null : (
              <div className="space-y-6">
                <Card className="bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Dr. {selectedDoctor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedDoctor.specialization || "General"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Experience: {selectedDoctor.experience || 0} years</p>
                      <p>Fee: ₹{selectedDoctor.consultation_fee || 0}</p>
                    </div>
                  </div>
                </Card>

                {availabilityLoading ? (
                  <Loader label="Loading availability..." />
                ) : (
                  <>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      availableDates={availabilityDates}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Available Slots
                      </p>
                      <TimeSlotGrid slots={slotsForDate} />
                    </div>
                  </>
                )}
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default PatientDoctors;
