import React from "react";

function Header() {
  return (
    <div className="navigation">
      <div className="logo">
        <h1>Movie Db</h1>
      </div>
      <div className="nav-movie">
        <div>films</div>
        <div>sign in</div>
      </div>
      <div className="search">
        <form id="search-form" action="/search" method="get" autoCorrect="off">
          <input
            type="text"
            name="q"
            className="search-input"
            inputMode="search"
          ></input>
          <input className="search-submit" type="submit"></input>
          <span></span>
        </form>
      </div>
    </div>
  );
}

export default Header;
