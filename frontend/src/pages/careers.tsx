import { useState } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  cv: File | null;
}

const Careers: React.FC = () => {
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    cv: null,
  });

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cv: file }));
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phone: value ?? '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send data to the server)
    console.log('Form Data:', formData);
    setShowModal(false); // Close modal after submit
  };

  const positions = [
    {
      title: 'Therapist',
      desc: 'Provide emotional and mental health support to our clients through personalized sessions.',
    },
    {
      title: 'Administrative Assistant',
      desc: 'Help manage front-desk operations, client scheduling, and communication within the center.',
    },
    {
      title: 'Nurse',
      desc: 'Assist in patient care, administer medications, and support medical staff during procedures.',
    },
    {
      title: 'General Practitioner (GP)',
      desc: 'Provide primary care to patients, perform routine check-ups, diagnose and treat illnesses.',
    },
    {
      title: 'Medical Technologist',
      desc: 'Perform diagnostic tests, analyze lab results, and assist in the preparation of reports.',
    },
    {
      title: 'Pharmacist',
      desc: 'Dispense medications, provide advice on their use, and manage the pharmacy inventory.',
    },
    {
      title: 'Medical Assistant',
      desc: 'Assist healthcare providers with patient examinations, taking medical histories, and administrative tasks.',
    },
    {
      title: 'Health Administrator',
      desc: 'Oversee the operational aspects of the clinic, manage staff, and ensure compliance with healthcare regulations.',
    },
  ];

  return (
    <motion.div
      className="px-6 md:px-16 py-16 bg-white text-gray-800"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center mb-12" variants={fadeInUp}>
        <h1 className="text-4xl font-bold text-purple-700 mb-2">Join Our Team</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Aeternum Sanctuary is always looking for passionate individuals to help us grow. Whether you're a medical professional, therapist, or support staff — we’d love to hear from you.
        </p>
      </motion.div>

      {/* Open Positions */}
      <motion.div className="grid md:grid-cols-2 gap-8" variants={containerVariant}>
        {positions.map((position, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 p-6 rounded-xl shadow-md"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-2 text-purple-600">
              {position.title}
            </h3>
            <p className="text-gray-700 mb-4">{position.desc}</p>
            <button
              onClick={handleModalToggle}
              className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition"
            >
              Apply Now
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* General Interest Section */}
      <motion.div className="mt-16 text-center" variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Don’t See a Role That Fits?</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          We’re always excited to meet talented people. Feel free to send your resume and we’ll reach out if a suitable position opens up!
        </p>
        <button
          onClick={() => (window.location.href = '/contact')}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
        >
          Contact Us
        </button>
      </motion.div>

      {/* Apply Now Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Application Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <PhoneInput
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            defaultCountry="LB" // Change defaultCountry to "LB" for Lebanon or any other country code
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
        
              </div>
              <div className="mb-4">
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                  Upload Your CV
                </label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                />
              </div>
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Careers;
