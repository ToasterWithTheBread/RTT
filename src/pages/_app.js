import "../styles/globals.css";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [csr, setCSR] = useState(false);

  useEffect(() => {
    setCSR(typeof window !== "undefined");
  }, []);

  return csr ? <Component {...pageProps} /> : null;
}

export default MyApp;