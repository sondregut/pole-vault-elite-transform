
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1f2937] text-white py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-['Pacifico'] text-white mb-6 block">logo</Link>
            <p className="text-gray-400 mb-6">
              Elevating athletes to new heights through expert coaching and personalized training programs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                <i className="ri-youtube-line"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                <i className="ri-facebook-line"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                <i className="ri-twitter-x-line"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-white transition">Programs</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition">Shop</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Programs</h3>
            <ul className="space-y-3">
              <li><Link to="/programs/coaching" className="text-gray-400 hover:text-white transition">1-on-1 Online Coaching</Link></li>
              <li><Link to="/programs/flight-mode" className="text-gray-400 hover:text-white transition">Flight Mode: 10-Week Program</Link></li>
              <li><Link to="/programs/power-strength" className="text-gray-400 hover:text-white transition">Power Strength Program</Link></li>
              <li><Link to="/programs/jumpers-knee" className="text-gray-400 hover:text-white transition">Jumpers Knee Rehab Protocol</Link></li>
              <li><Link to="/programs/demo" className="text-gray-400 hover:text-white transition">Free Demo Week</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <i className="ri-mail-line text-primary"></i>
                </div>
                <span className="ml-3 text-gray-400">sondre@stavhopp.no</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <i className="ri-phone-line text-primary"></i>
                </div>
                <span className="ml-3 text-gray-400">424-535-8644</span>
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-8 mb-4">Subscribe to Our Newsletter</h3>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 text-white border-none rounded-r-none focus:ring-primary"
              />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 Pole Vault Coaching. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
