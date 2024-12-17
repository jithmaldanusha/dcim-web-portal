"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import './page.css';
import LoginButton from "./components/formcomponents/buttons/loginbutton";
import ClearButton from "./components/formcomponents/buttons/clearbutton";
import { Login } from "./api/session"; // Import the client-side API function

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // To display error messages

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginClick = async () => {
    try {
      setErrorMessage(null); // Clear any previous errors
      const response = await Login(username, password);

      if (response) {
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      }

    } catch (error) {
      // Display error message to user
      setErrorMessage(error.response?.data?.error || 'Failed to log in. Please try again.');
    }
  };

  const handleClearClick = () => {
    setUsername('');      // Clear username input
    setPassword('');      // Clear password input
    setShowPassword(false); // Reset password visibility
    setErrorMessage(null); // Clear any error messages
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center h-100">

          <div className="container mx-auto col-xl-8 col-md-10 d-flex shadow rounded-3">
            {/* Image Section */}
            <div className="col-xl-6 col-md-5 d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
              <img
                src="idclogo.svg"
                className="img-fluid"
                alt="Sample image"
              />
            </div>

            {/* Form Section */}
            <div className="col-xl-5 col-md-6 d-flex justify-content-center align-items-center">
              <form className="w-75">
                <div className="d-flex flex-row justify-content-end mt-4 mb-0">
                  <p className="lead fw-bold mb-0">IDC Manager</p>
                </div>
                <hr />

                <div className="d-flex flex-row mt-4">
                  <p className="lead fw-semibold mb-3">Login</p>
                </div>

                {/* Username input */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="usernameInput">Username</label>
                  <input
                    type="text"
                    id="usernameInput"
                    className="form-control form-control-lg"
                    placeholder="Enter your username"
                    value={username}        // Bind input value to state
                    onChange={(e) => setUsername(e.target.value)}  // Update state on input change
                  />
                </div>

                {/* Password input with toggler */}
                <div data-mdb-input-init className="form-outline mb-3 position-relative">
                  <label className="form-label" htmlFor="passwordInput">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordInput"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={password}      // Bind input value to state
                    onChange={(e) => setPassword(e.target.value)}  // Update state on input change
                  />
                  <img
                    src="/formicons/pwdtoggler.svg"
                    className={`password-toggle-icon ${showPassword ? 'active' : ''}`}
                    onClick={togglePasswordVisibility}
                    alt="Toggle Password Visibility"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="text-danger mb-3">
                    {errorMessage}
                  </div>
                )}

                {/* Remember me and Forgot password */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="rememberMeCheck"
                    />
                    <label className="form-check-label" htmlFor="rememberMeCheck">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">Forgot password?</a>
                </div>

                {/* Login and Clear buttons */}
                <div className="d-flex flex-row justify-content-end">

                  <ClearButton onClick={handleClearClick} className="m-1" />

                  <LoginButton onClick={(e) => {
                    e.preventDefault();
                    handleLoginClick();
                  }} />

                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
