// src/components/Contact.js
import React from "react";

const Contact = () => {
  return (
    <>
      {/* Header Start */}
      <div className="header-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-12 navbar-light">
              <div className="logo">
                <a href="/">
                  <img alt="logo" className="logo-default" src="images/logo.png" />
                </a>
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="navigation-wrap" id="filters">
                <nav className="navbar navbar-expand-lg navbar-light">
                  <a className="navbar-brand" href="/">Menu</a>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <button className="close-toggler" type="button" data-toggle="offcanvas">
                      <span><i className="fas fa-times-circle"></i></span>
                    </button>
                    <ul className="navbar-nav mr-auto">
                      <li className="nav-item">
                        <a className="nav-link active" href="/">Home</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/about">About</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/login">Login</a>
                        <ul className="submenu">
                          <li><a href="/register">Applicants</a></li>
                          <li><a href="/login">Student</a></li>
                          <li><a href="/login">Staff</a></li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact Us</a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="header_info"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Inner Heading */}
      <div className="innerHeading-wrap">
        <div className="container">
          <h1>Contact Us</h1>
        </div>
      </div>

      {/* Inner Content */}
      <div className="innerContent-wrap">
        <div className="container">
          <div className="cont_info">
            <div className="row">
              <div className="col-lg-3 col-md-6 md-mb-30">
                <div className="address-item style">
                  <div className="address-icon"><i className="fas fa-phone-alt"></i></div>
                  <div className="address-text">
                    <h3 className="contact-title">Call Us</h3>
                    <ul className="unorderList">
                      <li><a href="tel:+2348037602114">+234 803 760 2114</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 md-mb-30">
                <div className="address-item style">
                  <div className="address-icon"><i className="far fa-envelope"></i></div>
                  <div className="address-text">
                    <h3 className="contact-title">Mail Us</h3>
                    <ul className="unorderList">
                      <li><a href="mailto:info@elbethelacademy.ng">info@elbethelacademy.ng</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 sm-mb-30">
                <div className="address-item">
                  <div className="address-icon"><i className="far fa-clock"></i></div>
                  <div className="address-text">
                    <h3 className="contact-title">Opening Hours</h3>
                    <ul className="unorderList">
                      <li>Mon - Fri : 10am to 2pm</li>
                      <li>Sat - Sun : Closed</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="address-item">
                  <div className="address-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="address-text">
                    <h3 className="contact-title">Address</h3>
                    <p>Off Bida Road, Kpakungu, Minna, Niger State, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-lg-7">
                <div className="login-wrap">
                  <div className="contact-info login_box">
                    <div className="contact-form loginWrp registerWrp">
                      <form id="contactForm" noValidate>
                        <h3>Get In Touch</h3>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input type="text" name="first_name" className="form-control" placeholder="First Name" required />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input type="text" name="last_name" className="form-control" placeholder="Last Name" required />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input type="email" name="email" className="form-control" placeholder="Email Address" required />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input type="tel" name="phone" className="form-control" placeholder="Phone" required />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-group">
                              <textarea name="message" className="form-control" placeholder="Message" rows="6" required></textarea>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-group">
                              <button type="submit" className="default-btn btn send_btn">
                                Submit <span></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="map">
                  <iframe
                    src="https://maps.google.com/maps?q=9.6049822,6.5184669&z=17&output=embed"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Start */}
      <div className="footer-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="footer_logo">
                <img alt="logo" className="footer-default" src="images/logo.png" />
              </div>
              <p>GREAT Elbethel Academy Minna offers a nurturing, innovative learning environment...</p>
            </div>
            <div className="col-lg-2 col-md-3">
              <h3>Quick links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/classes">Classes</a></li>
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
                <li>Saturday <span>Closed</span></li>
                <li>Sunday <span>Closed</span></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="footer_info">
                <h3>Get in Touch</h3>
                <ul className="footer-adress">
                  <li className="footer_address"><i className="fas fa-map-signs"></i> <span>Off Bida Road, Kpakungu Minna, Niger State.</span></li>
                  <li className="footer_email"><i className="fas fa-envelope"></i> <span><a href="mailto:info@elbethelacademy.ng"> info@elbethelacademy.ng </a></span></li>
                  <li className="footer_phone"><i className="fas fa-phone-alt"></i> <span><a href="tel:+2348037602114"> +234 803 760 2114</a></span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      <div className="footer-bottom text-center">
        <div className="container">
          <div className="copyright-text">Copyright © ELBETHEL ACADEMY Minna 2025. All Rights Reserved</div>
        </div>
      </div>
    </>
  );
};

export default Contact;
