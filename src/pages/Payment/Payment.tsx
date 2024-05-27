// @ts-nocheck
import { useEffect, useState } from "react";
import "./payment.scss";
import { account } from "../../appwrite/appwrite.config";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

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
      } catch (err) {
        console.log(err);
        navigate("/login");
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
    console.log(userData);
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lemonSqueezyConfig.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: { email: userData.email, custom: [userData.$id] },
          },
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
        <div class="container">
          {products.map((item: any) => {
            return (
              <>
                <div class="column">
                  <div class="pricing-card pro">
                    <div class="popular">POPULAR</div>
                    <div class="pricing-header">
                      <span class="plan-title">PRO PLAN</span>
                      <div class="price-circle">
                        <span class="price-title">
                          <small>$</small>
                          <span>2.00</span>
                        </span>
                        <span class="info">/ Month</span>
                      </div>
                    </div>
                    <div class="badge-box">
                      <span>Save 8%</span>
                    </div>
                    <ul>
                      <li>
                        <strong>3+</strong> Planets
                      </li>
                      <li>
                        <strong>3+</strong> Timezones or locations
                      </li>
                      <li>
                        <strong>Cross-Device</strong> Syncing
                      </li>
                    </ul>
                    <button
                      onClick={() =>
                        handleClick(item.attributes.store_id, "390766")
                      }
                    >
                      <a href="#" class="buy-now">
                        PROMOTE TO PRO
                      </a>
                    </button>
                  </div>
                </div>

                <div class="column">
                  <div class="pricing-card business">
                    <div class="pricing-header">
                      <span class="plan-title">FREE PLAN</span>
                      <div class="price-circle">
                        <span class="price-title">
                          <small>$</small>
                          <span>0.00</span>
                        </span>
                        <span class="info">/ Month</span>
                      </div>
                    </div>
                    <div class="badge-box">
                      <span>Save 5%</span>
                    </div>
                    <ul>
                      <li>
                        <strong>Unlimited</strong> Planets
                      </li>
                      <li>
                        <strong>Infinate</strong> Timezones or locations
                      </li>
                      <li>
                        <strong>Cross-Device</strong> Syncing
                      </li>
                    </ul>
                    <button>
                      <a href="#" class="buy-now">
                        CURRENT PLAN
                      </a>
                    </button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
