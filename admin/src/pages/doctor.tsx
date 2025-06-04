import React, { useRef, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import uploadIcon from "../assets/upload_area.svg";

const Doctors = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    degree: "",
    professional_registration_number: "",
    fees: "",
    about: "",
    image: "",
    hiringDate: "",
  });

  const [availability, setAvailability] = useState([
    { dayOfWeek: "", startTime: "", endTime: "" },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    setAvailability((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const addAvailability = () =>
    setAvailability((prev) => [...prev, { dayOfWeek: "", startTime: "", endTime: "" }]);

  const removeAvailability = (index: number) =>
    setAvailability((prev) => prev.filter((_, i) => i !== index));

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const userPayload = {
      username: formData.email,
      password: formData.password,
      email: formData.email,
      role: "Doctor",
    };

    // Register user
    const userRes = await axios.post("http://localhost:5000/auth/register", userPayload);
    console.log("User registration response:", userRes.data);

    // Get user ID from response - adjust keys as needed
    const userId = userRes.data?.id || userRes.data?.userId || userRes.data?.data?.id;

    if (!userId) {
      throw new Error("User ID not returned");
    }

    // Prepare doctor payload including userId
    const doctorPayload = {
      ...formData,
      userId,
      fees: parseFloat(formData.fees) || 0,
      availability,
    };

    // Create doctor profile
    const doctorRes = await axios.post("http://localhost:5000/doctor/createdoctor", doctorPayload);

    if (doctorRes.status === 201 || doctorRes.status === 200) {
      alert("Doctor added successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        specialty: "",
        phoneNumber: "",
        email: "",
        password: "",
        address: "",
        degree: "",
        professional_registration_number: "",
        fees: "",
        about: "",
        image: "",
        hiringDate: "",
      });
      setAvailability([{ dayOfWeek: "", startTime: "", endTime: "" }]);
    }

  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 409) {
        alert("This email is already registered. Please use another.");
      } else if (error.response.data?.message) {
        alert(error.response.data.message);
      } else {
        alert(`Failed to add doctor: ${error.response.statusText}`);
      }
      console.error("Backend error:", error.response.data);
    } else {
      alert("An unexpected error occurred. Please try again.");
      console.error("Error adding doctor:", error.message);
    }
  }
};



  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-xl max-h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Add Doctor</h1>

        {/* Image Upload */}
        <div className="flex justify-center mb-6">
          <div
            onClick={handleImageClick}
            className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg cursor-pointer overflow-hidden"
          >
            <img
              src={formData.image || uploadIcon}
              alt="Upload"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Input fields */}
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Address", name: "address" },
            { label: "Degree", name: "degree" },
            {
              label: "Professional Registration Number",
              name: "professional_registration_number",
            },
            { label: "Fees", name: "fees" },
            { label: "Hiring Date", name: "hiringDate", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label htmlFor={name} className="block font-semibold text-sm text-gray-700">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          ))}

          {/* Specialty Dropdown */}
          <div>
            <label htmlFor="specialty" className="block font-semibold text-sm text-gray-700">
              Specialty
            </label>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Specialty</option>
              {[
                "Cardiologist",
                "Dermatologist",
                "Pediatrician",
                "Orthopedic",
                "Neurologist",
                "Psychiatrist",
                "Gynecologist",
                "Dentist",
                "General Physician",
              ].map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* About */}
          <div className="md:col-span-2">
            <label htmlFor="about" className="block font-semibold text-sm text-gray-700">
              About
            </label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-sm text-gray-700 mb-2">
              Doctor Availability
            </label>
            {availability.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center mb-2"
              >
                <select
                  value={slot.dayOfWeek}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "dayOfWeek", e.target.value)
                  }
                  className="px-3 py-2 border rounded"
                  required
                >
                  <option value="">Day</option>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                    (day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    )
                  )}
                </select>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "startTime", e.target.value)
                  }
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    handleAvailabilityChange(index, "endTime", e.target.value)
                  }
                  className="px-3 py-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="text-red-600 font-bold"
                  disabled={availability.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAvailability}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Availability
            </button>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Doctors;
