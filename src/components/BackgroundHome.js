import React from "react";

function BackgroundHome({ backgroundImg, home }) {
  return (
    <div className="backdrop-container">
      <div className="backdrop">
        <img
          className="backdrop-img"
          src={"http://image.tmdb.org/t/p/original" + backgroundImg}
        ></img>
      </div>
      {home && (
        <div className="title-info">
          Tieni traccia dei film che hai guardato.
          <br /> Scopri di più sui tuoi film preferiti.
          <br />
          Trova il film che fa per te.
        </div>
      )}
    </div>
  );
}

export default BackgroundHome;
