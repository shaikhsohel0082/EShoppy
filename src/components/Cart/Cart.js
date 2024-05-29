import db from "../../FirebaseInit";
import { useOutletContext } from "react-router-dom";
import {
  doc,
  onSnapshot,
  getDoc,
  arrayUnion,
  updateDoc,setDoc,query,collection,where,getDocs
} from "firebase/firestore";
import Styles from "../../../src/components/Home/home.module.css";
import CartStyles from "./cart.module.css";
import { useEffect, useState } from "react";

export default function Cart() {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { UserId, CartItem, setCartItem } = useOutletContext();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", UserId), (doc) => {
      // console.log("Current data: ", doc.data().cart);
      setData(doc.data().cart);

      // Calculate total amount
      let total = 0;
      doc.data().cart.forEach((item) => {
        total = item.price*item.qty + total;
      });
      setTotalAmount(total);
    });

    // Clean up subscription
    return () => unsub();
  }, [UserId]);
  async function findIndex(item) {
    const docRef = doc(db, "users", UserId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data().cart;
      const index = data.findIndex((i) => i.id === item.id);
      return index;
    } else {
      return -1; // Item not found in cart
    }
  }

  function handleAdd(item) {
    const index = data.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setCartItem((prev) => {
        const updatedCart = prev.map((cartItem, i) => {
          if (i === index) {
            return {
              ...cartItem,
              qty: cartItem.qty + 1,
              // price: cartItem.price + item.price,
            };
          } else {
            return cartItem;
          }
        });
        return updatedCart;
      });
      // setTotalAmount((prev) => prev + item.price);
    } else {
      return;
    }
  }
  function handleremove(item) {
    if (item.qty === 0) {
      return;
    }
    const index = data.findIndex((i) => i.id === item.id);
    console.log(index);
    if (index !== -1) {
      setCartItem((prev) => {
        const updatedCart = prev.map((cartItem, i) => {
          if (i === index) {
            return {
              ...cartItem,
              qty: cartItem.qty - 1,
              // price: cartItem.price - item.price,
            };
          } else {
            return cartItem;
          }
        });
        return updatedCart;
      });
      // setTotalAmount((prev) => prev - item.price);
    } else {
      return;
    }
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


  return (
    <>
      <div className={CartStyles.totalDiv}>
        Total Amount to be Paid: &#8377; {totalAmount}
      </div>
      <div className={Styles.cardContainer}>
        {data.map((item, index) => (
          <div key={index} className={Styles.card}>
            <div>
              <img className={Styles.img} src={item.image} alt={item.desc} />
            </div>
            <div>
              <p className={Styles.description}>
                {item.desc.length > 25
                  ? [
                      item.desc.slice(0, 25) + "-",
                      <br key={index + "-br"} />,
                      item.desc.slice(25, 50) + "....",
                    ]
                  : item.desc}
              </p>
            </div>
            <div>
              <h2 className={Styles.price}>&#8377; {item.price}</h2>
            </div>
            <div className={CartStyles.qty}>
              <span
                className={CartStyles.symbol}
                onClick={() => handleremove(item)}
              >
                -
              </span>
              &nbsp;{item.qty}&nbsp;
              <span
                className={CartStyles.symbol}
                onClick={() => handleAdd(item)}
              >
                +
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
