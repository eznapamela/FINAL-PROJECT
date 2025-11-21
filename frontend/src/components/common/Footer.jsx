import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🗣️</span>
              </div>
              <span className="font-bold text-lg">Voices Under Fire</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              A crisis-response and community protection app designed to help citizens 
              stay connected, safe, and informed during periods of unrest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Emergency Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Know Your Rights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Voices Under Fire. 
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          <p>Built for community safety.</p>
            </span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              Anonymous Mode
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;