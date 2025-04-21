import about_image from '../assets/about_image.png';

const About = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 text-gray-800">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-3xl font-bold text-purple-700">
          ABOUT<span className="text-purple-700"> US</span>
        </p>
        <div className="w-20 h-1 bg-purple-700 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Image + Text Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
        {/* Image */}
        <div className="flex-1">
          <img
            src={about_image}
            alt="About our clinic"
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </div>

        {/* About Text */}
        <div className="flex-1 space-y-6 text-justify">
          <div>
            <p className="text-xl font-semibold text-purple-700 mb-1">Overview</p>
            <p>
              At AETERNUM SANCTUARY, we are committed to providing top-quality healthcare through compassionate care and
              cutting-edge technology. Our mission is to deliver exceptional services while ensuring that every patient
              feels valued and cared for.
            </p>
          </div>

          <div>
            <p className="text-xl font-semibold text-purple-700 mb-1">Our Clinic Environment</p>
            <p>
              Our clinic is designed to offer a peaceful, comfortable space where patients can feel at ease. With a skilled
              and caring team of doctors, nurses, and healthcare professionals, we provide personalized care and a broad
              spectrum of services.
            </p>
          </div>

          <div>
            <p className="text-xl font-semibold text-purple-700 mb-1">Efficient Clinic Management</p>
            <p>
              With our advanced clinic management system, we ensure seamless scheduling, billing, and medical records.
              This enables our staff to focus more on patient care and deliver a smooth, efficient experience.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-purple-700">Why Choose Us</h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Discover the key reasons why patients trust AETERNUM SANCTUARY for their healthcare needs.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Experienced Medical Team</h3>
            <p>Our doctors and staff bring years of experience across various specialties, ensuring the best care possible.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Patient-Centered Approach</h3>
            <p>We prioritize your comfort, communication, and involvement in every step of your healthcare journey.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">State-of-the-Art Technology</h3>
            <p>We utilize modern equipment and innovative techniques for accurate diagnoses and effective treatments.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Holistic Services</h3>
            <p>From general checkups to specialized care, we address all your health needs under one roof.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Modern, Clean Facility</h3>
            <p>Our clinic is equipped with clean, modern, and comfortable spaces designed for healing and relaxation.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Reliable Support</h3>
            <p>Our support staff is always ready to assist you with bookings, records, and queries with a smile.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
