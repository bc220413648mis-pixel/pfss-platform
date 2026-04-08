"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      alert("Password updated! You can now login.");
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleReset} className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl">
      <h1 className="text-xl font-black mb-6 uppercase">Set New Password</h1>
      <input 
        type="password" 
        placeholder="New Password" 
        className="w-full p-4 bg-slate-100 rounded-xl mb-4"
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <button className="w-full py-4 bg-blue-700 text-white rounded-xl font-bold uppercase">
        Update Password
      </button>
    </form>
  );
}