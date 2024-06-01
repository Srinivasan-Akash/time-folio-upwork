// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import "./dashboard.scss";
import { account, databases } from "../../appwrite/appwrite.config";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { ID, Query } from "appwrite";
import { ToastContainer, toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import loader from "./empty/city.json";
import city from "./empty/city 2.json";
import "./empty/empty.scss";
import { cityMapping, lookupViaCity } from "city-timezones";
import { CityData } from "city-timezones";
import Clock from "./Clock/Clock";
import Tilt from "react-parallax-tilt";
import { getRandomColor } from "../../utils/colors";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [planetsData, setPlanetsData] = useState(null);

  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const planets_popup_element = useRef<HTMLElement | null>();
  const planetNameInputField = useRef<HTMLInputElement | null>();
  const sidebar = useRef();
  const mainContent = useRef();

  useEffect(() => {
    async function getAuthStatus() {
      try {
        const user = await account.get();
        setUserData(user);
        getPlanets(user.$id);
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setLoading(false);
        // Set loading to false after fetching user
      }
    }

    getAuthStatus();
  }, [planetsData]); // TODO: causes rapid change in color in the card

  const toggleSidebar = () => {
    if (isSideBarOpen) {
      sidebar.current.classList.add("hidden");
      mainContent.current.classList.add("full-w");
    } else {
      sidebar.current.classList.remove("hidden");
      mainContent.current.classList.remove("full-w");
    }
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setCity(query);

    if (query.length > 1) {
      const filteredCities = cityMapping.filter((cityObj) =>
        cityObj.city.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  async function deleteCard(id, documentId) {
    // Parse the current time zones and filter out the one to delete
    const updatedTimeZones = JSON.parse(currentPlanet.timeZones).filter(
      (timezone) => timezone.id !== id
    );

    // Convert the updated array back to JSON
    const updatedTimeZonesJson = JSON.stringify(updatedTimeZones);

    // Update the state with the new time zones
    setCurrentPlanet((prev) => ({
      ...prev,
      timeZones: updatedTimeZonesJson,
    }));

    // Update the document in the database
    const promise = databases.updateDocument(
      "time-zones",
      "time-zones",
      documentId,
      { timeZones: updatedTimeZonesJson }
    );

    // Provide feedback to the user
    toast.promise(promise, {
      pending: "Deleting time zone...",
      success: "Time zone deleted successfully!",
      error: "Failed to delete time zone. Please try again.",
    });

    // Handle promise if needed
    try {
      await promise;
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }


  const addTimeZone = (newCity) => {
    const newTimeZone = {
      address:
        selectedCity.country.length >= 8
          ? selectedCity.city + ", " + selectedCity.iso3
          : selectedCity.city + ", " + selectedCity.country,
      timezone: selectedCity.timezone,
      id: ID.unique(),
    };



    if (
      userData.labels.length === 0 &&
      JSON.parse(currentPlanet.timeZones).length >= 3
    ) {
      toast.error("Please upgrade your plan !! To create more planets");
      return; // Exit the function if limit is reached
    }

    setCurrentPlanet((prevPlanet) => {
      const timeZonesArray = JSON.parse(prevPlanet.timeZones);
      const updatedTimeZones = [...timeZonesArray, newTimeZone];
      return {
        ...prevPlanet,
        timeZones: JSON.stringify(updatedTimeZones),
      };
    });

    // Update document in the database
    const updatedTimeZones = [
      ...JSON.parse(currentPlanet.timeZones),
      newTimeZone,
    ];
    const promise = databases.updateDocument(
      "time-zones",
      "time-zones",
      currentPlanet.$id,
      {
        timeZones: JSON.stringify(updatedTimeZones),
      }
    );

    // Show toast notification for the operation
    toast.promise(promise, {
      pending: "Adding new time zone...",
      success: "Time zone added successfully!",
      error: "Failed to add time zone. Please try again.",
    });

    // Handle promise if needed
    promise
      .then(() => {
        console.log("Document updated successfully");
        // Ensure state is updated after successful database update
        openPlanet(currentPlanet.$id, currentPlanet.planetName);
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
  };

  const handleSelectCity = (city) => {
    setCity(city.city);
    setSuggestions([]);
    setSelectedCity(city);
  };

  async function getPlanets(userId: string) {
    const planets = await databases.listDocuments("time-zones", "time-zones", [
      Query.equal("userId", userId),
    ]);

    setPlanetsData(planets);
  }

  async function createPlanet() {
    console.log(userData);
    if (userData.labels.length === 0 && planetsData.total === 3) {
      toast.error("Please upgrade your plan !! To create more planets");
    } else {
      const planetName = planetNameInputField?.current.value?.trim(); // Safely get and trim value
      if (!planetName) {
        toast.error("Please Enter A Valid Planet Name");
        return null;
      }

      const allowedChars = /^[a-zA-Z0-9\s]+$/;
      if (!allowedChars.test(planetName)) {
        toast.error("Invalid planet name. Symbols are not allowed !!");
        return null;
      }
      const planet_creation_promise = databases.createDocument(
        "time-zones",
        "time-zones",
        ID.unique(),
        { planetName, userId: userData.$id }
      );
      toast
        .promise(planet_creation_promise, {
          pending: "Creating New Planet...",
          success: "Planet created successfully!",
          error: "Planet Creation Failed. Please try again.",
        })
        .then(() => {
          planets_popup_element.current?.classList.remove("active");
          getPlanets(userData.$id);
        })
        .catch((error) => {
          console.error("Planet Creation Failed", error);
        });
    }
  }

  async function openPlanet(e, documentId, planetName) {
    if (e.target.classList.contains('delete')) {
      console.log('Delete action detected');
      const promise = databases.deleteDocument("time-zones", "time-zones", documentId)
      toast.promise(promise, {
        pending: "Deleting time zone...",
        success: "Time zone deleted successfully!",
        error: "Failed to delete time zone. Please try again.",
      });
      getPlanets(userData.$id)
      

      return;
    } else {
      setCurrentPlanet({ planetName: planetName });

      const currentPlanet = await databases.getDocument(
        "time-zones",
        "time-zones",
        documentId
      );
      setCurrentPlanet(currentPlanet);
    }
  }

  function openPlanetsPopup() {
    if (!popupIsOpen) {
      planets_popup_element.current?.classList.add("active");
    }
  }

  function closePopup(e: any) {
    console.log(e.target);
    if (
      e.target.classList[0] === "planet-popup" ||
      e.target.classList[0] === "close"
    ) {
      planets_popup_element.current?.classList.remove("active");
    }
  }

  return (
    <>
      {loading === true ? (
        <Loader></Loader>
      ) : (
        <SkeletonTheme baseColor="#202020" highlightColor="#0E0E11">
          <div className="dashboard">
            <div
              className="planet-popup"
              ref={planets_popup_element}
              onClick={closePopup}
            >
              <div className="modal">
                <svg
                  className="close"
                  onClick={closePopup}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path className="close" d="M18 6 6 18" />
                  <path className="close" d="m6 6 12 12" />
                </svg>
                <h2>Create A New Planet</h2>
                <h3>A Planet Can Have Multiple Set Of Timezones</h3>
                <div className="form">
                  <input
                    type="text"
                    ref={planetNameInputField}
                    placeholder="Enter Planet Name"
                  />
                  <button onClick={createPlanet}>CREATE</button>
                </div>
              </div>
            </div>
            <div className="sidebar" ref={sidebar}>
              <svg
                className="collapse"
                width="21"
                height="106"
                viewBox="0 0 21 106"
                onClick={toggleSidebar}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_367_2)">
                  <path
                    d="M0.5 105.5L0.5 0.499997L17.7361 15.095C19.43 16.5294 20.5 19.4615 20.5 22.6689L20.5 83.3311C20.5 86.5385 19.43 89.4706 17.7361 90.9049L0.5 105.5Z"
                    fill="#232323"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_367_2">
                    <rect
                      width="105"
                      height="20"
                      fill="white"
                      transform="matrix(0 -1 1 0 0.5 105.5)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <div className="planets">
                <div className="options" onClick={openPlanetsPopup}>
                  <h2>Create Planets</h2>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-circle-plus"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                </div>

                {planetsData
                  ? planetsData.documents.map((el, index) => {
                    return (
                      <div
                        className="planet"
                        key={index}
                        onClick={(e) => openPlanet(e, el.$id, el.planetName)}
                      >
                        <h3>{el.planetName}</h3>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="delete"
                        >
                          <path d="M3 6h18" className="delete" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" className="delete" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" className="delete" />
                          <line x1="10" x2="10" y1="11" y2="17" className="delete" />
                          <line x1="14" x2="14" y1="11" y2="17" className="delete" />
                        </svg>
                      </div>
                    );
                  })
                  : [0, 1, 2, 3].map((el) => {
                    return <Skeleton className="shadow"></Skeleton>;
                  })}
              </div>

              <div className="btns">
                <svg
                  id="account"
                  onClick={() => navigate("/account")}
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle-user-round"
                >
                  <path d="M18 20a6 6 0 0 0-12 0" />
                  <circle cx="12" cy="10" r="4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <button
                  onClick={() => {
                    if (userData.labels.length === 0) {
                      navigate("/payment");
                    }
                  }}
                  className="upgrade"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-crown"
                  >
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                    <path d="M5 21h14" />
                  </svg>
                  {userData.labels[0] === "pro"
                    ? "PREMIUM USER"
                    : "UPGRADE"}
                </button>
              </div>
            </div>

            <div className="main" ref={mainContent}>
              {currentPlanet ? (
                <>
                  <nav>
                    <h2>{currentPlanet.planetName}</h2>
                    <div className="form">
                      <div className="inputField">
                        <div
                          className={`autocomplete ${suggestions.length > 0 ? "show" : ""
                            }`}
                        >
                          {suggestions.length === 0 ? (
                            <></>
                          ) : (
                            suggestions.map((suggestion, index) => (
                              <h2
                                key={index}
                                onClick={() => handleSelectCity(suggestion)}
                                style={{ cursor: "pointer" }}
                              >
                                {suggestion.city}, {suggestion.country}
                              </h2>
                            ))
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Enter City Name"
                          value={city}
                          onChange={handleChange}
                        />
                      </div>
                      <button onClick={addTimeZone}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-map-pinned"
                        >
                          <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
                          <circle cx="12" cy="8" r="2" />
                          <path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835" />
                        </svg>
                        <h2>Add Location</h2>
                      </button>
                    </div>
                  </nav>
                  <section>
                    {currentPlanet.timeZones
                      ? JSON.parse(currentPlanet.timeZones).map(
                        (item, index) => {
                          console.log(item, "BOO");
                          return (
                            <Clock
                              key={index}
                              timezone={item.timezone}
                              address={item.address}
                              allTimezones={JSON.parse(
                                currentPlanet.timeZones
                              )}
                              id={item.id}
                              deleteCard={deleteCard}
                              documentId={currentPlanet.$id}
                              onClick={() => alert("HI")}
                              color={getRandomColor()}
                            />
                          );
                        }
                      )
                      : [0, 1, 3].map((item) => {
                        return <Skeleton className="card-skeleton" />;
                      })}
                  </section>
                </>
              ) : (
                <Empty popupFunc={openPlanetsPopup}></Empty>
              )}
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
        </SkeletonTheme>
      )}
    </>
  );
}

export function Empty({ popupFunc }) {
  return (
    <div className="empty">
      <div className="empty-section">
        <Lottie loop={false} animationData={loader}></Lottie>
        <h2>Hey, Select Any Planet</h2>
        <h3>
          Monitor All Your Team Mates Time Zones & become 10x more productive in
          scheduling meetings
        </h3>
        <div className="btns">
          <div className="options" onClick={popupFunc}>
            <h2>Create Planets</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-plus"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </div>

          <div className="options">
            <h2>Take A Tour</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-school"
            >
              <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
              <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
              <path d="M18 5v17" />
              <path d="m4 6 8-4 8 4" />
              <path d="M6 5v17" />
              <circle cx="12" cy="9" r="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
