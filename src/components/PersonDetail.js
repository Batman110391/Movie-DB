import React, { useEffect, useState } from "react";
import BackLine from "./BackLine";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";

function PersonDetail() {
  const [personDetail, setPerson] = useState({});
  const [personCredit, setPersonCredit] = useState([]);
  const [loading, setLoading] = useState(true);

  let { person } = useParams();

  useEffect(() => {
    setLoading(true);

    getPersonDetails();
    getPersonCredits();

    setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 0);
  }, [person]);

  const getPersonDetails = () => {
    fetch(
      `https://api.themoviedb.org/3/person/${person}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setPerson(data);
      });
  };

  const getPersonCredits = () => {
    fetch(
      `https://api.themoviedb.org/3/person/${person}/movie_credits?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        data?.cast?.sort(function (a, b) {
          return b.popularity - a.popularity;
        });
        data?.crew?.sort(function (a, b) {
          return b.popularity - a.popularity;
        });
        setPersonCredit([data]);
      });
  };

  const toggleOverview = (e) => {
    if (e.target.classList.contains("mobile")) {
      e.target.classList.toggle("mobile-drop");
    }
  };

  return (
    <div className="container-person-detail">
      <BackLine />
      {!loading ? (
        <>
          <div className="person">
            <img
              src={
                personDetail?.profile_path
                  ? "http://image.tmdb.org/t/p/w500" +
                    personDetail?.profile_path
                  : "data:image/jpeg;base64,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"
              }
              alt={personDetail?.name}
            ></img>
            <div>
              <h6>{personDetail?.name}</h6>
              <span>{personDetail?.place_of_birth}</span>
              <span>{personDetail?.birthday}</span>
            </div>
            <p className="mobile" onClick={(e) => toggleOverview(e)}>
              {personDetail?.biography
                ? personDetail.biography
                : "... non disponibile"}
              <span className="blur"></span>
            </p>
          </div>
          <div className="person-work">
            <h5>Attore in {personCredit[0]?.cast?.length} Film</h5>
            <div className="person-cast">
              {personCredit[0]?.cast?.map((curMovie, i) => (
                <Link to={`/movie/${curMovie.id}`}>
                  <img
                    src={
                      curMovie?.poster_path
                        ? "http://image.tmdb.org/t/p/w500" +
                          curMovie?.poster_path
                        : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
                    }
                    alt={curMovie?.title}
                  ></img>
                </Link>
              ))}
            </div>

            <h5>Regista/Produttore in {personCredit[0]?.crew?.length} Film</h5>
            <div className="person-crew">
              {personCredit[0]?.crew?.map((curMovie, i) => (
                <Link to={`/movie/${curMovie.id}`}>
                  <img
                    src={
                      curMovie?.poster_path
                        ? "http://image.tmdb.org/t/p/w500" +
                          curMovie?.poster_path
                        : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
                    }
                    alt={curMovie?.title}
                  ></img>
                </Link>
              ))}
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
          <Skeleton style={{ backgroundColor: "gray" }} />
          <div className="d-flex flex-wrap justify-content-around">
            <Skeleton
              width="33%"
              height="160px"
              style={{ backgroundColor: "gray" }}
            />
            <Skeleton
              width="33%"
              height="160px"
              style={{ backgroundColor: "gray" }}
            />
            <Skeleton
              width="33%"
              height="160px"
              style={{ backgroundColor: "gray" }}
            />
            <Skeleton
              width="33%"
              height="160px"
              style={{ backgroundColor: "gray" }}
            />
            <Skeleton
              width="33%"
              height="160px"
              style={{ backgroundColor: "gray" }}
            />
            <Skeleton
              width="33%"
              height="160px"
              style={{ backgroundColor: "gray" }}
            />
          </div>
          <Skeleton style={{ backgroundColor: "gray" }} />
        </>
      )}
    </div>
  );
}

export default PersonDetail;
