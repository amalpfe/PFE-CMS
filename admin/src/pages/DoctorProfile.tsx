import { useState, useEffect } from "react";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";

const Profile = () => {
  const doctorId = 1; // Change dynamically as needed, e.g., route or auth context

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [doctor, setDoctor] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(null);
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

    fetchProfile();
  }, [doctorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle Save: sends formData including base64 image string
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

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>Doctor profile not found</div>;

  return (
    <DoctorLayout>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-4">
        <div className="flex flex-col items-center">
          {/* Preview Image */}
          <img
            src={formData.image || "/doctor-profile-image.jpg"}
            alt="Doctor"
            className="w-44 h-56 rounded-lg object-cover mb-6"
          />

          {editMode ? (
            <>
              <input
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="text-xl font-semibold text-center text-gray-800 border-b border-gray-300 mb-2"
                placeholder="First Name"
              />
              <input
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="text-xl font-semibold text-center text-gray-800 border-b border-gray-300 mb-2"
                placeholder="Last Name"
              />
              <input
                name="specialty"
                value={formData.specialty || ""}
                onChange={handleChange}
                className="text-gray-600 text-sm mt-1 text-center border-b border-gray-300 mb-4"
                placeholder="Specialty"
              />

              {/* Image Upload */}
              <div className="w-full border rounded p-2 mb-4">
                <label className="block mb-1 font-semibold">Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setFormData((prev: any) => ({
                          ...prev,
                          image: reader.result,
                          imageFile: file, // optional, if needed for backend upload
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {formData.image && (
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
                name="about"
                value={formData.about || ""}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded p-2"
                placeholder="Bio"
              />
              <input
                name="fees"
                value={formData.fees || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Appointment Fee"
              />
              <input
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Address"
              />
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold">About :</span>
                <br />
                {doctor.about}
              </p>
              <p>
                <span className="font-semibold">Appointment Fee :</span> {doctor.fees}
              </p>
              <p>
                <span className="font-semibold">Address :</span> {doctor.address}
              </p>
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
