import Lottie from "lottie-react";
import "./empty.scss";
import loader from "./map.json";

export default function Empty() {
  return (
    <div className="empty-section">
      <Lottie loop={false} animationData={loader}></Lottie>
      <h2>Hey, Select Any Planet</h2>
      <h3>
        Monitor All Your Team Mates Time Zones & become 10x more productive in
        scheduling meetings
      </h3>
    </div>
  );
}
