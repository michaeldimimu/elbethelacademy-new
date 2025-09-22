import React from "react";

function Header() {
  return (
    <header>
      <nav className="navbar">
        <img src="/images/logo.png" alt="Elbethel Logo" />
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/classes">Classes</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
