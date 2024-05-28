import "./account.scss";
import profile from "../../assets/profile.png";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwrite.config";
import Loader from "../Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import abstractImg from "../../assets/image.png"
export default function Account() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const passwordField = useRef()
  const oldPasswordField = useRef()

  useEffect(() => {
    async function getAuthStatus() {
      try {
        const user = await account.get();
        setUserData(user);
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setLoading(false);
        // Set loading to false after fetching user
      }
    }

    getAuthStatus();
  }, []);

  async function logout() {
    const promise = account.deleteSession("current");
    // Show toast notification for the operation
    toast.promise(promise, {
      pending: "Logging Out...",
      success: "Logged Out Sucessfully!",
      error: "Failed to Logout. Please try again.",
    });

    // Handle promise if needed
    promise
      .then(() => {
        console.log("Document updated successfully");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
  }


  async function updateInfo() {
    const password = passwordField.current.value;
    const oldPassword =oldPasswordField.current.value

    if (!password) {
      toast.error("Password cannot be empty.");
      return;
    }

    const promise = account.updatePassword(password, oldPassword);
    toast.promise(promise, {
      pending: "Updating Password...",
      success: "Updated Password Successfully!",
      error: "Failed to update password. Please try again.",
    });

    promise.catch((err) => {
      console.log(err)
    })
  }


  return (
    <>
      {loading === true ? (
        <Loader></Loader>
      ) : (
        <div className="account-settings">
          <div className="dashboard">
            <img className="profile-pic" src={profile} alt="" />
            <div className="content">
              <h1>Hello There !!</h1>
              <h2>{userData.email}</h2>
              <div className="btns">
                <button>Contact Us</button>
                <button onClick={logout}>Sign Out</button>
              </div>
            </div>
          </div>

          <div className="changeSettings">
            <div className="left">
                <img src={abstractImg} alt="" />
            </div>

            <div className="right">
              <div className="container">
                <h2>Welcome back to TimeFolio</h2>
                <h3>Boost team's productivity</h3>

                <input
                  type="text"
                  placeholder="Enter Your Email"
                    value={userData.email}
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  ref={passwordField}
                />
                <input
                  type="password"
                  placeholder="Enter Old Password"
                  ref={oldPasswordField}
                />
                <div className="btns">
                  <button onClick={updateInfo}>Update Information</button>
                </div>
              </div>
            </div>
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
      )}
    </>
  );
}
