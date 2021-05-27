import React from "react";
import Header from "./Header";

function DefaultPage({ children }) {
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );
}

export default DefaultPage;
