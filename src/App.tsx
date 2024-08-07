import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing Page/LandingPage";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Payment from "./pages/Payment/Payment";
import Account from "./pages/Account/Account";
import TermsAndConditions from "./pages/Terms & Conditions/termsAndConditions";
import Privacy from "./pages/Privacy & Policy/Privacy"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/account" element={<Account />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy&policy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
