// @ts-nocheck
import { useEffect, useState } from "react";
import "../Register/register.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwrite.config";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //Select CanvasHTML and context
    const canvas = document.getElementById("Stars");
    const ctx = canvas.getContext("2d");

    //Set Canvas and default options
    let delta = 0.5;
    const InitCanvas = () => {
      document.body.style = `
    background-color: #000;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    overflow: hidden scroll;
    `;
      canvas.style.position = "fixed";
      canvas.setAttribute("width", `${window.innerWidth}px`);
      canvas.setAttribute("height", `${window.innerHeight}px`);
      ctx.clearRect(0, 0, Stars.width, Stars.height);
    };

    //Stars Constructor
    class Stars {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.glow = "#cfcfcf88";
        this.radius = 0.2;
      }
      beforeStart() {
        if (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < 0 ||
          this.y > canvas.height
        ) {
          this.radius = 0.2;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }
      move() {
        this.radius += 0.025 / delta;
        const speed = 100 * delta;
        this.x += (this.x - canvas.width / 2) * (this.radius / speed);
        this.y += (this.y - canvas.height / 2) * (this.radius / speed);
      }
      draw() {
        this.beforeStart();
        this.move();
        ctx.beginPath();
        ctx.fillStyle = this.glow;
        ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    //Make Star Array
    function StarArray(amount = 100) {
      const x = () => Math.random() * window.innerWidth;
      const y = () => Math.random() * window.innerHeight;
      const color = "#ffffff";
      let array = Array.from(
        { length: amount },
        () => new Stars(x(), y(), color)
      );
      return array;
    }

    //Array of Stars objects
    const stars = StarArray();

    //Init animation
    function Update() {
      InitCanvas();
      stars.forEach((star) => star.draw());
      requestAnimationFrame(Update);
    }
    Update();

    //Scroll to modify velocity
    addEventListener("scroll", (e) => {
      delta = window.scrollY * 0.01 + 0.5;
    });
  }, []);

  useEffect(() => {
    async function getAuthStatus() {
      const user = await account.get();
      console.log(user);

      if (Object.keys(user).length !== 0) {
        navigate("/dashboard");
      }
    }

    getAuthStatus();
  });

  const handleLogin = async () => {
    if (email && password) {
      const loginPromise = account.createEmailPasswordSession(email, password);
      toast
        .promise(loginPromise, {
          pending: "Logging In To Your Account...",
          success: "Logged In successfully!",
          error: "Incorrect email/password.",
        })
        .then(() => {
          console.log("Navigating to dashboard");
          // Add your navigation logic here, for example:
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    } else {
      toast.error("Please enter both email and password.");
    }
  };
  return (
    <div className="login-page">
      <canvas id="Stars"></canvas>
      <div className="container">
        <h2>Welcome back to TimeFolio</h2>
        <h3>Boost team's productivity</h3>

        <input
          type="text"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="btns">
          <button>Forgot Password</button>
          <button onClick={handleLogin}>Log In</button>
        </div>
        <div className="or">
          <div className="line"></div>
          <p>OR</p>
          <div className="line"></div>
        </div>
        <button>Log In With Google</button>
        <Link to={"/register"} className="loginNavigation">
          <button>New To TimeFolio ?? Create An Account</button>
        </Link>
      </div>
      <ToastContainer
        style={{ width: "500px" }}
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
