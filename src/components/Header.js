import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [movieSearch, setMovieSearch] = useState([]);

  const searchMovie = (e) => {
    getMovieKeywords(e.target.value);
  };

  const getMovieKeywords = (keywords, page = 1) => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT&query=${keywords}&page=${page}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setMovieSearch(data.results);
      });
  };

  return (
    <>
      <div className="navigation">
        <div className="logo">
          <h1>Movie Db</h1>
        </div>
        <div className="nav-movie">
          <div>films</div>
          <div>sign in</div>
        </div>
        <div className="search">
          <form
            id="search-form"
            action="/search"
            method="get"
            autoCorrect="off"
          >
            <input
              type="text"
              onKeyUp={(e) => searchMovie(e)}
              name="q"
              autoComplete="false"
              spellCheck="false"
              className="search-input"
              inputMode="search"
            ></input>
            <input className="search-submit" type="submit"></input>
            <span></span>
          </form>
        </div>
      </div>
      <div className="container-movie-search">
        {movieSearch?.map((curMovie, i) => (
          <div className="movie-search">
            <img
              src={"http://image.tmdb.org/t/p/w500" + curMovie?.poster_path}
              alt={curMovie?.title}
            ></img>
            <h2>
              {curMovie?.title}{" "}
              <span>({curMovie?.release_date?.substr(0, 4)})</span>
            </h2>
          </div>
        ))}
      </div>
    </>
  );
}

export default Header;
