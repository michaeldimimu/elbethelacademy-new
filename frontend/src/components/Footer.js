import React from "react";

function Footer() {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="container">
          <div className="row">
            {/* Logo & Info */}
            <div className="col-lg-4">
              <div className="footer_logo">
                <img alt="Elbethel Logo" src="/images/logo.png" />
              </div>
              <p>
                GREAT Elbethel Academy Minna offers a nurturing, innovative learning
                environment, fostering academic excellence, creativity, and critical thinking.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-3">
              <h3>Quick links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/classes">Classes</a></li>
              </ul>
            </div>

            {/* Opening Hours */}
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

            {/* Contact Info */}
            <div className="col-lg-3 col-md-4">
              <h3>Get in Touch</h3>
              <ul className="footer-adress">
                <li><i className="fas fa-map-signs"></i> Off bida road, kpakungu minna, niger state.</li>
                <li><i className="fas fa-envelope"></i> <a href="mailto:elbethel@gmail.com">bethel.co</a></li>
                <li><i className="fas fa-phone-alt"></i> <a href="tel:4282433">+234 803 760 2114</a></li>
              </ul>
              <div className="social-icons footer_icon">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom text-center">
        <p>Copyright © Elbethel Academy Minna 2025. All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
