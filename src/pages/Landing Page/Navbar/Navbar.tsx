import { Link } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  return (
    <nav className="navbar-home">
      <div className="logo">
        <h2>TimeFolio</h2>
      </div>

      <div className="links">
        <Link to={"/"}>Home</Link>
        <Link to={"/payment"}>Pricing</Link>

        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kota.baby.work@gmail.com">Contact Us</a>

      </div>

      <div className="btns">
        <button>
          <Link to="/dashboard">Get Started</Link>
        </button>
      </div>
    </nav>
  );
}
