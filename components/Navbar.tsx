"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  Home,
  Film,
  UserCircle,
  UserPlus,
  HelpCircle,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <Film className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              MovieStream
            </span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" icon={<Home size={18} />} text="Home" />
            <NavLink
              href="/login"
              icon={<UserCircle size={18} />}
              text="Login"
            />
            <NavLink
              href="/register"
              icon={<UserPlus size={18} />}
              text="Register"
            />
            <NavLink
              href="/support"
              icon={<HelpCircle size={18} />}
              text="Support"
            />
            <NavLink
              href="/contact"
              icon={<PhoneCall size={18} />}
              text="Contact"
            />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <MobileNavLink href="/" icon={<Home size={18} />} text="Home" />

              <MobileNavLink
                href="/login"
                icon={<UserCircle size={18} />}
                text="Login"
              />
              <MobileNavLink
                href="/register"
                icon={<UserPlus size={18} />}
                text="Register"
              />
              <MobileNavLink
                href="/support"
                icon={<HelpCircle size={18} />}
                text="Support"
              />
              <MobileNavLink
                href="/contact"
                icon={<PhoneCall size={18} />}
                text="Contact"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) => (
  <Link
    href={href}
    className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg
    hover:bg-white/10 transition-all duration-200 flex items-center space-x-2"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const MobileNavLink = ({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) => (
  <Link
    href={href}
    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 
    transition-all duration-200 flex items-center space-x-2 rounded-lg"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
