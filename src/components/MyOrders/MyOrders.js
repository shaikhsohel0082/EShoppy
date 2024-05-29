import Styles from "./MyOrders.module.css";
import db from "../../FirebaseInit";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
export default function MyOrder() {
  const { UserId } = useOutletContext();
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", UserId), (doc) => {
      console.log("Current data: ", doc.data().cart);
      setData(doc.data().cart);

      // Calculate total amount
      let total = 0;
      doc.data().cart.forEach((item) => {
        total += item.price * item.qty;
      });
      setTotalAmount(total);
    });

    // Clean up subscription
    return () => unsub();
  }, []);

  return (
    <>
      <div className={Styles.table}>
        <table border={3}>
          <caption className={Styles.caption}>My Orders</caption>
          <tr>
            <th>Order Id</th>
            <th>OrderDetails</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
          {data.map((item) => {
            if (item.qty === 0) return null;

            return (
              <tr>
                <td>{item.id}</td>
                <td>{item.desc}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
              </tr>
            );
          })}
          <tr className={Styles.total}>
            <td colSpan={4}> Total Amount : {totalAmount}</td>
          </tr>
        </table>
      </div>
    </>
  );
}
