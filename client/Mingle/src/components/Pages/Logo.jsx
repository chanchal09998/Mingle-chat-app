import React from "react";
import Mingle from "../../assets/mingle.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={Mingle} alt="Mingle Logo" className="logo-image" />
      <div className="logo-name">Mingle</div>
    </div>
  );
};

export default Logo;
