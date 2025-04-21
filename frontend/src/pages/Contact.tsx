import contact_image from '../assets/contact_image.png';

const Contact = () => {
  return (
    <div className="px-6 md:px-16 py-16 bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-4xl font-bold">
          <span className="text-purple-700">CONTACT</span>
          <span className="text-purple-700"> US</span>
        </p>
        <div className="w-20 h-1 bg-purple-700 mx-auto mt-2 rounded-full" />
      </div>

      {/* Image and Form Section */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <img
          src={contact_image}
          alt="Contact"
          className="w-full md:w-1/2 rounded-xl shadow-md"
        />

        <div className="md:w-1/2 w-full">
          <form className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                rows={5}
                placeholder="Your message"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-purple-600 font-semibold text-lg mb-2">Phone</h3>
          <p className="text-gray-600">+961-71-397-640</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-purple-600 font-semibold text-lg mb-2">Email</h3>
          <p className="text-gray-600">info@aeternumsanctuary.com</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-purple-600 font-semibold text-lg mb-2">Location</h3>
          <p className="text-gray-600">123 Healing Way, Wellness City, HC 45678</p>
        </div>
      </div>

      {/* Careers Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">Join Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          At AETERNUM SANCTUARY, we are always looking for passionate and skilled professionals to join our dedicated team.
          Whether you're a healthcare provider, administrative expert, or support staff, we welcome you to explore
          career opportunities with us.
        </p>
        <button
          onClick={() => window.location.href = '/careers'}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
        >
          Explore Careers
        </button>
      </div>
    </div>
  );
};

export default Contact;
