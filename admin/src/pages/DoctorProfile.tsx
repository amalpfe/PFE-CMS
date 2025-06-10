import { useState, useEffect } from "react";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  degree: string;
  experience: string;
  about: string;
  fees: string;
  address: string;
  image: string;
}

const DoctorProfile = () => {
  const storedDoctor = localStorage.getItem("doctor");
  const doctorData = storedDoctor ? JSON.parse(storedDoctor) : null;
  const doctorId = doctorData?.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<Doctor | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctor/profile/${doctorId}`);
        setDoctor(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchProfile();
  }, [doctorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/doctor/profile/${doctorId}`, formData);
      setDoctor(formData);
      setEditMode(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Try again.");
    }
  };

  const handleCancel = () => {
    setFormData(doctor);
    setEditMode(false);
  };

  if (!doctorId) {
    return <div className="text-center p-4 text-red-600">Unauthorized access</div>;
  }

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!doctor) return <div className="text-center p-4 text-red-500">Doctor profile not found</div>;

  return (
    <DoctorLayout>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-6">
        <div className="flex flex-col items-center">
          <img
            src={formData?.image || "/doctor-profile-image.jpg"}
            alt="Doctor"
            className="w-44 h-56 object-cover rounded mb-4"
          />

          {editMode ? (
            <>
              <input
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleChange}
                className="text-xl font-semibold text-center border-b border-gray-300 mb-2"
                placeholder="First Name"
              />
              <input
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleChange}
                className="text-xl font-semibold text-center border-b border-gray-300 mb-2"
                placeholder="Last Name"
              />
              <input
                name="specialty"
                value={formData?.specialty || ""}
                onChange={handleChange}
                className="text-gray-600 text-sm text-center border-b border-gray-300 mb-4"
                placeholder="Specialty"
              />

              <div className="w-full mb-4">
                <label className="block font-semibold mb-1">Upload New Image:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formData?.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-40 h-52 object-cover rounded"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-800">
                {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="text-gray-600 text-sm">
                {doctor.degree} - {doctor.specialty}
                <span className="ml-2 text-xs text-gray-500">({doctor.experience})</span>
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-gray-700 space-y-4">
          {editMode ? (
            <>
              <textarea
                name="about"
                value={formData?.about || ""}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded p-2"
                placeholder="Bio"
              />
              <input
                name="fees"
                value={formData?.fees || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Appointment Fee"
              />
              <input
                name="address"
                value={formData?.address || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Address"
              />
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold">About:</span> <br />
                {doctor.about}
              </p>
              <p>
                <span className="font-semibold">Appointment Fee:</span> {doctor.fees}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {doctor.address}
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-center space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
