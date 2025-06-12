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
};

const MyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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
        [name]: value,
      };
    });
  };

 const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setUserData((prev) =>
        prev ? { ...prev, image: base64Image } : prev
      );
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
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!userData) return null;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-xl text-gray-800">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b pb-6">
        <motion.div className="relative" variants={fadeIn} initial="hidden" animate="visible">
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
              className="absolute left-0 top-full mt-2"
            />
          )}
        </motion.div>

        <div className="flex-1 text-center sm:text-left">
          {isEdit ? (
            <div className="flex gap-2">
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="text-xl font-semibold border-b-2 border-purple-400 px-2 py-1 focus:outline-none w-full"
              />
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="text-xl font-semibold border-b-2 border-purple-400 px-2 py-1 focus:outline-none w-full"
              />
            </div>
          ) : (
            <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
          )}
          <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <h3 className="text-lg font-semibold mb-3 text-purple-700">Contact Info</h3>

          <div className="mb-3">
            <label className="font-medium text-gray-600">Phone</label>
            {isEdit ? (
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="mt-1">{userData.phoneNumber}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="font-medium text-gray-600">Address</label>
            {isEdit ? (
              <>
                <input
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev ? { ...prev, address: { ...prev.address, line1: e.target.value } } : prev
                    )
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev ? { ...prev, address: { ...prev.address, line2: e.target.value } } : prev
                    )
                  }
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                />
              </>
            ) : (
              <p className="mt-1">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <h3 className="text-lg font-semibold mb-3 text-purple-700">Basic Info</h3>

          <div className="mb-3">
            <label className="font-medium text-gray-600">Gender</label>
            {isEdit ? (
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="mt-1">{userData.gender}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="font-medium text-gray-600">Date of Birth</label>
            {isEdit ? (
              <input
                type="date"
                name="dateOfBirth"
                value={userData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="mt-1">{userData.dateOfBirth}</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        {successMsg && <p className="text-green-500">{successMsg}</p>}
        {isEdit ? (
          <motion.button
            onClick={handleSave}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Save
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setIsEdit(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Edit Profile
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MyProfile
