"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserCircle, Film } from "lucide-react";
import Link from "next/link";

const Register = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userData = {
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        password: userPassword,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      router.push("/login");
    } catch (error) {
      console.log("Something went wrong", error);
      setShowDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[url('/movies-collage.jpg')] bg-cover bg-center opacity-20" />

      <div className="w-full max-w-md relative">
        <div
          className="bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 
            border border-gray-800 hover:border-gray-700 transition-all duration-300"
        >
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-red-500 text-lg font-semibold tracking-wider">
                MOVIESTREAM
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">Begin your streaming journey</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Alert Dialog */}
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogContent className="bg-gray-900 border border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Registration Error
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Please check your information and try again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-500">
                    Try Again
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Form Fields */}
            {[
              {
                label: "First Name",
                icon: <User />,
                value: userFirstName,
                setter: setUserFirstName,
                type: "text",
              },
              {
                label: "Last Name",
                icon: <UserCircle />,
                value: userLastName,
                setter: setUserLastName,
                type: "text",
              },
              {
                label: "Email",
                icon: <Mail />,
                value: userEmail,
                setter: setUserEmail,
                type: "email",
              },
              {
                label: "Password",
                icon: <Lock />,
                value: userPassword,
                setter: setUserPassword,
                type: "password",
              },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium pl-1">
                  {field.label}
                </label>
                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                      group-hover:text-red-500 transition-colors duration-300 w-5 h-5"
                  >
                    {field.icon}
                  </div>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl 
                      focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 
                      transition-all duration-300"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-xl
                transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-600/50
                active:translate-y-[0px]"
            >
              Create Account
            </button>

            {/* Login Link */}
            <div className="text-center text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-red-500 hover:text-red-400 font-medium transition-colors duration-300"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
