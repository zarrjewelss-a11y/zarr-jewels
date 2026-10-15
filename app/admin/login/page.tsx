"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
  const login = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  setLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user.email !== "zarrjewelss@gmail.com") {
      alert("Access Denied");

      await auth.signOut();

      setLoading(false);
      return;
    }

    localStorage.setItem("adminLoggedIn", "true");

    alert("Login Successful!");

    router.push("/admin");
  } catch (error: any) {
    alert(error.message);
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">
          Admin Login
        </h1>

        <div className="space-y-5">

          <div className="relative">
            <Mail
  className="absolute left-4 top-4 text-gray-400"
  size={20}
/>

            <input
  type="email"
  placeholder="Admin Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border rounded-xl py-4 pl-12 pr-4"
/>
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-xl py-4 pl-12 pr-4"
            />
          </div>

          <button
  onClick={login}
  disabled={loading}
  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-bold disabled:opacity-50"
>
  {loading ? "Signing In..." : "Login"}
</button>

        <p className="text-center text-gray-500 text-sm">
  Admin Login
  <br />
  Email: <b>zarrjewelss@gmail.com</b>
</p>

        </div>

      </div>
    </div>
  );
}