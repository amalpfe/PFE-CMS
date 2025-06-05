import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom"; // To use dynamic params

type Address = {
  line1: string;
  line2: string;
};

type UserData = {
  name: string;
  image: string;
  email: string;
  phone: string;
  address: Address;
  gender: "Male" | "Female";
  dob: string;
};

const MyProfile = () => {
  const { id } = useParams<{ id: string }>(); // Get userId from route params
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]); // Fetch profile based on the dynamic id from the URL

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

  const handleSave = async () => {
    if (!userData || !id) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.put(`http://localhost:5000/patient/profile/${id}`, userData);
      setSuccessMsg(res.data.message);
      setIsEdit(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <motion.img
          src={userData.image}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        />
        <div className="flex-1 text-center sm:text-left">
          {isEdit ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="text-2xl font-semibold border-b-2 border-purple-400 px-2 py-1 focus:outline-none w-full sm:w-auto"
            />
          ) : (
            <h2 className="text-2xl font-bold">{userData.name}</h2>
          )}
          <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Contact Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-purple-700">Contact Info</h3>
          <div className="mb-3">
            <label className="font-medium text-gray-600">Phone</label>
            {isEdit ? (
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="mt-1">{userData.phone}</p>
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
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }
                        : prev
                    )
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }
                        : prev
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

        {/* Basic Info Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
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
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            ) : (
              <p className="mt-1">{userData.dob}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Save / Edit Buttons */}
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

export default MyProfile;
