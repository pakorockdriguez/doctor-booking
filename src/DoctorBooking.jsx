import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import doctorData from "./data/doctors.json";

const mockDoctors = doctorData;
const specialties = [
  "All",
  ...Array.from(new Set(mockDoctors.flatMap((doc) => doc.specialty))),
];
const availabilities = [
  "All",
  ...Array.from(
    new Set(
      mockDoctors
        .flatMap((doc) => doc.availability)
        .map((time) => time.split(" ")[0])
    )
  ),
];

export default function DoctorBooking() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [doctors, setDoctors] = useState(mockDoctors);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

    const matchesAvailability =
      selectedAvailability === "All" ||
      doc.availability.some((slot) =>
        slot.toLowerCase().includes(selectedAvailability.toLowerCase())
      );

    return matchesSpecialty && matchesAvailability;
  });

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const confirmAppointment = () => {
    setAppointments((prev) => [
      ...prev,
      {
        doctorName: selectedDoctor.name,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        location: selectedDoctor.location,
      },
    ]);

    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.id === selectedDoctor.id
          ? {
              ...doc,
              availability: doc.availability.filter(
                (time) => time !== selectedTime
              ),
            }
          : doc
      )
    );

    setSelectedDoctor(null);
    setSelectedTime("");
  };

  const handleDeleteAppointment = (indexToDelete) => {
    const apptToRemove = appointments[indexToDelete];
    setAppointments((prev) => prev.filter((_, i) => i !== indexToDelete));
    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.name === apptToRemove.doctorName
          ? {
              ...doc,
              availability: [...doc.availability, apptToRemove.time].sort(
                (a, b) => {
                  // Opcional: ordena por día/hora si quieres
                  return a.localeCompare(b);
                }
              ),
            }
          : doc
      )
    );
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Book a Doctor Appointment</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label
            htmlFor="specialty"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Specialty
          </label>
          <select
            id="specialty"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="mt-1 block w-full sm:w-64 border-gray-300 rounded-md shadow-sm"
          >
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="availability"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Availability
          </label>
          <select
            id="availability"
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="mt-1 block w-full sm:w-64 border-gray-300 rounded-md shadow-sm"
          >
            {availabilities.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDoctors.map((doc, index) => (
          <Card
            key={doc.id}
            name={doc.name}
            specialty={doc.specialty}
            rating={doc.rating}
            availability={doc.availability.join(", ")}
            location={doc.location}
            photo={doc.photo}
            onBook={() => handleBook(doc)}
            loadingPriority={index === 0}
          />
        ))}
      </div>

      <Dialog open={!!selectedDoctor} onClose={() => setSelectedDoctor(null)}>
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <DialogPanel className="bg-white p-6 rounded-lg w-96 space-y-4">
            <DialogTitle className="text-xl font-semibold">
              Book with {selectedDoctor?.name}
            </DialogTitle>
            <p>Select a time slot:</p>
            <div className="flex flex-col gap-2">
              {selectedDoctor?.availability.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`w-full py-2 px-4 rounded border text-sm font-medium transition-colors
                  ${
                    selectedTime === time
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-blue-700 border-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setSelectedDoctor(null)} variant="ghost">
                Cancel
              </Button>
              <Button onClick={confirmAppointment} disabled={!selectedTime}>
                Confirm
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div>
        <h2 className="text-xl font-bold">My Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {appointments.map((appt, idx) => (
              <li
                key={idx}
                className="p-4 border rounded-md bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{appt.doctorName}</p>
                  <p>
                    {appt.specialty} - {appt.location}
                  </p>
                  <p className="text-sm text-gray-600">{appt.time}</p>
                </div>
                <button
                  onClick={() => handleDeleteAppointment(idx)}
                  className="ml-4 text-red-600 hover:underline text-sm"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}