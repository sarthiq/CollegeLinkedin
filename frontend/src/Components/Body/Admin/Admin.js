import { Body } from "./Body/Body";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { useSelector } from "react-redux";
//import './Admin.css'

export const Admin = () => {
  const isLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <Body />
      <Footer isLoggedIn={isLoggedIn} />
    </>
  );
};
