"use client";

import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
}

interface ContactItemProps {
  icon: React.ReactElement;
  title: string;
  value: string;
  bgColor: string;
}

const ContactUs = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formRef.current) {
      emailjs
        .sendForm(
          "service_sd482ql",
          "template_r699jld",
          formRef.current,
          "fk_Cf3iPceK5Z32k_"
        )
        .then(() => {
          setSubmitted(true);
          setLoading(false);
          if (formRef.current) formRef.current.reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full mb-6">
            <Phone className="w-6 h-6 text-red-500" />
            <span className="text-red-500 text-sm font-semibold tracking-wider">
              CONTACT US
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Get in Touch with <span className="text-red-500">MovieStream</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions about our service? We are here to help you enhance
            your streaming experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Information */}
          <div
            className="bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 
              border border-gray-800 hover:border-gray-700 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Contact Information
            </h2>
            <div className="space-y-8">
              <ContactItem
                icon={<Mail className="w-6 h-6 text-red-500" />}
                title="Email"
                value="sahilniraula00@gmail.com"
                bgColor="bg-red-500/10"
              />
              <ContactItem
                icon={<Phone className="w-6 h-6 text-red-500" />}
                title="Phone"
                value="+977 9840031791"
                bgColor="bg-red-500/10"
              />
              <ContactItem
                icon={<MapPin className="w-6 h-6 text-red-500" />}
                title="Address"
                value="Kathmandu, Nepal"
                bgColor="bg-red-500/10"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 
              border border-gray-800 hover:border-gray-700 transition-all duration-300"
          >
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Thank you!
                </h3>
                <p className="text-gray-300">
                  Your message has been sent successfully. We will get back to
                  you soon!
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <FormField label="Name" name="user_name" type="text" />
                <FormField label="Email" name="user_email" type="email" />
                <FormField label="Message" name="message" type="textarea" />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold 
                    py-4 px-8 rounded-xl transition duration-300 flex items-center justify-center 
                    gap-3 hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, title, value, bgColor }: ContactItemProps) => (
  <div className="flex items-center space-x-6 group">
    <div
      className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center 
        transform group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  </div>
);

const FormField = ({ label, name, type }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        required
        rows={4}
        className="w-full px-5 py-3 bg-black/30 border border-gray-700 rounded-xl 
          focus:ring-2 focus:ring-red-500 focus:border-transparent text-white 
          placeholder-gray-500 transition-all duration-300"
      />
    ) : (
      <input
        type={type}
        name={name}
        required
        className="w-full px-5 py-3 bg-black/30 border border-gray-700 rounded-xl 
          focus:ring-2 focus:ring-red-500 focus:border-transparent text-white 
          placeholder-gray-500 transition-all duration-300"
      />
    )}
  </div>
);

export default ContactUs;
