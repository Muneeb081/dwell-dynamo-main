
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-semibold mb-4">DwellDynamo</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for real estate solutions in Islamabad. Find your dream property with ease.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Construction Calculator
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Chat Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?type=house" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Houses
                </Link>
              </li>
              <li>
                <Link to="/properties?type=apartment" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?type=commercial" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/properties?type=plot" className="text-gray-400 hover:text-teal-500 transition text-sm">
                  Plots
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  F-10 Markaz, Islamabad, Pakistan
                </span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone size={18} className="text-teal-500 flex-shrink-0" />
                <span className="text-gray-400">+92 51 1234567</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail size={18} className="text-teal-500 flex-shrink-0" />
                <span className="text-gray-400">info@dwelldynamo.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} DwellDynamo. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-2">
            <Link to="/privacy-policy" className="hover:text-teal-500 transition">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-teal-500 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
