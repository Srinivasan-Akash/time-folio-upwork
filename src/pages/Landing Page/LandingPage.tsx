// @ts-nocheck
import Navbar from "./Navbar/Navbar"
import Hero from "./Hero/Hero"
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import Footer from "./Footer/Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <TawkMessengerReact
        propertyId="6659af20981b6c564776c1d3"
        widgetId="1hv7586n0" />
      <Footer></Footer>

    </div>
  )
}
