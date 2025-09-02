import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/restaurant/authStore";

const RestaurantLogin = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const blurDiv = useRef(null); // Dummy focus to hide cursor

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Focus dummy div to prevent cursor flash
  useEffect(() => {
    if (blurDiv.current) blurDiv.current.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate("/restaurant/menu"); // cookies sent automatically
    } else {
      setError(result.message || "Login failed");
      navigate("/restaurant/verify"); 
    }
  };

  return (
    <>
      <div
        ref={blurDiv}
        tabIndex={-1}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      ></div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white flex w-full max-w-5xl overflow-hidden">
          {/* Image Section */}
          <div
            className="hidden md:block w-1/2 pointer-events-none select-none"
            tabIndex={-1}
          >
            <img
              src="/pngtree-food-delivery-by-scooters-free-download-png-image_16940462.png"
              alt="Food delivery"
              className="object-cover h-full w-full"
              draggable="false"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-10">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h1>
            <p className="text-sm text-gray-500 mb-6">Login to your account</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 font-semibold">{error}</div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#E23E3E]" />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-[#E23E3E] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E23E3E] text-white py-2 rounded-xl font-semibold hover:bg-red-400 transition"
              >
                Login
              </button>

              <div className="text-center text-gray-400 my-3">or login with</div>

              <button
                type="button"
                className="w-full border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <p className="text-sm text-center mt-4 text-gray-600">
                Don’t have an account?
                <Link
                  to="/restaurant/signup"
                  className="text-[#E23E3E] hover:underline ml-1"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};


export default RestaurantLogin;