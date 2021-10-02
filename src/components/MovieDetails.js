import React, { useEffect, useState } from "react";
import BackgroundHome from "./BackgroundHome";
import Header from "./Header";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const [movieDay, setMovieDay] = useState([]);
  const [directorMovie, setDirectorMovie] = useState({ id: "", name: "" });
  const [movieCast, setMovieCast] = useState([]);

  let { movie } = useParams();

  useEffect(() => {
    getDayMovies();
    getMovieCast();
  }, []);

  const getDayMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setMovieDay(data);
      });
  };

  const getMovieCast = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/credits?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const director = data.crew.filter(
          (curDirector) => curDirector.job === "Director"
        );

        if (director) {
          let obj = {
            id: director[0].id,
            name: director[0].name,
          };

          setDirectorMovie(obj);
        }
      });
  };

  const toggleOverview = (e) => {
    if (e.target.classList.contains("mobile")) {
      e.target.classList.toggle("mobile-drop");
    }
  };

  const toggleEnable = (e) => {
    e.target.classList.toggle("enable");
  };

  return (
    <div className="container-movie-details">
      <Header />
      <BackgroundHome
        backgroundImg={movieDay ? movieDay?.backdrop_path : ""}
        home={false}
      />
      <div className="container-details">
        <div className="info-movie">
          <div className="poster-movie">
            <img
              src={"http://image.tmdb.org/t/p/w500" + movieDay?.poster_path}
              alt={movieDay?.title}
            ></img>
          </div>
          <div className="description-movie">
            <div className="title-movie">
              <h2>
                {movieDay?.title}{" "}
                <span>({movieDay?.release_date?.substr(0, 4)})</span>
                <p>
                  Diretto da{" "}
                  <a className="link" href={"cast/" + directorMovie.id}>
                    {directorMovie.name}
                  </a>
                </p>
              </h2>
              <span className="link trailer">
                <a>
                  <i class="fab fa-youtube"></i> Trailer
                </a>
              </span>
            </div>
            <p className="mobile" onClick={(e) => toggleOverview(e)}>
              {movieDay?.overview}
            </p>
          </div>
          <div className="rating-movie">
            <div className="saving-movie">
              <i
                onClick={(e) => toggleEnable(e)}
                className="fas fa-heart enable"
              >
                <span>Mi Piace</span>
              </i>
              <i onClick={(e) => toggleEnable(e)} className="fas fa-eye enable">
                <span>Visto</span>
              </i>
              <i
                onClick={(e) => toggleEnable(e)}
                className="far fa-clock enable"
              >
                <span>Da Vedere</span>
              </i>
            </div>
            <div className="ratings">
              <h4>
                <span></span>
                <span>{movieDay?.vote_count} Voti</span>
              </h4>
              <p>
                {movieDay?.vote_average} <i className="fab fa-imdb"></i>
              </p>
            </div>
          </div>
        </div>
        <div className="cast-movie"></div>
      </div>
    </div>
  );
}

export default MovieDetails;
