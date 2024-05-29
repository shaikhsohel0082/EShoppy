import { useState, createRef, useEffect } from "react";
import Styles from "./signIn.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  setDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import db from "../../FirebaseInit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setUserId } from "firebase/analytics";
export default function SignIn() {
  const [passVisible, setPassVisible] = useState(false);
  const [signInpage, setSignInPage] = useState(false);

  const {
    setLoggedIn,
    loggedIn,
    name,
    setName,
    email,
    setEmail,
    setUserId,
    UserId,
  } = useOutletContext();

  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  //if user is logged in go to home
  useEffect(() => {
    setTimeout(() => {
      if (loggedIn) {
        navigate("/");
      }
    }, 3000);
  });
  function handleSubmit(e) {
    e.preventDefault();
    setUserId(email);
    setName("");
    setEmail("");
    setPassword("");
    // if (!signInpage) {
    //   if (handleSignUp(newuser)) {
    //     console.log("User Already Registered");
    //     toast.warn("User Already Registered");
    //   } else {
    //     setUsers([...users, newuser]);
    //     setSignInPage(!signInpage);
    //   }
    // }
    // if (signInpage) {
    //   if (handleSignIn(newuser)) {
    //     console.log("Sign In Successful");
    //     toast.success("Sign In Successful");
    //     setLoggedIn(true);
    //   } else {
    //     console.log("Sign In Failed");
    //     toast.error("Sign In Failed");
    //   }
    // }

    if (signInpage) {
      handleSignIn();
    } else {
      handleSignUp();
      setSignInPage(!signInpage);
    }
  }
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await addUserToDB(email); // Pass the UID of the current user to addUserToDB
        console.log("User signed up successfully!");
        toast.success("User signed up successfully!");
      } else {
        throw new Error("User not found after sign-up.");
      }
    } catch (error) {
      setError(error.message);
      toast.warn(error.message);
      console.log(error.message);
    }
  };

  async function addUserToDB(userId) {
    // Check if the user already exists in the database
    if (!userId) {
      return;
    }
    const userQuery = query(
      collection(db, "users"),
      where("user", "==", userId)
    );
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.empty) {
      // User does not exist, so add them to the database
      await setDoc(doc(db, "users", userId), {
        cart: [],
      });
      console.log("User signed up to the database.");
    } else {
      console.log("User already exists in the database.");
    }
  }
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully!");
      toast.success("User signed in successfully!");
      setLoggedIn(true);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={Styles.formContainer}>
          <h1>{signInpage ? "Sign In" : "Sign Up"}</h1>

          <div className={Styles.formElement}>
            <span className={Styles.icon}>
              <i class="fa-solid fa-user"></i>
            </span>
            <input
              value={name}
              className={Styles.input}
              type="text"
              placeholder="User Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={Styles.formElement}>
            <span className={Styles.icon}>
              <i class="fa-solid fa-envelope"></i>
            </span>
            <input
              value={email}
              className={Styles.input}
              type="email"
              placeholder="Email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className={Styles.pass}>
            <span className={Styles.icon}>
              <i class="fa-solid fa-lock"></i>
            </span>
            <input
              value={password}
              className={Styles.input}
              type={passVisible ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className={Styles.eye}
              onClick={() => setPassVisible(!passVisible)}
            >
              {passVisible ? (
                <i class="fa-solid fa-eye"></i>
              ) : (
                <i class="fa-solid fa-eye-slash"></i>
              )}
            </span>
          </div>
          <div className={Styles.formElement}>
            <button className={Styles.btn} type="submit">
              {signInpage ? "Sign In" : "Sign Up"}
            </button>
            {/* Setting Toast Container */}
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
          <h3 className={Styles.h2} onClick={() => setSignInPage(!signInpage)}>
            {signInpage ? "Don't have an account?" : "Already have an account?"}
          </h3>
        </div>
      </form>
    </>
  );
}
