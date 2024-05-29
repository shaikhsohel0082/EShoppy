import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/home";
import ErrorPage from "./Error/error";
import SignIn from "./components/sign in/SignIn";
import { useState } from "react";
import Auth from "./components/sign in/Auth";
import Cart from "./components/Cart/Cart";
import MyOrder from "./components/MyOrders/MyOrders";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [CartItem, setCartItem] = useState([]);
  const [email, setEmail] = useState("");
  const [UserId, setUserId] = useState("");
  function ProtectedRoute({ children }) {
    if (!loggedIn) {
      return <ErrorPage />;
    }
    return children;
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Navbar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          name={name}
          setName={setName}
          CartItem={CartItem}
          setCartItem={setCartItem}
          email={email}
          setEmail={setEmail}
          UserId={UserId}
          setUserId={setUserId}
        />
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },

        { path: "/signin", element: <SignIn /> },
        {
          path: "/cart",
          element: (
            <ProtectedRoute>
              <Cart CartItem={CartItem} setCartItem={setCartItem} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myorders",
          element: (
            <ProtectedRoute>
              <MyOrder />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
