import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";
import {
  doPasswordReset,
} from "../../firebase/auth";
import toast from "react-hot-toast";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import LogoDark from "../../assets/svg/logoblack.svg";
import LogoLight from "../../assets/svg/logowhite.svg";

const ForgotPassword = () => {
  const { userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const [email, setEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate("/login");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSigningIn(true);
      await doPasswordReset(email);
      toast.success("Successfully Sent Password Reset Email");
      navigate("/login");
    } catch (e) {
      if (e.code === "auth/invalid-credential") {
        setErrorMessage("Invalid Email or Password");
        toast.error("Error Signing In");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div
      className={`w-full h-screen flex self-center place-content-center place-items-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {userLoggedIn && <Navigate to="/" replace={true} />}
      <main className="w-full h-screen flex self-center place-content-center place-items-center white-text">
        <div
          className={`w-96 space-y-5 p-4  rounded-xl ${
            isDarkMode ? " border-gray-700" : ""
          } transition duration-300`}
        >
          <div className="text-left">
            <div className="mt-2">
            <img src={isDarkMode ? LogoLight : LogoDark} alt="Medvault Logo" className="h-10 mb-8 self-start" />

              <h3
                className={`text-xl  sm:text-2xl ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Reset Your Password
              </h3>
            </div>
          </div>
          <form
            onSubmit={onSubmit}
            className="space-y-5"
            style={{ width: "90%" }}
          >
            <div>
              <label
                className={`text-sm  ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={`mt-2 px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-transparent border text-black"
                } outline-none focus:border-indigo-600 shadow-sm rounded-lg transition duration-300`}
                style={{ width: "100%" }}
              />
            </div>

            {errorMessage && (
              <p className="text-red-600  center-text">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-3 py-2 text-white font-medium rounded-lg ${
                isSigningIn
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isSigningIn ? "Sending Email..." : "Send Password Reset Email"}
            </button>
          </form>
          <p
            className={`text-left text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Remember your password?{" "}
            <Link to={"/login"} className="hover:underline ">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
