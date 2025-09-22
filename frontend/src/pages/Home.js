import React, { useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom"; // if using React Router

function Home() {
  useEffect(() => {
    // Initialize Owl Carousel
    if ($(".owl-carousel").length) {
      $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 3000,
      });
    }

    // Initialize Fancybox
    if ($("[data-fancybox]").length) {
      $("[data-fancybox]").fancybox();
    }

    // Initialize WOW.js
    if (window.WOW) {
      new WOW().init();
    }
  }, []);

  return (
    <div>
      {/* Header Start */}
      <div className="header-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-12 navbar-light">
              <div className="logo">
                <Link to="/"><img className="logo-default" src="/images/logo.png" alt="Logo" /></Link>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="navigation-wrap" id="filters">
                <nav className="navbar navbar-expand-lg navbar-light">
                  <Link className="navbar-brand" to="#">Menu</Link>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                      <li className="nav-item">
                        <Link className="nav-link active" to="/">Home</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
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

      {/* TODO: Add Revolution Slider, Classes, About, Gallery, Testimonials, Blog, Footer */}
      {/* Convert remaining sections following the same approach */}
    </div>
  );
}

export default Home;
