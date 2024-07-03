import { Link } from "react-router-dom"
import "./footer.scss"

export default function Footer() {
  return (
    <footer className="footer">
        <Link to={"/privacy&policy"}>Privacy & Policy</Link>
        <a>·</a>
        <Link to={"/terms"}>Terms & Conditions</Link>
    </footer>
  )
}
