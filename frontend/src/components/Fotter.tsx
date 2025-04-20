import logo from '../assets/logo.png';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <footer className="bg-white border-t border-gray-200 px-6 py-14 mt-20 shadow-inner">
        <div className="flex flex-col md:flex-row justify-between gap-12 items-start">
          {/* Left Section */}
          <div className="flex flex-col md:w-1/2">
            <img
              src={logo}
              alt="ClinicCare+ Logo"
              className="w-24 cursor-pointer transition-transform duration-300 hover:scale-105"
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-800">AETERNUM CANCER SANCTUARY</span> is your
              trusted partner for modern healthcare management. We streamline appointments, doctor
              scheduling, and patient records. Powered by technology, driven by care.
            </p>
          </div>

          {/* Center Section */}
          <div className="md:w-1/4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-purple-700 transition duration-200">Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-purple-700 transition duration-200">About Us</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-purple-700 transition duration-200">Contact Us</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-purple-700 transition duration-200">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="md:w-1/4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-700" />
                <span>+961-71-394-640</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-700" />
                <span>aeternumcenter@hotmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="py-6">
          <hr className="border-gray-300" />
        </div>
      </footer>

      {/* Copyright Below Footer */}
      <div className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} Aeternum Cancer Sanctuary. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
