import { useState, useEffect, type ChangeEvent } from "react";
import axios from "axios";
import DoctorLayout from "../components/DoctorLayout";

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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get<Doctor>(
          `http://localhost:5000/doctor/profile/${doctorId}`
        );
        setDoctor(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !doctorId) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const response = await axios.put(
        `http://localhost:5000/doctor/profile/${doctorId}`,
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imagePath = response.data.image;
      setFormData((prev) => (prev ? { ...prev, image: imagePath } : null));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const saveProfile = async () => {
    if (!doctorId || !formData) return;

    try {
      await axios.put(
        `http://localhost:5000/doctor/profile/${doctorId}`,
        formData
      );
      setDoctor(formData);
      setIsEditing(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const cancelEdit = () => {
    setFormData(doctor);
    setIsEditing(false);
  };

  if (!doctorId) {
    return (
      <div className="text-center p-4 text-red-600">Unauthorized access</div>
    );
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="text-center p-4 text-red-500">
        Doctor profile not found
      </div>
    );
  }

  return (
    <DoctorLayout>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-6">
        <div className="flex flex-col items-center">
          <img
            src={formData?.image || "/doctor-profile-image.jpg"}
            alt={`${formData?.firstName} ${formData?.lastName}`}
            className="w-44 h-56 object-cover rounded mb-4"
          />

          {isEditing ? (
            <>
              <input
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleInputChange}
                className="text-xl font-semibold text-center border-b border-gray-300 mb-2"
                placeholder="First Name"
              />
              <input
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleInputChange}
                className="text-xl font-semibold text-center border-b border-gray-300 mb-2"
                placeholder="Last Name"
              />
              <input
                name="specialty"
                value={formData?.specialty || ""}
                onChange={handleInputChange}
                className="text-gray-600 text-sm text-center border-b border-gray-300 mb-4"
                placeholder="Specialty"
              />

              <div className="w-full mb-4">
                <label className="block font-semibold mb-1">
                  Upload New Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
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
                <span className="ml-2 text-xs text-gray-500">
                  ({doctor.experience})
                </span>
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-gray-700 space-y-4">
          {isEditing ? (
            <>
              <textarea
                name="about"
                value={formData?.about || ""}
                onChange={handleInputChange}
                rows={4}
                className="w-full border rounded p-2"
                placeholder="Bio"
              />
              <input
                name="fees"
                value={formData?.fees || ""}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Appointment Fee"
              />
              <input
                name="address"
                value={formData?.address || ""}
                onChange={handleInputChange}
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
                <span className="font-semibold">Appointment Fee:</span>{" "}
                {doctor.fees}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {doctor.address}
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={saveProfile}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
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
