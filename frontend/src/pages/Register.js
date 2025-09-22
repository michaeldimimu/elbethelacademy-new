import React from "react";
import "./register.css"; // make sure your CSS files are imported

const Register = () => {
  return (
    <>
      {/* Header */}
      <header className="header-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-12 navbar-light">
              <div className="logo">
                <a href="/">
                  <img alt="logo" className="logo-default" src="images/logo.png" />
                </a>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="navigation-wrap" id="filters">
                <nav className="navbar navbar-expand-lg navbar-light">
                  <a className="navbar-brand" href="#">Menu</a>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                      <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
                      <li className="nav-item"><a className="nav-link" href="/about">About</a></li>
                      <li className="nav-item"><a className="nav-link" href="/classes">Classes</a></li>
                      <li className="nav-item"><a className="nav-link" href="/contact">Contact Us</a></li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="header_info">
                <div className="loginwrp"><a href="/login">Login</a></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Inner Heading */}
      <div className="innerHeading-wrap">
        <div className="container">
          <h1>Student Registration</h1>
        </div>
      </div>

      {/* Registration Form */}
      <div className="innerContent-wrap">
        <div className="container">
          <div className="login-wrap">
            <div className="contact-info login_box">
              <div className="contact-form loginWrp registerWrp">
                <form id="registrationForm" noValidate>
                  {/* Account Information */}
                  <div className="form_set">
                    <h3>Account Information</h3>
                    <div className="form-group">
                      <input type="text" name="username" className="form-control" placeholder="Username" required />
                    </div>
                    <div className="form-group">
                      <input type="password" name="password" className="form-control" placeholder="Password" required />
                      <small className="form-text text-muted">Password must be at least 8 characters</small>
                    </div>
                    <div className="form-group">
                      <input type="password" name="confirm_password" className="form-control" placeholder="Confirm Password" required />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="form_set">
                    <h3>Personal Information</h3>
                    <div className="row">
                      <div className="col-lg-6 form-group">
                        <input type="text" name="first_name" className="form-control" placeholder="First Name" required />
                      </div>
                      <div className="col-lg-6 form-group">
                        <input type="text" name="last_name" className="form-control" placeholder="Last Name" required />
                      </div>
                      <div className="col-lg-6 form-group">
                        <input type="date" name="dob" className="form-control" placeholder="Date of Birth" required />
                      </div>
                      <div className="col-lg-6 form-group">
                        <input type="text" name="nin" className="form-control" placeholder="National ID Number (NIN)" />
                      </div>
                      <div className="col-lg-12 form-group">
                        <input type="text" name="address" className="form-control" placeholder="Home Address" />
                      </div>
                      <div className="col-lg-6 form-group">
                        <input type="email" name="email" className="form-control" placeholder="Email Address" />
                      </div>
                      <div className="col-lg-6 form-group">
                        <input type="tel" name="phone" className="form-control" placeholder="Phone Number" />
                      </div>
                      <div className="col-lg-12 form-group">
                        <label>Upload Passport Photograph</label>
                        <input type="file" name="photo" className="form-control-file" />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="form_set">
                    <h3>Guardian’s Information</h3>
                    <div className="row">
                      <div className="col-lg-6 form-group">
                        <input type="text" name="guardian_name" className="form-control" placeholder="Guardian’s Full Name" />
                      </div>
                      <div className="col-lg-6 form-group">
                        <input type="tel" name="guardian_phone" className="form-control" placeholder="Guardian’s Phone Number" />
                      </div>
                      <div className="col-lg-12 form-group">
                        <input type="text" name="guardian_address" className="form-control" placeholder="Guardian’s Address" />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="form_set">
                    <h3>Academic Information</h3>
                    <div className="row">
                      <div className="col-lg-6 form-group">
                        <input type="text" name="class" className="form-control" placeholder="Class (e.g. SS1)" />
                      </div>
                      <div className="col-lg-6 form-group">
                        <select name="section" className="form-control">
                          <option value="">Select Section</option>
                          <option value="Science">Science</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Arts">Arts</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="form-group text-center">
                    <button type="submit" className="default-btn btn send_btn">Register <span></span></button>
                  </div>

                  <div className="form-group text-center">
                    <div className="already_account">
                      Already have an account? <a href="/login">Login</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="footer_logo"><img alt="" className="footer-default" src="images/logo.png" /></div>
              <p>GREAT Elbethel Academy Minna offers a nurturing, innovative learning environment...</p>
            </div>
            <div className="col-lg-2 col-md-3">
              <h3>Quick links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/classes">Classes</a></li>
                <li><a href="/teachers">Teachers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <h3>Opening Hours</h3>
              <ul className="unorderList hourswrp">
                <li>Monday <span>08:00 - 02:00</span></li>
                <li>Tuesday <span>08:00 - 02:00</span></li>
                <li>Wednesday <span>08:00 - 02:00</span></li>
                <li>Thursday <span>08:00 - 02:00</span></li>
                <li>Friday <span>08:00 - 02:00</span></li>
                <li>Saturday <span>08:00 - 02:00</span></li>
                <li>Sunday <span>Closed</span></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <h3>Get in Touch</h3>
              <ul className="footer-adress">
                <li><i className="fas fa-map-signs"></i> Off bida road, kpakungu minna</li>
                <li><i className="fas fa-envelope"></i> info@example.com</li>
                <li><i className="fas fa-phone-alt"></i> +234 803 760 2114</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer-bottom text-center">
        <div className="container">
          <div className="copyright-text">Copyright © International School System 2025. All Rights Reserved</div>
        </div>
      </div>
    </>
  );
};

export default Register;
