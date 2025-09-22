import React from "react";
import "./login.css"; // make sure your CSS files are imported or copied here

const Login = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-light py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <a href="/">
            <img src="images/logo.png" alt="School Logo" style={{ height: "50px" }} />
          </a>
          <nav>
            <a href="/" className="mx-2">Home</a>
            <a href="/about" className="mx-2">About</a>
            <a href="/contact" className="mx-2">Contact</a>
          </nav>
        </div>
      </header>

      {/* Login Section */}
      <section className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-3">Student Login</h3>
          <p className="text-center text-muted">Access your personal dashboard</p>

          {/* Login Form */}
          <form id="loginForm" method="POST" action="/login">
            <div className="form-group">
              <input type="email" name="email" className="form-control" placeholder="Email" required />
            </div>
            <div className="form-group mt-3">
              <input type="password" name="password" className="form-control" placeholder="Password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
          </form>

          {/* Extra Options */}
          <div className="text-center mt-3">
            <a href="/register">New student? Create an account</a><br />
            <a href="/forgot-password" className="text-muted">Forgot Password?</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2025 El-Bethel Academy. All Rights Reserved.</small>
      </footer>
    </>
  );
};

export default Login;
