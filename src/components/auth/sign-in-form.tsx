'use client';

import { authClient } from "@/api/client/auth-client";
import { SignInRequest } from "@/api/dto/user-dto";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { FrontendPaths } from "@/paths/frontend-paths";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SignInForm() {
  const router = useRouter();

  const [signedIn, setsignedIn] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<SignInRequest>({
      email: "",
      password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
  
      if (e.target.name === "email") setEmailError("");
      if (e.target.name === "password") setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setEmailError("");
    setPasswordError("");

    const { error } = await authClient.SignIn(form);
    if (error) {
      if (error.split(":").length === 2) {
        const errorType = error.split(":")[0].trim();
        const errorMessage = error.split(":")[1].trim();

        switch (errorType) {
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

    setsignedIn(true)
  };
    
  useEffect(() => {
    if (signedIn) {
      router.replace(FrontendPaths.home);
    }
  }, [signedIn, router]);
  
  return (
    <>
    <Toaster position="top-center" />
    <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                  name="email"
                  placeholder="info@gmail.com"
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
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                <div className="flex items-center justify-between">
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="flex justify-center mt-4">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/sign-up"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
