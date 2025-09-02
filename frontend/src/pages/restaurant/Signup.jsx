import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/restaurant/authStore";

const RestaurantSignup = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
    lng: "", // longitude
    lat: "", // latitude
    image: "", // ✅ image URL
  });

  const { signupRestaurant } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim() ||
      !form.name.trim() ||
      isNaN(parseFloat(form.lng)) ||
      isNaN(parseFloat(form.lat)) ||
      !form.image.trim()
    ) {
      setLoading(false);
      setError("Please fill all fields correctly");
      return;
    }

    const { success, message } = await signupRestaurant(
      form.email,
      form.phone,
      form.password,
      form.name,
      form.lng,
      form.lat,
      form.image // ✅ pass image URL
    );

    setLoading(false);

    if (success) navigate("/restaurant/login")
    else setError(message);
  };

  const isFormValid =
    form.email &&
    form.phone &&
    form.password &&
    form.name &&
    form.lng &&
    form.lat &&
    form.image;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Restaurant Signup</h1>
        <p className="text-sm text-gray-500 mb-6">Register your restaurant below</p>

        <form className="space-y-4" onSubmit={handleSignup}>
          {/* Restaurant Name */}
          <input
            type="text"
            placeholder="Restaurant Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
            required
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
            }
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
            required
          />

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
              required
            />
            <input
              type="number"
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
              required
            />
          </div>

          {/* ✅ Image URL */}
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-[#E23E3E] text-white py-2 rounded-xl font-semibold hover:bg-red-400 transition disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/restaurant/login"
              className="text-[#E23E3E] font-medium ml-1 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSignup;
