const Careers = () => {
    return (
      <div className="px-6 md:px-16 py-16 bg-white text-gray-800">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">Join Our Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aeternum Sanctuary is always looking for passionate individuals to help us grow. Whether you're a medical professional, therapist, or support staff — we’d love to hear from you.
          </p>
        </div>
  
        {/* Open Positions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Therapist */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Therapist</h3>
            <p className="text-gray-700 mb-4">
              Provide emotional and mental health support to our clients through personalized sessions.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* Administrative Assistant */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Administrative Assistant</h3>
            <p className="text-gray-700 mb-4">
              Help manage front-desk operations, client scheduling, and communication within the center.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* Nurse */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Nurse</h3>
            <p className="text-gray-700 mb-4">
              Assist in patient care, administer medications, and support medical staff during procedures.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* General Practitioner */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">General Practitioner (GP)</h3>
            <p className="text-gray-700 mb-4">
              Provide primary care to patients, perform routine check-ups, diagnose and treat illnesses.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* Medical Technologist */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Medical Technologist</h3>
            <p className="text-gray-700 mb-4">
              Perform diagnostic tests, analyze lab results, and assist in the preparation of reports.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* Pharmacist */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Pharmacist</h3>
            <p className="text-gray-700 mb-4">
              Dispense medications, provide advice on their use, and manage the pharmacy inventory.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* Medical Assistant */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Medical Assistant</h3>
            <p className="text-gray-700 mb-4">
              Assist healthcare providers with patient examinations, taking medical histories, and administrative tasks.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
  
          {/* Health Administrator */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Health Administrator</h3>
            <p className="text-gray-700 mb-4">
              Oversee the operational aspects of the clinic, manage staff, and ensure compliance with healthcare regulations.
            </p>
            <button className="bg-purple-700 text-white px-5 py-2 rounded hover:bg-purple-800 transition">
              Apply Now
            </button>
          </div>
        </div>
  
        {/* General Interest Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Don’t See a Role That Fits?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            We’re always excited to meet talented people. Feel free to send your resume and we’ll reach out if a suitable position opens up!
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
          >
            Contact Us
          </button>
        </div>
      </div>
    );
  };
  
  export default Careers;
  