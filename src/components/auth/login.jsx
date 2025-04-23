import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import toast from "react-hot-toast";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import animation from "../../assets/animation/loadingcubes.json";
import Lottie from "lottie-react";
import { useUser } from "../../contexts/userContext";
import SecondFactor from "../forms/SecondFactor";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [show2fa, setShow2fa] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoggedIn) {
      const shouldRedirect = localStorage.getItem("redirectToOnboarding");

      if (shouldRedirect) {
        localStorage.removeItem("redirectToOnboarding"); // Clean up
        const orgID = localStorage.getItem("onboardingOrgID");
        localStorage.removeItem("onboardingOrgID");
        navigate(`/onboarding/${orgID}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [userLoggedIn, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      toast.success("Successfully Signed In");
    } catch (e) {
      switch (e.code) {
        case "auth/multi-factor-auth-required":
          setShow2fa(true);
          setError(e);
          break;
        case "auth/invalid-credential": // Handle other errors, such as wrong passwords.
          setErrorMessage("Invalid Email or Password");
          toast.error("Invalid Email or Password");
          break;
        default:
          toast.error("Error Signing In");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div
      className={`w-full flex self-center  place-items-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* {userLoggedIn ? <Navigate to="/" replace={true} /> : null} */}
      <main className="w-full flex self-center place-content-center place-items-center white-text">
        <div
          className={`w-96 space-y-5 p-4 shadow-xl border rounded-xl ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          } transition duration-300`}
        >
          {show2fa ? (
            <>
              <div className="text-center">
                <div className="mt-2">
                  <h3
                    className={`text-xl  sm:text-2xl ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Please enter the OTP to continue
                  </h3>
                </div>
              </div>
              <SecondFactor isDarkMode={isDarkMode} error={error} />
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mt-2">
                  <h3
                    className={`text-xl  sm:text-2xl ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Welcome back! <br /> Log in to continue
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

                <div>
                  <label
                    className={`text-sm  ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className={`w-full mt-2 px-3 py-2 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-transparent border text-black"
                    } outline-none focus:border-indigo-600 shadow-sm rounded-lg transition duration-300`}
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-600  center-text">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                    isSigningIn
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 hover:shadow-xl transition duration-300"
                  }`}
                >
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </button>
              </form>
              <p
                className={`text-center text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Don't have an account?{" "}
                <Link to={"/register"} className="hover:underline ">
                  Sign up
                </Link>
              </p>
              <p
                className={`text-center text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Forgot Password?{" "}
                <Link to={"/forgotpassword"} className="hover:underline ">
                  Click Here
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
