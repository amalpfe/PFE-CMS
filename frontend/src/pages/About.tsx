import { motion } from "framer-motion";
import about_image from "../assets/about_image.png";

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

const About = () => {
  return (
    <motion.div
      className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 text-gray-800"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Section Header */}
      <motion.div className="text-center mb-12" variants={fadeInUp}>
        <p className="text-3xl font-bold text-purple-700">
          ABOUT<span className="text-purple-700"> US</span>
        </p>
        <div className="w-20 h-1 bg-purple-700 mx-auto mt-2 rounded-full"></div>
      </motion.div>

      {/* Image + Text Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
        <motion.div className="flex-1" variants={fadeInUp}>
          <img
            src={about_image}
            alt="About our clinic"
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </motion.div>

        <motion.div className="flex-1 space-y-6 text-justify" variants={fadeInUp}>
          {[
            {
              title: "Overview",
              content:
                "At AETERNUM SANCTUARY, we are committed to providing top-quality healthcare through compassionate care and cutting-edge technology. Our mission is to deliver exceptional services while ensuring that every patient feels valued and cared for.",
            },
            {
              title: "Our Clinic Environment",
              content:
                "Our clinic is designed to offer a peaceful, comfortable space where patients can feel at ease. With a skilled and caring team of doctors, nurses, and healthcare professionals, we provide personalized care and a broad spectrum of services.",
            },
            {
              title: "Efficient Clinic Management",
              content:
                "With our advanced clinic management system, we ensure seamless scheduling, billing, and medical records. This enables our staff to focus more on patient care and deliver a smooth, efficient experience.",
            },
          ].map((section, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <p className="text-xl font-semibold text-purple-700 mb-1">{section.title}</p>
              <p>{section.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <motion.div className="mt-12" variants={containerVariant}>
        <motion.div className="text-center mb-10" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-purple-700">Why Choose Us</h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Discover the key reasons why patients trust AETERNUM SANCTUARY for their healthcare needs.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Experienced Medical Team",
            "Patient-Centered Approach",
            "State-of-the-Art Technology",
            "Holistic Services",
            "Modern, Clean Facility",
            "Reliable Support",
          ].map((title, i) => (
            <motion.div
              key={i}
              className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-semibold text-purple-700 mb-2">{title}</h3>
              <p>
                {
                  [
                    "Our doctors and staff bring years of experience across various specialties, ensuring the best care possible.",
                    "We prioritize your comfort, communication, and involvement in every step of your healthcare journey.",
                    "We utilize modern equipment and innovative techniques for accurate diagnoses and effective treatments.",
                    "From general checkups to specialized care, we address all your health needs under one roof.",
                    "Our clinic is equipped with clean, modern, and comfortable spaces designed for healing and relaxation.",
                    "Our support staff is always ready to assist you with bookings, records, and queries with a smile.",
                  ][i]
                }
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
