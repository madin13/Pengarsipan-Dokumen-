import { useState, type FormEvent } from "react";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Mengatur tampilan password
  const [showPassword, setShowPassword] = useState(false);

  // Mengatur checkbox
  const [rememberMe, setRememberMe] = useState(false);

  // Proses login sementara
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username dan password harus diisi!");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* ===== BAGIAN KIRI ===== */}
        <div className="relative bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center text-center px-8 pt-12 pb-72 md:min-h-[620px]">
          <img
            src="/logo tk .jpeg"
            alt="Logo TK Tunas Kintamani 2"
            className="w-40 h-40 rounded-full object-cover"
          />

          <h1 className="mt-6 text-2xl lg:text-3xl font-extrabold text-hijau-tua leading-tight pr-8">
            SISTEM INFORMASI <br /> PENGARSIPAN DOKUMEN
          </h1>

          <h2 className="mt-2 text-xl text-hijau">TK Tunas Kintamani 2</h2>

          <p className="mt-4 text-gray-700 max-w-xs">
            Kelola arsip dokumen sekolah dengan mudah, cepat, aman, dan
            terorganisir.
          </p>

          {/* Ilustrasi sekolah (letakkan di public/ilustrasi-sekolah.png) */}
          <img
            src="/bg-sekolah.png"
            alt="Ilustrasi sekolah"
            className="absolute bottom-0 left-0 w-[85%] pointer-events-none"
            style={{
              // atas memudar + kanan memudar
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 40%), linear-gradient(to right, black 70%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 40%), linear-gradient(to right, black 70%, transparent 100%)",
              maskComposite: "intersect",
            }}
          />

          {/* Lengkungan oranye - hijau - putih di sisi kanan */}
          <svg
            className="hidden md:block absolute right-0 top-0 h-full w-28"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C60,25 -10,70 30,100 L100,100 L100,0 Z" fill="#f39c1f" />
            <path d="M12,0 C72,25 2,70 42,100 L100,100 L100,0 Z" fill="#3f8a2f" />
            <path d="M24,0 C84,25 14,70 54,100 L100,100 L100,0 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* ===== BAGIAN KANAN (FORM) ===== */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-hijau-tua">Selamat Datang!</h2>
            <div className="w-16 h-1 bg-oranye rounded-full mx-auto mt-3" />
            <p className="mt-6 text-gray-600">
              Silakan masuk untuk melanjutkan ke <br />
              Sistem Informasi Pengarsipan Dokumen
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-10">
            {/* Username */}
            <label className="block text-sm font-medium text-hijau-tua mb-2">
              Username
            </label>
            <div className="flex items-center gap-3 border border-green-200 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-hijau">
              <User className="w-5 h-5 text-hijau" />
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Password */}
            <label className="block text-sm font-medium text-hijau-tua mt-6 mb-2">
              Password
            </label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-hijau">
              <Lock className="w-5 h-5 text-hijau" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-hijau"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Ingat saya */}
            <label className="flex items-center gap-3 mt-6 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 accent-green-700"
              />
              <span className="text-gray-700">Ingat saya</span>
            </label>

            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full mt-6 flex items-center justify-center gap-2 bg-hijau hover:bg-hijau-tua text-white font-semibold py-3 rounded-lg transition"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-10">
            © 2026 TK Tunas Kintamani 2 <br /> All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;