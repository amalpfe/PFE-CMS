import { useState } from "react";
import DoctorLayout from "../components/DoctorLayout";

const Profile = () => {
  const initialDoctor = {
    name: "Dr. Richard James",
    degree: "MBBS",
    specialty: "General Physician",
    experience: "4 Years",
    bio: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fee: "$50",
    address: "24 main street, 10 clause road",
    image: "/doctor-profile-image.jpg", // Replace with actual image path
    available: true,
  };

  const [doctor, setDoctor] = useState(initialDoctor);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialDoctor);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = () => {
    setDoctor(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(doctor);
    setEditMode(false);
  };

  return (
    <DoctorLayout>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-4">
        <div className="flex flex-col items-center">
          <img
            src={doctor.image}
            alt="Doctor"
            className="w-44 h-56 rounded-lg object-cover mb-6"
          />
          {editMode ? (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-xl font-semibold text-center text-gray-800 border-b border-gray-300"
              />
              <input
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="text-gray-600 text-sm mt-1 text-center border-b border-gray-300"
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-800">{doctor.name}</h1>
              <p className="text-gray-600">
                {doctor.degree} - {doctor.specialty}
                <span className="ml-2 text-sm text-gray-500">({doctor.experience})</span>
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-gray-700 space-y-4">
          {editMode ? (
            <>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded p-2"
              />
              <input
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Appointment Fee"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Address"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="form-checkbox text-blue-600"
                />
                <label className="text-sm text-gray-600">Available</label>
              </div>
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold">About :</span>
                <br />
                {doctor.bio}
              </p>
              <p>
                <span className="font-semibold">Appointment Fee :</span> {doctor.fee}
              </p>
              <p>
                <span className="font-semibold">Address :</span> {doctor.address}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={doctor.available}
                  readOnly
                  className="form-checkbox text-blue-600"
                />
                <label className="text-sm text-gray-600">Available</label>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center space-x-3">
          {editMode ? (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Profile;
