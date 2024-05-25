import { useEffect, useState } from "react";
import "./payment.scss";
import { account } from "../../appwrite/appwrite.config";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import axios from "axios";

export default function Payment() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const lemonSqueezyConfig = {
    API_KEY:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI1ZWU1Yjk0NGFmZGZkZWRkNGY3NzNkMmZjZGQyYWRlMWE1NzUzYmMzNTE2MjMyZmQ2NTMyNDdmNDdmYjJiOTdmNjJiODU4ZDFiMDk1NTY3ZSIsImlhdCI6MTcxNjU1MjAwNi4zMzM3MjEsIm5iZiI6MTcxNjU1MjAwNi4zMzM3MjQsImV4cCI6MjAzMjA4NDgwNi4zMDEyMzgsInN1YiI6IjIyOTI3MDEiLCJzY29wZXMiOltdfQ.ah7i7oGTDEXgu9I3P3FAfACzhfyoTYHlQwUkTDy4qPgHQIUccbItqu8jcz2kEf74qW29204rWnUMarbC775fnqNrKEMa8-t4zR5vxPItt6liOizW8SDFhByo1IbZqa7IGob_RSwEEO8EsURmbff9kY0l8pr_QTQJbD1eAZbeHal6GpkzhwnLoEfGHGLKAahWU3Z5q3oC4IhW3EDmwLChqtdIlhXLCAXq4k34nYny-PxL1Q70bIX3VFG9g093jLYQ1BjxaYDUeFFjGrROOzOO0VuCrHVtKxRXtvXeXqHd2EBWFqaYV1WqXJjZ_7YeN591_4V_jApj3gwg6UIrFGWyGiMJCfBqFRbs3xZkRGpAl3b6fNntfS908997WsAj_lTHXB33R72Ty9bK9yyHctY5EhX5K7TGF3kwrFgY4GcIe1UeeviijfLDvtZZECgu2DXXfjPiMC9LySKZvwsdKN12py9Fy1uh3uJbQxxcLTWqRRXh5mCdbQwtD382mN8Ec4zt",
    URL: "https://api.lemonsqueezy.com",
  };

  const headers = {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: "Bearer " + lemonSqueezyConfig.API_KEY,
  };

  useEffect(() => {
    async function getAuthStatus() {
      try {
        const user = await account.get();
        setUserData(user);
        getProducts();
        if (Object.keys(user).length === 0) {
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    async function getProducts() {
      fetch("https://api.lemonsqueezy.com/v1/products", {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: "Bearer " + lemonSqueezyConfig.API_KEY, // Replace {api_key} with your actual API key
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data); // This will log the product data to the console
          setProducts(data.data);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }

    getAuthStatus();
  }, []);


  async function handleClick(storeId, productId) {
      console.log(userData)
      const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${lemonSqueezyConfig.API_KEY}`
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: { checkout_data: { email: userData.email, custom: [userData.$id] } },
            relationships: {
              store: { data: { type: "stores", id: storeId.toString() } },
              variant: { data: { type: "variants", id: productId.toString() } },
            },
          },
        }),
      });
      
      const checkout = await response.json();
      window.open(checkout.data.attributes.url, "_blank");
  
  }
  return (
    <div className="payment-page">
      {loading === true ? (
        <Loader></Loader>
      ) : (
        products.map((item: any) => {
          console.log(item);
          return (
            <div className="container">
              <h2>{item.attributes.name} - {item.attributes.price_formatted}</h2>
              <p>{item.attributes.description}</p>
              <button onClick={() => handleClick(item.attributes.store_id, "390766")}>BUY NOW</button>
            </div>
          );
        })
      )}
    </div>
  );
}
