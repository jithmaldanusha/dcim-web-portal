"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import './page.css';
import LoginButton from "./components/formcomponents/buttons/loginbutton";
import ClearButton from "./components/formcomponents/buttons/clearbutton";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginClick = () => {
    router.push('/dashboard');
  };

  const handleClearClick = () => {
    setEmail('');      // Clear email input
    setPassword('');   // Clear password input
    setShowPassword(null);
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">

          <div className="container mx-auto col-xl-8 d-flex shadow rounded-3">
            {/* Image Section */}
            <div className="col-xl-6 d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
              <img
                src="idclogo.svg"
                className="img-fluid"
                alt="Sample image"
              />
            </div>

            {/* Form Section */}
            <div className="col-xl-5 d-flex justify-content-center align-items-center">
              <form className="w-75"> 
                <div className="d-flex flex-row justify-content-end mt-4 mb-0">
                  <p className="lead fw-bold mb-0">IDC Manager</p>
                </div>
                <hr />

                <div className="d-flex flex-row mt-4">
                  <p className="lead fw-semibold mb-3">Login</p>
                </div>

                {/* Email input */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example3">Email address</label>
                  <input
                    type="email"
                    id="form3Example3"
                    className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    value={email}        // Bind input value to state
                    onChange={(e) => setEmail(e.target.value)}  // Update state on input change
                  />
                </div>

                {/* Password input with toggler */}
                <div data-mdb-input-init className="form-outline mb-3 position-relative">
                  <label className="form-label" htmlFor="form3Example4">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="form3Example4"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
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

                {/* Remember me and Forgot password */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="form2Example3"
                    />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">Forgot password?</a>
                </div>

                {/* Login and Clear buttons */}
                <div className="d-flex flex-row justify-content-end">

                  <ClearButton onClick={handleClearClick} className="m-1" />

                  <LoginButton onClick={handleLoginClick} />

                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
