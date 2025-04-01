import { useState } from "react";

const PasswordInput = ({ isRegistering, isDarkMode, setPassword, password, passwordStrength, setPasswordStrength }) => {
  const [passwordError, setPasswordError] = useState("");

  const checkPasswordStrength = (pwd) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (strongRegex.test(pwd)) {
      setPasswordStrength("strong");
      setPasswordError("");
    } else if (mediumRegex.test(pwd)) {
      setPasswordStrength("medium");
      setPasswordError("Password should include at least one special character and be at least 8 characters long.");
    } else {
      setPasswordStrength("weak");
      setPasswordError("Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, and one number.");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  return (
    <div>
      <label className="text-sm font-semibold">Enter a strong password</label> <br />
      <input
        disabled={isRegistering}
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={handlePasswordChange}
        className={`w-full my-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      />
      {
        passwordStrength !== "strong" ?
        <p style={{width: "107%"}} className="mb-3 text-sm  justify-text">Password must be at least 8 characters and include at least one uppercase (capital) letter, one lowercase (small) letter, one number and one special character (@$!%*?&.).</p>
        : null
      }

      {/* {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>} */}
      <div className="center-hrz" style={{width: "107%"}}>
      <span className="mr-2">{passwordStrength}</span>

      <div className="w-full h-2 mt-2 rounded-full bg-gray-300">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            passwordStrength === "strong"
              ? "bg-green-500 w-full"
              : passwordStrength === "medium"
              ? "bg-yellow-500 w-2/3"
              : "bg-red-500 w-1/3"
          }`}
        >
        </div>
      </div>
      </div>

    </div>
  );
};

export default PasswordInput;
