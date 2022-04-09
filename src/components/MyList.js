import React, { useEffect, useState } from "react";
import BackLine from "./BackLine";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function MyList({ state }) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  let { type } = useParams();

  useEffect(() => {
    setLoading(true);

    getMovieDb();

    setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 100);
  }, [state]);

  const getMovieDb = async () => {
    let promises = [];
    let ids = [];
    if (type && type == "favorite") {
      ids = [...state?.favorite];
    } else if (type && type == "watchlist") {
      ids = [...state?.watchlist];
    } else if (type) {
      ids = [...state?.watch, ...state?.favorite];
    }

    let idsUnique = ids ? [...new Set(ids)] : [];

    if (idsUnique.length > 0) {
      idsUnique?.forEach((id) => {
        promises.push(
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
          ).then((resp) => resp.json())
        );
      });
    }

    if (promises) {
      getMyList(promises);
    }
  };

  const getMyList = async (promises) => {
    Promise.all(promises).then(function (result) {
      setList(result);

      return true;
    });
  };

  return (
    <div className="container-person-detail">
      <BackLine />
      {!loading ? (
        <>
          <div className="person-work">
            <h5>
              {type == "favorite"
                ? "preferiti - "
                : type == "watchlist"
                ? "da guardare - "
                : "film visti - "}
              {list ? list.length : null}
            </h5>
            <div className="person-crew">
              {list ? (
                list?.map((curMovie, i) => (
                  <Link to={`/movie/${curMovie.id}`} key={i + "personcredit"}>
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
                ))
              ) : (
                <div>Nessun film presente</div>
              )}
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

export default MyList;
