import { useRouter } from "next/router";
import Footer from "../common/Footer";
import MainNavbar from "../common/MainNavbar";
import { useEffect } from "react";

function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token is found, redirect to login page
    if (!token) {
      router.push("/user/login"); // Redirect to the login page if the token is missing
    }
  }, [router]); // Re-run the effect if router changes

  return (
    <>
      <MainNavbar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
