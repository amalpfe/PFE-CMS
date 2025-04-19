import { useState, ChangeEvent } from "react";
import img from "../assets/profile_pic.png";
//edit
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
  const [userData, setUserData] = useState<UserData>({
    name: "Ali Fakih",
    image: img,
    email: "alifakih@gmail.com",
    phone: "+961 71 777 111",
    address: {
      line1: "city, country",
      line2: "street, number",
    },
    gender: "Male",
    dob: "2004-02-24",
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-xl text-gray-800">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b pb-6">
        <img
          src={userData.image}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow"
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
        <div>
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
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
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
        </div>

        {/* Basic Info Section */}
        <div>
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
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {isEdit ? (
          <button
            onClick={() => setIsEdit(false)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
           Save
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
          >
          Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
