"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleAuthProvider } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    const result = await signInWithEmailAndPassword(auth, email, password);

const adminEmail = "zarrjewelss@gmail.com";

if (result.user.email === adminEmail) {
  alert("✅ Welcome Admin!");
  router.push("/admin");
} else {
  alert("✅ Login Successful!");
  router.push("/profile");
}
  } catch (error: any) {
    switch (error.code) {
      case "auth/invalid-credential":
        alert("❌ Invalid email or password.");
        break;

      case "auth/user-not-found":
        alert("❌ Account not found.");
        break;

      case "auth/wrong-password":
        alert("❌ Incorrect password.");
        break;

      case "auth/invalid-email":
        alert("❌ Invalid email address.");
        break;

      case "auth/too-many-requests":
        alert("❌ Too many attempts. Try again later.");
        break;

      default:
        alert(error.message);
    }
  } finally {
    setLoading(false);
  }
};
const handleGoogleLogin = async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider);

    alert("✅ Google Login Successful!");

    router.push("/profile");
  } catch (error: any) {
    alert(error.message);
  }
};
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">Welcome Back</h1>

          <p className="mt-4 text-pink-100 text-lg">
            Login to your ZARRaccount
          </p>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10">

          <h2 className="text-3xl font-bold text-center mb-8">
            Login
          </h2>

<form onSubmit={handleLogin} className="space-y-6">

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

<button
  type="submit"
  disabled={loading}
  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full transition disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
</button>
<div className="flex items-center my-6">
  <div className="flex-1 h-px bg-gray-300"></div>
  <span className="px-3 text-gray-500 text-sm">OR</span>
  <div className="flex-1 h-px bg-gray-300"></div>
</div>

<button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full border-2 border-gray-300 hover:border-pink-600 hover:bg-pink-50 py-3 rounded-full font-semibold transition"
>
  Continue with Google
</button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-pink-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </section>

      <Footer />
    </>
  );
}