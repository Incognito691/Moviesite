"use client";

import React from "react";
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
import { Lock, Mail, Film } from "lucide-react";
import Link from "next/link";

const Login = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showDialog, setShowDialog] = React.useState(false);

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if (userData.email === userEmail && userData.password === password) {
          localStorage.setItem("isLoggedIn", "true");
          router.push("/movies");
        } else {
          setShowDialog(true);
        }
      } else {
        setShowDialog(true);
      }
    } catch (error) {
      console.log("Something went wrong", error);
      setShowDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      {/* Background Overlay with Cinema Pattern */}
      <div className="absolute inset-0 bg-[url('/cinema-background.jpg')] bg-cover bg-center opacity-20" />

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
              Welcome Back
            </h1>
            <p className="text-gray-400">Continue your streaming journey</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Alert Dialog */}
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogContent className="bg-gray-900 border border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Access Denied
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Invalid email or password. Please try again.
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

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium pl-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                    group-hover:text-red-500 transition-colors duration-300"
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl 
                    focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 
                    transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium pl-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                    group-hover:text-red-500 transition-colors duration-300"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl 
                    focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 
                    transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-xl
                transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-600/50
                active:translate-y-[0px]"
            >
              Sign In
            </button>

            {/* Register Link */}
            <div className="text-center text-gray-400">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="text-red-500 hover:text-red-400 font-medium transition-colors duration-300"
              >
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
