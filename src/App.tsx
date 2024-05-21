import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing Page/LandingPage";
import SignIn from "./pages/Login/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
