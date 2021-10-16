import React from "react";
import { Link } from "react-router-dom";

function BackLine() {
  return (
    <div className="back-line">
      <Link to="/">
        <i className="fas fa-chevron-circle-left"></i>
      </Link>
    </div>
  );
}

export default BackLine;
