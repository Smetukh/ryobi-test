import React from "react";
import media from "../../../assets";

export default function Header() {
  return (
    <div>
      <div className="App-header">
        <img src={media.logo} alt="Logo" />
        <h1> Custom Storage Builder </h1>
      </div>
    </div>
  );
}
