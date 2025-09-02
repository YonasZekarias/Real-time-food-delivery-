// src/components/VerificationCode.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/customer/authStore";
import { verifyOTP } from "../api/customer/auth";

const VerificationCode = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const { pendingUser } = useAuthStore();

  const [code, setCode] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!pendingUser?.phone) navigate("/signup");
    else inputsRef.current[0]?.focus();
  }, [pendingUser, navigate]);

  const handleChange = (val, idx) => {
    if (!/^\d$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;
    const digits = paste.split("");
    setCode(digits);
    inputsRef.current[5]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];
      if (code[idx]) newCode[idx] = "";
      else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        newCode[idx - 1] = "";
      }
      setCode(newCode);
    }
  };

  const allFilled = code.every((digit) => digit !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFilled) return;

    setStatus("loading");
    setMessage("");
    const otp = code.join("");

    try {
      await verifyOTP({ phone: pendingUser.phone, otp });
      setStatus("success");
      setMessage("Verification successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  const handleResend = () => {
    setMessage("A new code has been sent.");
    setStatus("idle");
    setCode(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-semibold mb-2 text-gray-800 text-center">Verify Your Phone</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter the 6-digit code sent to <span className="font-medium">{pendingUser?.phone}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
              status === "success" ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white disabled:opacity-60`}
          >
            {status === "loading" ? "Verifying..." : status === "success" ? "Verified" : "Verify"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm font-medium ${
              status === "success" ? "text-green-700" : status === "error" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {status === "success" && <span>✅</span>}
            {status === "error" && <span>❌</span>}
            <span>{message}</span>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500 flex justify-between items-center">
          <div>
            Didn’t receive a code?{" "}
            <button type="button" onClick={handleResend} className="text-blue-600 font-medium hover:underline" disabled={status === "loading"}>
              Resend
            </button>
          </div>
          <div>
            <button type="button" onClick={() => navigate("/signup")} className="text-gray-600 hover:underline">
              Change phone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
