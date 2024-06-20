import { Link } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar({hideMenu}) {
  return (
    <nav className="navbar-home">
      <div className="logo">
        <h2><Link to={"/"}>TimeFolio</Link></h2>
      </div>

      <div className="links" style={{opacity: hideMenu ? "0" : "1"}}>
        <Link to={"/"}>Home</Link>
        <Link to={"/payment"}>Pricing</Link>

        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kota.baby.work@gmail.com">Contact Us</a>

      </div>

      <div className="btns" style={{opacity: hideMenu ? "0" : "1"}}>
        <button>
          <Link to="/dashboard">Log In</Link>
        </button>
        <button>
          <Link to="/register">Sign Up</Link>
        </button>
      </div>
    </nav>
  );
}
