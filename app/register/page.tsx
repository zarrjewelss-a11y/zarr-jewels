"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {const router = useRouter();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

 const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

await updateProfile(userCredential.user, {
  displayName: name,
});

await setDoc(doc(db, "users", userCredential.user.uid), {
  name,
  email,
  createdAt: new Date().toISOString(),
});

alert("Account created successfully!");

router.push("/profile");
  } catch (error: any) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">Create Account</h1>

          <p className="mt-4 text-pink-100 text-lg">
            Join ZARR JEWELS today
          </p>
        </div>
      </section>

      {/* Register Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10">

          <h2 className="text-3xl font-bold text-center mb-8">
            Register
          </h2>

<form onSubmit={handleRegister} className="space-y-6">

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600"
                size={20}
              />

<input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border rounded-full py-3 pl-12 pr-4 outline-none focus:border-pink-600"
/>
            </div>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600"
                size={20}
              />

 <input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border rounded-full py-3 pl-12 pr-4 outline-none focus:border-pink-600"
/>
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600"
                size={20}
              />

<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full border rounded-full py-3 pl-12 pr-4 outline-none focus:border-pink-600"
/>
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600"
                size={20}
              />

<input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className="w-full border rounded-full py-3 pl-12 pr-4 outline-none focus:border-pink-600"
/>
            </div>

<button
  type="submit"
  disabled={loading}
  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full transition disabled:opacity-50"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>

          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </section>

      <Footer />
    </>
  );
}