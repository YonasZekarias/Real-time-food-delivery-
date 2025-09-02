// src/components/ResetPassword.jsx
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/customer/auth";

const ResetPassword = () => {
  const { phone } = useLocation().state || {};
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  if (!phone) navigate("/forgot-password");

  const handleOTPInput = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length === 6 && index === 0) {
      const digits = value.split("").slice(0, 6);
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
        if (inputsRef.current[i]) inputsRef.current[i].value = digit;
      });
      setOtp(digits);
      inputsRef.current[5]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (!value && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (otp.includes("")) {
      setError("Please enter the full 6-digit OTP code.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ phone, code: otp.join(""), newPassword });
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-md w-full max-w-xl text-center">
        <div className="text-4xl text-green-600 mb-4">📩</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Code</h2>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit code sent to <strong>{phone}</strong> and create a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => (inputsRef.current[idx] = el)}
                onChange={(e) => handleOTPInput(e.target.value, idx)}
                onPaste={(e) => {
                  e.preventDefault();
                  handleOTPInput(e.clipboardData.getData("text"), 0);
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg
                  focus:outline-none focus:border-green-500 transition"
                placeholder="•"
              />
            ))}
          </div>

          <div>
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={() => {
                setOtp(Array(6).fill(""));
                inputsRef.current[0]?.focus();
              }}
            >
              Resend Code
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Confirm Code & Reset"}
          </button>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
