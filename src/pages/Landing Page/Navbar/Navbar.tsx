import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";

export default function Navbar({hideMenu}: {hideMenu: boolean}) {
  const navigate = useNavigate()
  return (
    <nav className="navbar-home">
      <div className="logo">
        <h2><Link to={"/"}>TimeZone Planner</Link></h2>
      </div>

      <div className="links" style={{opacity: hideMenu ? "0" : "1"}}>
        <Link to={"/"}>Home</Link>
        <Link to={"/payment"}>Pricing</Link>

        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kota.baby.work@gmail.com">Contact Us</a>

      </div>

      <div className="btns" style={{opacity: hideMenu ? "0" : "1"}}>
        <button onClick={() => navigate("/dashboard")}>
          <Link to={"/dashboard"}>Log In</Link>
        </button>
        <button onClick={() => navigate("/register")}>
          <Link to="/register">Sign Up</Link>
        </button>
      </div>
    </nav>
  );
}
