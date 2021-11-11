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

  const state = useSelector((state) => state.utent);
  const dispatch = useDispatch();

  let { movie } = useParams();

  useEffect(() => {
    setLoading(true);

    getDayMovies();
    getMovieCast();
    getSimilarMovies();
    getReviewMovies();
    getWatchProviders();

    setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 100);
  }, [movie]);

  const getSimilarMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/similar?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setSimilarMovie(data.results);
      });
  };

  const getReviewMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/reviews?api_key=${process.env.REACT_APP_SECRET_CODE}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setReviewMovie(data.results);
      });
  };

  const getDayMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setMovieDay(data);
      });
  };

  const getWatchProviders = () => {
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

  const getMovieCast = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie}/credits?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const director = data.crew.filter(
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

  const toggleOverview = (e) => {
    if (e.target.classList.contains("mobile")) {
      e.target.classList.toggle("mobile-drop");
    }
  };

  const toggleEnable = async (e, metod) => {
    const db = firebase.firestore();
    if (metod == "S") {
      if (e.target.classList.contains("enable")) {
        db.collection("Utenti")
          .doc(state.email)
          .update({
            favorite: firebase.firestore.FieldValue.arrayUnion(movie),
          });

        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        console.log(result);
        if (result) {
          dispatch(favorite(result.favorite));
        }
      } else {
        db.collection("Utenti")
          .doc(state.email)
          .update({
            favorite: firebase.firestore.FieldValue.arrayRemove(movie),
          });

        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        if (result) {
          dispatch(favorite(result.favorite));
        }
      }
    } else if (metod == "W") {
      if (e.target.classList.contains("enable")) {
        db.collection("Utenti")
          .doc(state.email)
          .update({
            watch: firebase.firestore.FieldValue.arrayUnion(movie),
          });

        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        console.log(result);
        if (result) {
          dispatch(watch(result.watch));
        }
      } else {
        db.collection("Utenti")
          .doc(state.email)
          .update({
            watch: firebase.firestore.FieldValue.arrayRemove(movie),
          });

        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        if (result) {
          dispatch(watch(result.watch));
        }
      }
    } else if (metod == "Wl") {
      if (e.target.classList.contains("enable")) {
        db.collection("Utenti")
          .doc(state.email)
          .update({
            watchlist: firebase.firestore.FieldValue.arrayUnion(movie),
          });

        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        console.log(result);
        if (result) {
          dispatch(favorite(result.watchlist));
        }
      } else {
        db.collection("Utenti")
          .doc(state.email)
          .update({
            watchlist: firebase.firestore.FieldValue.arrayRemove(movie),
          });

        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        if (result) {
          dispatch(watchlist(result.watchlist));
        }
      }
    }

    e.target.classList.toggle("enable");
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

    if (type == "S") {
      state.favorite.forEach((ele) => {
        if (id == ele) {
          bool = true;
        }
      });
    } else if (type == "W") {
      state.watch.forEach((ele) => {
        if (id == ele) {
          bool = true;
        }
      });
    } else if (type == "Wl") {
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
      <BackLine />
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
                  <img
                    src={
                      movieDay?.poster_path
                        ? "http://image.tmdb.org/t/p/w500" +
                          movieDay?.poster_path
                        : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
                    }
                    alt={movieDay?.title}
                  ></img>
                  <div className="watch-providers">
                    {watchProvider?.map((watch) => {
                      if (watch.logo_path && watchProvider[2]) {
                        return (
                          <a
                            href={watchProvider[2] ? watchProvider[2] : ""}
                            target="_blank"
                          >
                            <img
                              src={
                                "http://image.tmdb.org/t/p/w500" +
                                watch?.logo_path
                              }
                              alt={watch?.provider_name}
                            ></img>
                          </a>
                        );
                      }
                    })}
                  </div>
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
                    <a>
                      <i className="fab fa-youtube"></i> Trailer
                    </a>
                  </span>
                </div>
                <p className="mobile" onClick={(e) => toggleOverview(e)}>
                  {movieDay?.overview}
                  <span className="blur"></span>
                </p>
              </div>
              <div className="rating-movie">
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
                {movieCast.map((curPerson) => (
                  <Link to={`/person/${curPerson.id}`}>
                    <div className="person">
                      <img
                        src={
                          curPerson.img
                            ? "http://image.tmdb.org/t/p/w500" + curPerson.img
                            : "data:image/jpeg;base64,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"
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
                {movieCrew.map((curPerson) => (
                  <Link to={`/person/${curPerson.id}`}>
                    <div className="person">
                      <img
                        src={
                          curPerson.img
                            ? "http://image.tmdb.org/t/p/w500" + curPerson.img
                            : "data:image/jpeg;base64,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"
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
                    <Link to={`/movie/${curMovie.id}`}>
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
                  <div className="review-user">
                    <div className="avatar-user">
                      <img
                        src={
                          curReview.author_details.avatar_path
                            ? curReview.author_details.avatar_path?.substr(1)
                            : "data:image/jpeg;base64,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"
                        }
                      ></img>
                      <span>{curReview?.author}</span>
                      <span>{curReview?.created_at?.substr(0, 10)}</span>
                    </div>
                    <div className="review-content">
                      <p>{curReview?.content}</p>
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
