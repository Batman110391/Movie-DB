import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./css/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import BackgroundHome from "./components/BackgroundHome";
import MovieOfDays from "./components/MovieOfDays";
import Header from "./components/Header";
import MovieDetails from "./components/MovieDetails";
import PersonDetail from "./components/PersonDetail";
import Skeleton from "@mui/material/Skeleton";
import Footer from "./components/Footer";

function App() {
  const [movieDay, setMovieDay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDayMovies();
    setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  const getDayMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const filtered = data.results.filter((e, i) => i < 6);
        setMovieDay(filtered);
      });
  };

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {!loading ? (
            <>
              <div id="begin" className="container-site wrapper-site">
                <Header />
                <BackgroundHome
                  backgroundImg={movieDay[0] ? movieDay[0]?.backdrop_path : ""}
                  home={true}
                />
                <MovieOfDays movieOfDays={movieDay} />
              </div>
              <Footer />
            </>
          ) : (
            <>
              <Skeleton
                width="100%"
                height="300px"
                style={{ backgroundColor: "gray" }}
              />
              <Skeleton style={{ backgroundColor: "gray" }} />
              <Skeleton style={{ backgroundColor: "gray" }} />
              <Skeleton style={{ backgroundColor: "gray" }} />
              <Skeleton height="300px" style={{ backgroundColor: "gray" }} />
            </>
          )}
        </Route>
        <Route path="/movie/:movie">
          <>
            <div id="begin" className="container-site wrapper-site">
              <MovieDetails />
            </div>
            <Footer />
          </>
        </Route>
        <Route path="/person/:person">
          <>
            <div id="begin" className="container-site wrapper-site">
              <PersonDetail />
            </div>
            <Footer />
          </>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
