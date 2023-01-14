import React, { useEffect, useState } from "react";
import BackgroundHome from "./BackgroundHome";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BackLine from "./BackLine";
import Skeleton from "@mui/material/Skeleton";

import { useSelector, useDispatch } from "react-redux";
import { favorite, watchlist, watch } from "../features/utent";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

function MovieDetails() {
  const [movieDay, setMovieDay] = useState([]);
  const [similarMovie, setSimilarMovie] = useState([]);
  const [reviewMovie, setReviewMovie] = useState([]);
  const [directorMovie, setDirectorMovie] = useState({ id: "", name: "" });
  const [movieCast, setMovieCast] = useState([]);
  const [movieCrew, setMovieCrew] = useState([]);
  const [watchProvider, setWatchProvider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({});
  const [frame, setFrame] = useState("");

  const stateRedux = useSelector((state) => state.utent);
  const dispatch = useDispatch();
  const db = firebase.firestore();

  let { movie } = useParams();

  useEffect(() => {
    setState(stateRedux);
  }, [stateRedux]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      await getDayMovies();
      await getMovieCast();
      await getSimilarMovies();
      await getReviewMovies();
      await getWatchProviders();
      await getFrameMovie();
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [movie]);

  const getSimilarMovies = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/similar?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setSimilarMovie(data.results);
      });
  };

  const getReviewMovies = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/reviews?api_key=${process.env.REACT_APP_SECRET_CODE}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setReviewMovie(data.results);
      });
  };

  const getDayMovies = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setMovieDay(data);
      });
  };

  const getWatchProviders = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/watch/providers?api_key=${process.env.REACT_APP_SECRET_CODE}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        var _watch_providers = [];
        if (data?.results?.IT?.flatrate) {
          data.results.IT.flatrate.forEach((e) => _watch_providers.push(e));
          _watch_providers.push(data.results.IT.link);
        }
        setWatchProvider(_watch_providers);
      });
  };

  const getMovieCast = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/credits?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const director = data?.crew?.filter(
          (curDirector) => curDirector.job === "Director"
        );

        const cast = [];
        const crew = [];

        data.cast.forEach((curCast, i) => {
          if (i < 20) {
            cast.push(createObject(curCast));
          }
        });

        data.crew.forEach((curCrew, i) => {
          if (i < 20) {
            crew.push(createObject(curCrew));
          }
        });

        function createObject(curCast) {
          let person = {
            character: curCast?.character,
            job: curCast?.job,
            name: curCast?.name,
            id: curCast?.id,
            img: curCast?.profile_path,
          };

          return person;
        }

        if (cast) {
          setMovieCast(cast);
        }
        if (crew) {
          setMovieCrew(crew);
        }

        if (director) {
          let obj = {
            id: director[0]?.id,
            name: director[0]?.name,
          };

          setDirectorMovie(obj);
        }
      });
  };

  const getFrameMovie = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/videos?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((frame) => {
        if (!(frame.results.length === 0)) {
          var key_code = frame.results[0].key;
          setFrame("https://www.youtube.com/embed/" + key_code + "?rel=0");
        }
      });
  };

  const toggleOverview = (e) => {
    if (e.target.classList.contains("mobile")) {
      e.target.classList.toggle("mobile-drop");
    }
  };

  const toggleEnable = async (e, metod) => {
    if (state.isSignedIn) {
      if (metod == "S") {
        if (!searchId("S", movie)) {
          db.collection("Utenti")
            .doc(state.email)
            .update({
              favorite: firebase.firestore.FieldValue.arrayUnion(movie),
            });

          const result = await getMovieDb();
          if (result) {
            dispatch(favorite(result.favorite));
          }
        } else {
          db.collection("Utenti")
            .doc(state.email)
            .update({
              favorite: firebase.firestore.FieldValue.arrayRemove(movie),
            });

          const result = await getMovieDb();
          if (result) {
            dispatch(favorite(result.favorite));
          }
        }
      } else if (metod == "W") {
        if (!searchId("W", movie)) {
          db.collection("Utenti")
            .doc(state.email)
            .update({
              watch: firebase.firestore.FieldValue.arrayUnion(movie),
            });

          const result = await getMovieDb();
          if (result) {
            dispatch(watch(result.watch));
          }
        } else {
          db.collection("Utenti")
            .doc(state.email)
            .update({
              watch: firebase.firestore.FieldValue.arrayRemove(movie),
            });

          const result = await getMovieDb();
          if (result) {
            dispatch(watch(result.watch));
          }
        }
      } else if (metod == "Wl") {
        if (!searchId("Wl", movie)) {
          db.collection("Utenti")
            .doc(state.email)
            .update({
              watchlist: firebase.firestore.FieldValue.arrayUnion(movie),
            });

          const result = await getMovieDb();
          if (result) {
            dispatch(watchlist(result.watchlist));
          }
        } else {
          db.collection("Utenti")
            .doc(state.email)
            .update({
              watchlist: firebase.firestore.FieldValue.arrayRemove(movie),
            });

          const result = await getMovieDb();
          if (result) {
            dispatch(watchlist(result.watchlist));
          }
        }
      }
    }
  };

  const getMovieDb = async () => {
    const data = await db.collection("Utenti").doc(state.email).get();
    const result = data.data();

    return result;
  };

  const toggleAccordion = (e, type) => {
    document.querySelectorAll(".accordion button").forEach((target) => {
      if (e.target === target) {
        target.classList.add("open-accordion");
      } else {
        target.classList.remove("open-accordion");
      }

      if (type === "cast") {
        document.querySelector(".cast").classList.add("open");
        document.querySelector(".crew").classList.remove("open");
        document.querySelector(".film-simili").classList.remove("open");
        document.querySelector(".recensioni").classList.remove("open");
      } else if (type === "crew") {
        document.querySelector(".cast").classList.remove("open");
        document.querySelector(".crew").classList.add("open");
        document.querySelector(".film-simili").classList.remove("open");
        document.querySelector(".recensioni").classList.remove("open");
      } else if (type === "film simili") {
        document.querySelector(".cast").classList.remove("open");
        document.querySelector(".crew").classList.remove("open");
        document.querySelector(".film-simili").classList.add("open");
        document.querySelector(".recensioni").classList.remove("open");
      } else if (type === "recensioni") {
        document.querySelector(".cast").classList.remove("open");
        document.querySelector(".crew").classList.remove("open");
        document.querySelector(".film-simili").classList.remove("open");
        document.querySelector(".recensioni").classList.add("open");
      }
    });
  };

  const searchId = (type, id) => {
    var bool = false;

    if (type === "S") {
      state.favorite.forEach((ele) => {
        if (id == ele) {
          bool = true;
        }
      });
    } else if (type === "W") {
      state.watch.forEach((ele) => {
        if (id == ele) {
          bool = true;
        }
      });
    } else if (type === "Wl") {
      state.watchlist.forEach((ele) => {
        if (id == ele) {
          bool = true;
        }
      });
    }

    return bool;
  };

  return (
    <div className="container-movie-details">
      <div className="lightbox-target" id="poster-movie-bg">
        <div className="box-bg-large-movie">
          <img
            src={
              movieDay?.poster_path
                ? "http://image.tmdb.org/t/p/w500" + movieDay?.poster_path
                : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
            }
            alt={movieDay?.title}
          />
        </div>
        <a className="lightbox-close" href="#"></a>
      </div>

      {!loading ? (
        <>
          <BackgroundHome
            backgroundImg={movieDay ? movieDay?.backdrop_path : ""}
            home={false}
          />
          <div className="container-details">
            <div className="info-movie">
              <div className="box-poster">
                <div className="poster-movie">
                  <a href="#poster-movie-bg">
                    <img
                      src={
                        movieDay?.poster_path
                          ? "http://image.tmdb.org/t/p/w500" +
                            movieDay?.poster_path
                          : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
                      }
                      alt={movieDay?.title}
                    ></img>
                  </a>
                </div>
              </div>
              <div className="description-movie">
                <div className="title-movie">
                  <h2>
                    {movieDay?.title}{" "}
                    <span>({movieDay?.release_date?.substr(0, 4)})</span>
                    <p>
                      <span>Diretto da</span>
                      <Link className="link" to={`/person/${directorMovie.id}`}>
                        {directorMovie.name}
                      </Link>
                    </p>
                  </h2>
                  <span className="link trailer">
                    <a href={frame} target="_blank">
                      <i className="fab fa-youtube"></i> Trailer
                    </a>
                  </span>
                </div>
                <p className="mobile" onClick={(e) => toggleOverview(e)}>
                  {movieDay?.overview}
                  <span className="blur"></span>
                </p>
              </div>
              <div
                className={
                  state?.isSignedIn ? "rating-movie" : "rating-movie signed"
                }
              >
                <div className="popover">
                  registrati per aggiungere i tuoi libri preferiti
                </div>
                <div className="saving-movie">
                  <i
                    onClick={(e) => toggleEnable(e, "S")}
                    className={
                      searchId("S", movie)
                        ? "fas fa-heart"
                        : "fas fa-heart enable"
                    }
                  >
                    <span>Mi Piace</span>
                  </i>
                  <i
                    onClick={(e) => toggleEnable(e, "W")}
                    className={
                      searchId("W", movie) ? "fas fa-eye" : "fas fa-eye enable"
                    }
                  >
                    <span>Visto</span>
                  </i>
                  <i
                    onClick={(e) => toggleEnable(e, "Wl")}
                    className={
                      searchId("Wl", movie)
                        ? "far fa-clock"
                        : "far fa-clock enable"
                    }
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
                    {movieDay?.vote_average} / 10{" "}
                    <i className="fab fa-imdb"></i>
                  </p>
                </div>
              </div>
            </div>
            <div className="watch-providers">
              {watchProvider?.map((watch, i) => {
                if (watch.logo_path && watchProvider[2]) {
                  return (
                    <a
                      key={i + "watchprovider"}
                      href={watchProvider[2] ? watchProvider[2] : ""}
                      target="_blank"
                    >
                      <img
                        src={
                          "http://image.tmdb.org/t/p/w500" + watch?.logo_path
                        }
                        alt={watch?.provider_name}
                      ></img>
                    </a>
                  );
                }
              })}
            </div>
            <div className="accordion">
              <button
                className="current-accordion open-accordion"
                onClick={(e) => toggleAccordion(e, "cast")}
              >
                cast
              </button>
              <button
                className="current-accordion"
                onClick={(e) => toggleAccordion(e, "crew")}
              >
                crew
              </button>
              <button
                className="current-accordion"
                onClick={(e) => toggleAccordion(e, "film simili")}
              >
                film simili
              </button>
              <button
                className="current-accordion"
                onClick={(e) => toggleAccordion(e, "recensioni")}
              >
                recensioni
              </button>
            </div>
            <div className="cast-movie cast open">
              <div className="box-accordion">
                {movieCast.map((curPerson, i) => (
                  <Link to={`/person/${curPerson.id}`} key={i + "castmovie"}>
                    <div className="person">
                      <img
                        src={
                          curPerson.img
                            ? "http://image.tmdb.org/t/p/w500" + curPerson.img
                            : "https://www.cdcvillamaria.it/wp-content/uploads/2016/09/default-user-image.png"
                        }
                      ></img>
                      <div>
                        <span className="name-person">{curPerson?.name}</span>
                        <span>{curPerson?.character}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="cast-movie crew">
              <div className="box-accordion">
                {movieCrew.map((curPerson, i) => (
                  <Link to={`/person/${curPerson.id}`} key={i + "castmovie2"}>
                    <div className="person">
                      <img
                        src={
                          curPerson.img
                            ? "http://image.tmdb.org/t/p/w500" + curPerson.img
                            : "https://www.cdcvillamaria.it/wp-content/uploads/2016/09/default-user-image.png"
                        }
                      ></img>
                      <div>
                        <span className="name-person">{curPerson?.name}</span>
                        <span>{curPerson?.job}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="other-movie film-simili">
              {similarMovie.map((curMovie, i) => {
                if (i < 6) {
                  return (
                    <Link to={`/movie/${curMovie.id}`} key={i + "similar"}>
                      <div className="movie">
                        <img
                          src={
                            "http://image.tmdb.org/t/p/w500" +
                            curMovie?.poster_path
                          }
                        ></img>
                        <span>{curMovie?.title}</span>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
            <div className="other-movie recensioni">
              <div className="box-accordion">
                {reviewMovie.map((curReview, i) => (
                  <div className="review-user" key={i + "rece"}>
                    <div className="avatar-user">
                      <img
                        src={
                          curReview.author_details.avatar_path &&
                          curReview.author_details.avatar_path?.includes("http")
                            ? curReview.author_details.avatar_path?.substr(1)
                            : "https://www.cdcvillamaria.it/wp-content/uploads/2016/09/default-user-image.png"
                        }
                      ></img>
                      <span>{curReview?.author}</span>
                      <span>{curReview?.created_at?.substr(0, 10)}</span>
                    </div>
                    <div className="review-content">
                      <p className="mobile" onClick={(e) => toggleOverview(e)}>
                        {curReview?.content}
                        <span className="blur"></span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Skeleton
            width="100%"
            height="300px"
            style={{ backgroundColor: "gray" }}
          />
          <div className="d-flex" style={{ marginTop: "-80px" }}>
            <Skeleton
              width="50%"
              height="300px"
              style={{ marginRight: "10px", backgroundColor: "gray" }}
            />
            <Skeleton
              width="50%"
              height="300px"
              style={{ backgroundColor: "gray" }}
            />
          </div>
          <Skeleton style={{ backgroundColor: "gray" }} />
          <Skeleton style={{ backgroundColor: "gray" }} />
          <Skeleton style={{ backgroundColor: "gray" }} />
          <Skeleton style={{ backgroundColor: "gray" }} />
          <Skeleton height="200px" style={{ backgroundColor: "gray" }} />
        </>
      )}
    </div>
  );
}

export default MovieDetails;
