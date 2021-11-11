import React from "react";
import { Link } from "react-router-dom";
import Flickity from "react-flickity-component";

function MovieOfDays({ movieOfDays }) {
  const flickityOptions = {
    wrapAround: false,
    draggable: true,
    groupCells: 1,
    contain: true,
    initialIndex: 3,
  };

  return (
    <>
      <h4 className="title-movie-home">film della settimana</h4>
      <div className="movies-popular-day">
        <Flickity className="movie-carousel" options={flickityOptions} data>
          {movieOfDays &&
            movieOfDays.map((movie, i) => (
              <div key={"cm" + i} className="card-movie">
                <span className="title">{movie.title}</span>
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={"http://image.tmdb.org/t/p/w500" + movie.poster_path}
                    alt={movie.title}
                  ></img>
                  <div className="card-info">
                    <span className="card-popularity">{movie.popularity}</span>
                    <span className="card-vote">{movie.vote_average}</span>
                  </div>
                </Link>
              </div>
            ))}
        </Flickity>
      </div>
    </>
  );
}

export default MovieOfDays;
