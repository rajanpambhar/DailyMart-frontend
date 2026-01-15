// =====================================================
// FOOTER COMPONENT
// Migrated from: PHP footer.php
// =====================================================

import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-600">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-1 text-2xl font-bold mb-4">
              <span className="text-primary-500">Daily</span>
              <span className="text-secondary-400">Mart</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Your modern supermarket. Fresh groceries, curated fashion and gadgets. Shop smarter, live better.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 bg-dark-700 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-dark-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-700 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-dark-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-700 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-dark-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-700 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-dark-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/vegetables" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/category/fruits" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/electronics" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Electronics
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary-500 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-gray-400">
                  123 Market Street<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-primary-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <a href="mailto:support@dailymart.com" className="text-gray-400 hover:text-primary-500 transition-colors">
                  support@dailymart.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-600">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} DailyMart. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
