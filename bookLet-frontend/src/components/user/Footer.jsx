import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-web-third pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Booklett
                </span>
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Contact Info</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> Lorem Ipsum is simply dummy text
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Call us:</span> +91 94038XXXXX
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email us:</span> support@xyz.in
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Follow Us</h3>
              <div className="flex space-x-2">
                <a href="#" className="bg-yellow-300 p-2 rounded-full hover:bg-yellow-400 transition-colors">
                  <Facebook size={18} className="text-gray-800" />
                </a>
                <a href="#" className="bg-yellow-300 p-2 rounded-full hover:bg-yellow-400 transition-colors">
                  <Twitter size={18} className="text-gray-800" />
                </a>
                <a href="#" className="bg-yellow-300 p-2 rounded-full hover:bg-yellow-400 transition-colors">
                  <Instagram size={18} className="text-gray-800" />
                </a>
                <a href="#" className="bg-yellow-300 p-2 rounded-full hover:bg-yellow-400 transition-colors">
                  <Youtube size={18} className="text-gray-800" />
                </a>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Company</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Publisher Partnership</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Disclaimer</a></li>
            </ul>
          </div>

          {/* My Account */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">My Account</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">My Orders</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">My Addresses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">My Personal Info</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Support</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Use</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">How to Order</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Return Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-gray-200 mt-8 pt-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            All Right Reserved. Copyright © 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;