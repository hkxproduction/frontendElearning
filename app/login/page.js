"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email: email,
        password: password,
      });

      // Simpan token dan redirect
      localStorage.setItem("auth_token", response.data.data.token);
      router.push("/dashboard"); // Ganti ke halaman dashboard setelah berhasil login
    } catch (err) {
      if (err.response) {
        // Jika server memberikan respons
        setError(
          err.response.data.message || "An error occurred while logging in."
        );
      } else if (err.request) {
        // Jika tidak ada respons dari server
        setError("No response from server.");
      } else {
        // Kesalahan lainnya
        setError("An error occurred: " + err.message);
      }
      console.error(err); // Debug log
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-jecBlue h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-96">
        <div className="flex items-center justify-center mb-4">
          <AiOutlineUser className="text-4xl text-jecBlue" />
        </div>
        <h1 className="text-3xl text-center mb-6">Login</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className={`bg-jecBlue text-white py-2 rounded w-full hover:bg-jecGreen transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>
        <div className="text-center mt-4">
          <a
            href="/auth/forgot-password"
            className="text-jecBlue hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
