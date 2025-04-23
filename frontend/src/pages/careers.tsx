import { motion } from "framer-motion";

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

const Careers = () => {
  const positions = [
    {
      title: "Therapist",
      desc: "Provide emotional and mental health support to our clients through personalized sessions.",
    },
    {
      title: "Administrative Assistant",
      desc: "Help manage front-desk operations, client scheduling, and communication within the center.",
    },
    {
      title: "Nurse",
      desc: "Assist in patient care, administer medications, and support medical staff during procedures.",
    },
    {
      title: "General Practitioner (GP)",
      desc: "Provide primary care to patients, perform routine check-ups, diagnose and treat illnesses.",
    },
    {
      title: "Medical Technologist",
      desc: "Perform diagnostic tests, analyze lab results, and assist in the preparation of reports.",
    },
    {
      title: "Pharmacist",
      desc: "Dispense medications, provide advice on their use, and manage the pharmacy inventory.",
    },
    {
      title: "Medical Assistant",
      desc: "Assist healthcare providers with patient examinations, taking medical histories, and administrative tasks.",
    },
    {
      title: "Health Administrator",
      desc: "Oversee the operational aspects of the clinic, manage staff, and ensure compliance with healthcare regulations.",
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
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
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
          onClick={() => (window.location.href = "/contact")}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
        >
          Contact Us
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Careers;
