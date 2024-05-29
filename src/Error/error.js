import styles from "./error.module.css";
import { Link } from "react-router-dom";
export default function ErrorPage() {
  return (
    <>
      <div className={styles.error}>
        <h1 className={styles.h1}>404 Error</h1>
        <Link to={"/"}>
          <img src="https://cdn-icons-png.flaticon.com/128/1304/1304037.png"></img>
        </Link>
        <h2 className={styles.h2}>Page Not Found</h2>
        <p className={styles.p}>Please Contact Administrator</p>
      </div>
    </>
  );
}
