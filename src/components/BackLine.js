import React from "react";
import { useHistory, Link } from "react-router-dom";

function BackLine() {
  let history = useHistory();

  return (
    <div id="back-line">
      <div className="container-icon">
        <i onClick={history.goBack} className="fas fa-chevron-circle-left">
          {" "}
        </i>

        <Link to="/">
          <i className="fas fa-home"></i>
        </Link>
      </div>
    </div>
  );
}

export default BackLine;
