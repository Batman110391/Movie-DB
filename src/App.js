import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./css/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import BackgroundHome from "./components/BackgroundHome";
import MovieOfDays from "./components/MovieOfDays";
import Header from "./components/Header";
import MovieDetails from "./components/MovieDetails";

function App() {
  const [movieDay, setMovieDay] = useState([]);

  useEffect(() => {
    getDayMovies();
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
          <div className="container wrapper-site">
            <Header />
            <BackgroundHome
              backgroundImg={movieDay[0] ? movieDay[0]?.backdrop_path : ""}
              home={true}
            />
            <MovieOfDays movieOfDays={movieDay} />
          </div>
        </Route>
        <Route path="/movie/:movie">
          <div className="container wrapper-site">
            <MovieDetails />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
