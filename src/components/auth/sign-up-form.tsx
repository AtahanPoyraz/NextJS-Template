'use client';

import { authClient } from "@/api/client/auth-client";
import { SignUpRequest } from "@/api/dto/user-dto";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FrontendPaths } from "@/paths/frontend-paths";
import { useRouter } from 'next/navigation';


export default function SignUpForm() {
  const router = useRouter();

  const [signedUp, setsignedUp] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [form, setForm] = useState<SignUpRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "firstName") setFirstNameError("");
    if (e.target.name === "lastName") setLastNameError("");
    if (e.target.name === "email") setEmailError("");
    if (e.target.name === "password") setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setTermsError("");

    if (!isChecked) {
      setTermsError("You must agree to the terms.");
      return;
    }

    const { error } = await authClient.SignUp(form);
    if (error) {
      if (error.split(":").length === 2) {
        const errorType = error.split(":")[0].trim();
        const errorMessage = error.split(":")[1].trim();

        switch (errorType) {
          case ("firstName"):
            setFirstNameError(errorMessage);
            return;

          case ("lastName"):
            setLastNameError(errorMessage);
            return;

          case ("email"):
            setEmailError(errorMessage);
            return;

          case ("password"):
            setPasswordError(errorMessage);
            return;
          };
      }
      
      toast.error(error)
    };

    setsignedUp(true)
  };

  useEffect(() => {
    if (signedUp) {
      router.replace(FrontendPaths.home);
    }
  }, [signedUp, router]);
  
  return (
    <>
    <Toaster position="top-center" />
    <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign up!
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    First Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  <div>
                    {firstNameError && (
                      <p className="text-sm text-error-500">{firstNameError}</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  <div>
                    {lastNameError && (
                      <p className="text-sm text-error-500">{lastNameError}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              <div>
                {emailError && (
                  <p className="text-sm text-error-500">{emailError}</p>
                )}
              </div>
              </div>
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                <div>
                  {passwordError && (
                    <p className="text-sm text-error-500">{passwordError}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account means you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms and Conditions,
                  </span>{" "}
                  and our{" "}
                  <span className="text-gray-800 dark:text-white">
                    Privacy Policy
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center">
                {termsError && (
                  <p className="text-sm text-error-500 text-center">
                    {termsError}
                  </p>
                )}
              </div>
              <div>
                <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
          <div className="flex justify-center mt-4">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?
              <Link
                href="/sign-in"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                &nbsp;Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
