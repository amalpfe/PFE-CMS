import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

type Address = {
  line1: string;
  line2: string;
};

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  address: Address;
  image: string;
  weight: number;
  height: number;
  geneticDiseases: string;
  chronicDiseases: string;
  allergies: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  maritalStatus: " " | "Single" | "Married" | "Divorced" | "Widowed";
  hasSurgery: boolean;
};

const MyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/patient/profile/${id}`);
        setUserData(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === "weight" || name === "height" ? Number(value) : value,
      };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setUserData((prev) => (prev ? { ...prev, image: base64Image } : prev));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userData || !id) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        addressLine1: userData.address.line1,
        addressLine2: userData.address.line2,
        image: userData.image,
        weight: userData.weight,
        height: userData.height,
        geneticDiseases: userData.geneticDiseases,
        chronicDiseases: userData.chronicDiseases,
        allergies: userData.allergies,
        bloodGroup: userData.bloodGroup,
        maritalStatus: userData.maritalStatus,
        hasSurgery: userData.hasSurgery,
      };
      const res = await axios.put(`http://localhost:5000/patient/profile/${id}`, payload);
      setSuccessMsg(res.data.message || "Profile updated successfully.");
      setIsEdit(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!userData) return null;

  const renderInputField = (
    label: string,
    name: keyof UserData,
    type: string = "text"
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEdit ? (
        <input
          type={type}
          name={name}
          value={(userData as any)[name]}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      ) : (
        <p className="mt-1 text-gray-800">{(userData as any)[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl p-6 space-y-8"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b pb-6">
          <div className="relative">
            <img
              src={userData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow"
            />
            {isEdit && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute top-full mt-2"
              />
            )}
          </div>
          <div className="text-center sm:text-left">
            {isEdit ? (
              <div className="flex gap-2 flex-col sm:flex-row">
                {renderInputField("First Name", "firstName")}
                {renderInputField("Last Name", "lastName")}
              </div>
            ) : (
              <h2 className="text-2xl font-bold">
                {userData.firstName} {userData.lastName}
              </h2>
            )}
            <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Contact Info</h3>
            {renderInputField("Phone Number", "phoneNumber")}
            {isEdit ? (
              <>
                {renderInputField("Address Line 1", "address.line1")}
                {renderInputField("Address Line 2", "address.line2")}
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-800 mt-1">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Basic Info</h3>
            {renderInputField("Date of Birth", "dateOfBirth", "date")}
            {renderInputField("Weight (kg)", "weight", "number")}
            {renderInputField("Height (cm)", "height", "number")}
            {renderInputField("Genetic Diseases", "geneticDiseases")}
            {renderInputField("Chronic Diseases", "chronicDiseases")}
            {renderInputField("Allergies", "allergies")}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              {isEdit ? (
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-800">{userData.gender}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              {isEdit ? (
                <select
                  name="bloodGroup"
                  value={userData.bloodGroup}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-gray-800">{userData.bloodGroup}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Marital Status</label>
              {isEdit ? (
                <select
                  name="maritalStatus"
                  value={userData.maritalStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-800">{userData.maritalStatus}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Had Surgery</label>
              {isEdit ? (
                <select
                  name="hasSurgery"
                  value={userData.hasSurgery ? "true" : "false"}
                  onChange={(e) =>
                    setUserData((prev) => prev ? { ...prev, hasSurgery: e.target.value === "true" } : prev)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-800">{userData.hasSurgery ? "Yes" : "No"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}
          <motion.button
            onClick={isEdit ? handleSave : () => setIsEdit(true)}
            className={`px-6 py-2 rounded-lg text-white transition ${
              isEdit ? "bg-green-500 hover:bg-green-600" : "bg-purple-600 hover:bg-purple-700"
            }`}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {isEdit ? "Save Changes" : "Edit Profile"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
