"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mendapatkan informasi pengguna setelah login
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token"); // Ambil token dari local storage
        if (!token) {
          router.push("/login"); // Redirect ke halaman login jika token tidak ada
          return;
        }

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
          },
        });

        setUser(response.data); // Set data pengguna ke state
      } catch (error) {
        console.error(error);
        router.push("/login"); // Redirect ke halaman login jika ada kesalahan
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found, redirecting to login");
        router.push("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/logout",
        {}, // Body kosong
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Logout berhasil, hapus token
        localStorage.removeItem("auth_token");
        router.push("/login");
      } else {
        console.error("Logout failed with status: ", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading saat data sedang diambil
  }

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-96">
        <h1 className="text-3xl text-center mb-4">Dashboard</h1>
        {user ? (
          <div>
            <p className="text-lg">Welcome, {user.name}!</p>
            <p className="text-gray-600">{user.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 rounded mt-4 w-full hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-center">User not found</p>
        )}
      </div>
    </div>
  );
}
