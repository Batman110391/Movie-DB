import React from "react";
import { Link } from "react-router-dom";
import Flickity from "react-flickity-component";

function UpcomingMovie({ upcomingMovie }) {
  const flickityOptions = {
    wrapAround: false,
    draggable: true,
    groupCells: 3,
    contain: true,
    initialIndex: 3,
  };

  return (
    <div className="upcoming">
      <h4 className="title-movie-home upcoming">prossimamente al cinema</h4>
      <div className="movies-popular-day">
        <Flickity
          className="movie-carousel upcoming"
          options={flickityOptions}
          data
        >
          {upcomingMovie &&
            upcomingMovie.map((movie, i) => {
              if (movie.poster_path) {
                return (
                  <div key={"cm" + i} className="card-movie upcoming">
                    <span className="title">{movie.title}</span>
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={
                          "http://image.tmdb.org/t/p/w500" + movie.poster_path
                        }
                        alt={movie.title}
                      ></img>
                    </Link>
                  </div>
                );
              }
            })}
        </Flickity>
      </div>
    </div>
  );
}

export default UpcomingMovie;
