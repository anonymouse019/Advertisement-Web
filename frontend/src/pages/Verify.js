import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.put(`http://localhost:5000/api/verify/${id}`);

        if (res.status === 200) {
          setMessage("✅ Email verified successfully! Redirecting to login...");
          setIsLoading(false);
          setTimeout(() => navigate("/login"), 2500);
        } else {
          setMessage("❌ Verification failed. Invalid or expired link.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        setMessage("❌ Verification failed. Please try registering again.");
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Email Verification
        </h2>

        {isLoading ? (
          <p className="text-blue-500 animate-pulse">{message}</p>
        ) : (
          <p
            className={`${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {!isLoading && message.startsWith("❌") && (
          <button
            onClick={() => navigate("/signup")}
            className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
          >
            Go to Signup
          </button>
        )}
      </div>
    </div>
  );
};

export default Verify;
