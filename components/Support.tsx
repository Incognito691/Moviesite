"use client";

import React from "react";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const Support = () => {
  const supportCategories = [
    {
      title: "Account & Billing",
      icon: <FileText className="w-6 h-6 text-red-500" />,
      description:
        "Questions about your subscription, payments, or account settings",
    },
    {
      title: "Streaming Issues",
      icon: <MessageCircle className="w-6 h-6 text-red-500" />,
      description: "Help with playback, quality, or technical problems",
    },
    {
      title: "Content Availability",
      icon: <HelpCircle className="w-6 h-6 text-red-500" />,
      description:
        "Information about movies, TV shows, and regional availability",
    },
  ];

  const contactMethods = [
    {
      title: "Email Support",
      icon: <Mail className="w-5 h-5" />,
      description: "Get help via email",
      action: "Send Email",
      link: "/contact",
    },
    {
      title: "Phone Support",
      icon: <Phone className="w-5 h-5" />,
      description: "Talk to our team",
      action: "Call Now",
      link: "tel:+9779840031791",
    },
    {
      title: "Live Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      description: "Chat with support",
      action: "Start Chat",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full mb-6">
            <HelpCircle className="w-6 h-6 text-red-500" />
            <span className="text-red-500 text-sm font-semibold tracking-wider">
              SUPPORT CENTER
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            How Can We Help You?
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support
            team
          </p>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportCategories.map((category) => (
            <div
              key={category.title}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-gray-800 
                hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method) => (
            <Link
              href={method.link}
              key={method.title}
              className="group bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-gray-800 
                hover:border-red-500/50 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div
                className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 
                group-hover:bg-red-500/20 transition-all duration-300"
              >
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-400 mb-4">{method.description}</p>
              <span className="inline-flex items-center gap-2 text-red-500 font-medium">
                {method.action}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Can not find what you are looking for?{" "}
            <Link
              href="/contact"
              className="text-red-500 hover:text-red-400 transition-colors duration-300"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
