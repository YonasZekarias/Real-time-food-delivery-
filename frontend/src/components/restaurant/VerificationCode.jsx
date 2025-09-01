import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/restaurant/authStore";

const PhoneAndOtpVerification = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const { pendingUser, setPendingUser } = useAuthStore();

  const [step, setStep] = useState(pendingUser?.phone ? "otp" : "phone"); // 'phone' or 'otp'
  const [phoneInput, setPhoneInput] = useState(pendingUser?.phone || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  // ----- OTP input handlers -----
  const handleChange = (val, idx) => {
    if (!val || !/^\d$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;
    setCode(paste.split(""));
    inputsRef.current[5]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];
      if (code[idx]) {
        newCode[idx] = "";
        setCode(newCode);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        newCode[idx - 1] = "";
        setCode(newCode);
      }
    }
  };

  const allFilled = code.every((digit) => digit !== "");

  // ----- Step 1: phone submission -----
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneInput) {
      setMessage("Please enter your phone number");
      setStatus("error");
      return;
    }

    setPendingUser({ phone: phoneInput }); // save phone to store
    setStep("otp");
    setCode(["", "", "", "", "", ""]);
    setMessage("");
    setStatus("idle");

    setTimeout(() => inputsRef.current[0]?.focus(), 100); // focus first OTP input
  };

  // ----- Step 2: verify OTP -----
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!allFilled) return;

    const otp = code.join("");
    const phone = pendingUser?.phone;
    if (!phone) {
      setMessage("Phone number missing");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");
      const res = await fetch(
        "http://localhost:5000/api/delivery/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Verification successful! Redirecting...");
        setTimeout(() => navigate("/restaurant/menu"), 1500);
      } else {
        setStatus("error");
        setMessage(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  useEffect(() => {
    if (step === "otp") inputsRef.current[0]?.focus();
  }, [step]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800 text-center">
          {step === "phone" ? "Enter Your Phone" : "Verify Your Phone"}
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {step === "phone"
            ? "Enter your phone number to continue"
            : `Enter the 6-digit code sent to ${pendingUser?.phone}`}
        </p>

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="flex justify-center gap-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  className="w-12 h-14 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={!allFilled || status === "loading"}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
            >
              {status === "loading" ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {message && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm font-medium ${
              status === "success"
                ? "text-green-700"
                : status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {status === "success" && <span>✅</span>}
            {status === "error" && <span>❌</span>}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAndOtpVerification;
