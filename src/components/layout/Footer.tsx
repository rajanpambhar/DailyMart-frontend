// =====================================================
// FOOTER COMPONENT
// Migrated from: PHP footer.php
// =====================================================

import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../common/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900/80 backdrop-blur-xl border-t border-white/5 relative z-10">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4 group">
              <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
              <div className="flex items-baseline">
                <span className="text-primary-500">Daily</span>
                <span className="text-secondary-400">Mart</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">
              Your modern supermarket. Fresh groceries, curated fashion and gadgets. Shop smarter, live better.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/5"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/vegetables" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/category/fruits" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/electronics" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Electronics
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <span className="mt-1 font-light">
                  123 Market Street<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <a href="tel:+1234567890" className="text-gray-400 hover:text-primary-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <a href="mailto:support@dailymart.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  support@dailymart.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm font-light">
              © {currentYear} DailyMart. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">
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
