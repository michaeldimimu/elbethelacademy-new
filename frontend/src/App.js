import React, { useEffect } from "react";
import "./App.css"; // your main CSS if any
import Header from "./components/Header";
import Slider from "./components/Slider";
import School from "./components/School";
import About from "./components/About";
import Classes from "./components/Classes";
import Choice from "./components/Choice";
import Video from "./components/Video";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Enroll from "./components/Enroll";
import Teachers from "./components/Teachers";
import Blog from "./components/Blog";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    // WOW.js initialization
    if (window.WOW) new window.WOW().init();

    // Owl Carousel initialization
    if (window.$ && window.$.fn.owlCarousel) {
      window.$(".owl-carousel").owlCarousel({
        items: 3,
        margin: 10,
        loop: true,
        autoplay: true,
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } },
      });
    }

    // Fancybox initialization
    if (window.$ && window.$.fancybox) {
      window.$(".fancybox").fancybox();
    }
  }, []);

  return (
    <>
      <Header />
      <Slider />
      <School />
      <About />
      <Classes />
      <Choice />
      <Video />
      <Gallery />
      <Testimonials />
      <Enroll />
      <Teachers />
      <Blog />
      <Footer />
    </>
  );
}

export default App;
