import { PropsWithChildren } from "react";
import Meta from "./Meta";
import Navbar from "./Navbar";

const BasePage = (props: PropsWithChildren) => {
  return (
    <>
      <Meta />
      <Navbar />
      {props.children}
    </>
  );
};

export default BasePage;
