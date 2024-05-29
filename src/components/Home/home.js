import Styles from "./home.module.css";
import ReactSlider from "react-slider";
import { productData } from "../../Data/data";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  onSnapshot,
  where,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import db from "../../FirebaseInit";
import { useEffect } from "react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import userEvent from "@testing-library/user-event";

export default function Home() {
  const { CartItem, setCartItem, UserId, loggedIn } = useOutletContext();
  const [dataAdded, setdataAdded] = useState(false);
  const [Data, setData] = useState([]);
  const [checked, setChecked] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const isDataAdded = localStorage.getItem("dataAdded");
    console.log(isDataAdded);
    if (!isDataAdded) {
      async function addDataToDB() {
        await addDoc(collection(db, "products"), {
          productData,
        });
      }
      setdataAdded(true);
      localStorage.setItem("dataAdded", true);
      addDataToDB();
    }
  }, []);
  useEffect(() => {
    async function getDataFromDB() {
      const docRef = doc(db, "products", "SqwjdhAlNFfYApqz4jhm");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data().productData);
        setData(docSnap.data().productData);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    getDataFromDB();
  }, []);

  async function AddToCart(item) {
    //navigate to sign in page if user is not logged in
    // console.log(loggedIn);
    if (!loggedIn) {
      navigate("/signin");
      return;
    }

    const index = CartItem.findIndex((i) => i.id === item.id);
    if (index === -1) {
      setCartItem((prev) => [
        ...prev,
        {
          id: item.id,
          qty: 1,
          price: item.price,
          image: item.image,
          desc: item.desc,
        },
      ]);
      // console.log(CartItem);
    } else {
      setCartItem((prev) => {
        const updatedCart = prev.map((cartItem, i) => {
          if (i === index) {
            return {
              ...cartItem,
              qty: cartItem.qty + 1,
              price: cartItem.price + item.price,
            };
          }
          return cartItem;
        });
        return updatedCart;
      });
      toast.success("Item added to cart");
      // console.log(CartItem);
    }

    // Wait for the state to update before proceeding
  }
  useEffect(() => {
    const fetchData = async () => {
      if (UserId === "") {
        return;
      }
      // Delay execution to ensure other state updates are completed
      await new Promise((resolve) => setTimeout(resolve, 0));

      const userQuery = query(
        collection(db, "users"),
        where("user", "==", UserId)
      );
      // console.log(userQuery);

      const querySnapshot = await getDocs(userQuery);
      // console.log(querySnapshot);

      if (querySnapshot.empty) {
        await setDoc(doc(db, "users", UserId), {
          cart: [...CartItem],
        });
        console.log("Item added to cart");
      }
    };

    fetchData(); // Call the async function
  }, [CartItem]);

  function checkboxFilter(e) {
    const updatedChecked = e.target.checked
      ? [...checked, e.target.value]
      : checked.filter((item) => item !== e.target.value);

    setChecked(updatedChecked);
  }
  const newData = Data.filter((item) => checked.includes(item.category));
  const CheckBox = newData.map((item) => (
    <div key={item.id} className={Styles.card}>
      <div>
        <img className={Styles.img} src={item.image} alt={item.desc} />
      </div>
      <div>
        <p className={Styles.description}>
          {item.desc && item.desc.length > 25 ? (
            <>
              {item.desc.slice(0, 25)}-
              <br />
              {item.desc.slice(25, 50)}....
            </>
          ) : (
            item.desc
          )}
        </p>
      </div>
      <div>
        <h2 className={Styles.price}>&#8377; {item.price}</h2>
      </div>
      <div>
        <button
          className={Styles.btn}
          onClick={() => {
            AddToCart(item);
          }}
        >
          Add To Cart
        </button>
      </div>
      {/* Setting Toast Container */}
    </div>
  ));

  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.filterDiv}>
          <h1>Filter</h1>
          <hr />
          <h3>Price</h3>
          <select
            className={Styles.select}
            onChange={(e) => {
              let price = e.target.value;
              let min = price.split("To")[0];
              let max = price.split("To")[1];
              if (min.includes("Below")) {
                max = min.split(" ")[1];
                min = 0;
              } else if (min.includes("Above")) {
                min = min.split(" ")[1];
                max = Number(min) * 100;
              } else if (min.includes("select")) {
                setData(productData);
                return;
              }
              const newData = productData.filter((item) => {
                if (item.price >= Number(min) && item.price <= Number(max))
                  return item;
              });
              console.log(min, max);
              setData(newData);
            }}
          >
            <option>select</option>
            <option>Below 100</option>
            <option>101 To 300</option>
            <option>301 To 700</option>
            <option>701 To 1000</option>
            <option>1001 To 2000</option>
            <option>2001 To 5000</option>
            <option>5001 To 50000</option>
            <option>50001 To 100000</option>
            <option>Above 100000</option>
          </select>

          <hr />
          <h2>Category</h2>
          <div className={Styles.checkBox}>
            <input
              type="checkbox"
              value={"Mens Wear"}
              onChange={(e) => {
                checkboxFilter(e);
              }}
            />
            &ensp;<label>Mens Wear</label>
          </div>
          <br />
          <br />
          <div className={Styles.checkBox}>
            <input
              type="checkbox"
              value={"Womens Wear"}
              onChange={(e) => {
                checkboxFilter(e);
              }}
            />
            &ensp;<label>Womens Wear</label>
          </div>
          <br />
          <br />
          <div className={Styles.checkBox}>
            <input
              type="checkbox"
              value={"Ornaments"}
              onChange={(e) => {
                checkboxFilter(e);
              }}
            />
            &ensp;<label>Ornaments</label>
          </div>
          <br />
          <br />
          <div className={Styles.checkBox}>
            <input
              type="checkbox"
              value={"Electronics"}
              onChange={(e) => {
                checkboxFilter(e);
              }}
            />
            &ensp;<label>Electronics</label>
          </div>
          <br />
          <br />
          <div className={Styles.checkBox}>
            <input
              type="checkbox"
              value={"Kitchen"}
              onChange={(e) => {
                checkboxFilter(e);
              }}
            />
            &ensp;<label>Kitchen</label>
          </div>
        </div>
        <div className={Styles.productDiv}>
          <input
            className={Styles.input}
            placeholder="Search By Name"
            onChange={(e) => {
              setData(
                productData.filter((item) => {
                  return item.desc
                    .toString()
                    .toLowerCase()
                    .includes(e.target.value);
                })
              );
            }}
          />

          <div className={Styles.cardContainer}>
            {checked.length === 0
              ? Data.map((item) => (
                  <>
                    <div className={Styles.card}>
                      <div>
                        <img className={Styles.img} src={item.image} />
                      </div>
                      <div>
                        <p className={Styles.description}>
                          {" "}
                          {item.desc.length > 25
                            ? [
                                item.desc.slice(0, 25) + "-",
                                <br />,
                                item.desc.slice(25, 50) + "....",
                              ]
                            : item.desc}
                        </p>
                      </div>
                      <div>
                        <h2 className={Styles.price}>&#8377; {item.price}</h2>
                      </div>
                      <div>
                        <button
                          className={Styles.btn}
                          onClick={() => {
                            AddToCart(item);
                          }}
                        >
                          Add To Cart
                        </button>
                      </div>
                      {/* Setting Toast Container */}
                      <ToastContainer
                        position="bottom-right"
                        autoClose={1000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        theme="light"
                      />
                    </div>
                  </>
                ))
              : CheckBox}
          </div>
        </div>
      </div>
    </>
  );
}
