import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";
export default function Navbar(props) {
  const {
    loggedIn,
    setLoggedIn,
    name,
    setName,
    CartItem,
    setCartItem,
    email,
    setEmail,
    UserId,
    setUserId,
  } = props;
  return (
    <>
      <div className={styles.nav}>
        <div className={styles.appName}>
          <NavLink to={"/"}>
            <p>
              <img
                className={styles.img}
                src="https://cdn-icons-png.flaticon.com/128/3081/3081648.png"
              />
              E-Shop
            </p>
          </NavLink>
        </div>
        <div className={styles.rightNav}>
          <div>
            <NavLink to={"/"}>
              <p>
                <img
                  className={styles.img}
                  src="https://cdn-icons-png.flaticon.com/128/9073/9073032.png"
                />
                Home
              </p>
            </NavLink>
          </div>
          {loggedIn && (
            <>
              <div>
                <NavLink to={'/myorders'}>
                  <p>
                    <img
                      className={styles.img}
                      src="https://cdn-icons-png.flaticon.com/128/15819/15819939.png"
                    />
                    My Orders
                  </p>
                </NavLink>
              </div>
              <div>
                <NavLink to={"/cart"}>
                  <p>
                    <img
                      className={styles.img}
                      src="https://cdn-icons-png.flaticon.com/128/4290/4290854.png"
                    />
                    Cart
                  </p>
                </NavLink>
              </div>
            </>
          )}
          <div>
            <NavLink to={"/signin"}>
              <p
                onClick={() => {
                  if (loggedIn) setLoggedIn(false);
                }}
              >
                <img
                  className={styles.img}
                  src={
                    !loggedIn
                      ? "https://cdn-icons-png.flaticon.com/128/10151/10151911.png"
                      : "https://cdn-icons-png.flaticon.com/128/10152/10152437.png"
                  }
                />
                {loggedIn ? "Sign Out" : "Sign In"}
              </p>
            </NavLink>
          </div>
        </div>
      </div>
      <Outlet
        context={{
          loggedIn,
          setLoggedIn,
          name,
          setName,
          CartItem,
          setCartItem,
          email,
          setEmail,
          UserId,
          setUserId,
        }}
      />
    </>
  );
}
