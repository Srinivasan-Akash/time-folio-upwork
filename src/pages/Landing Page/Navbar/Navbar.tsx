import "./Navbar.scss";

export default function Navbar() {
  return (
    <nav className="navbar-home">
      <div className="logo">
        <h2>TimeFolio</h2>
      </div>

      <div className="links">
        <a href="#">Home</a>
        <a href="#">Pricing</a>
        <a href="#">FAQ</a>
        <a href="#">Contact Us</a>
      </div>

      <div className="btns">
        <button>Get Started</button>
      </div>
    </nav>
  );
}
