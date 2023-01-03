import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  favorite,
  watchlist,
  watch,
  setName,
  setEmail,
  setSigned,
  setUser,
} from "./features/utent";

import CssBaseline from "@mui/material/CssBaseline";

import { firebaseCongif } from "./firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

import "./css/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import BackgroundHome from "./components/BackgroundHome";
import MovieOfDays from "./components/MovieOfDays";
import Header from "./components/Header";
import MovieDetails from "./components/MovieDetails";
import PersonDetail from "./components/PersonDetail";
import Skeleton from "@mui/material/Skeleton";
import Footer from "./components/Footer";
import UpcomingMovie from "./components/UpcomingMovie";
import Nav from "./components/Nav";
import MyList from "./components/MyList";
import { BottomNavigation } from "@mui/material";
import { Box } from "@mui/system";
import Profile from "./components/Profile";
import { getItemCookie } from "./utils/util";

firebaseCongif();

function App() {
  const [movieDay, setMovieDay] = useState([]);
  const [upcomingMovie, setUpcomingMovie] = useState([]);
  const [loading, setLoading] = useState(true);

  const state = useSelector((state) => state.utent);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    (async () => {
      await getDayMovies();
      await getUpcomingMovies();
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getItemCookie("movie_db_user");
      if (user) {
        try {
          const parseInJson = JSON.parse(user);

          dispatch(setUser(parseInJson));
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (state.isSignedIn) {
        const db = firebase.firestore();
        const data = await db.collection("Utenti").doc(state.email).get();
        const result = data.data();
        if (result) {
          dispatch(favorite(result.favorite));
          dispatch(watchlist(result.watchlist));
          dispatch(watch(result.watch));
        } else {
          db.collection("Utenti")
            .doc(state.email)
            .set({ favorite: [], watchlist: [], watch: [] });
        }
      }
    };
    fetchData();
  }, [state.isSignedIn]);

  const getDayMovies = async () => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setMovieDay(data.results);
      });
  };

  const getUpcomingMovies = async () => {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setUpcomingMovie(data.results);
      });
  };

  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact>
            {!loading ? (
              <>
                <Header />
                <div id="begin" className="container-site wrapper-site">
                  <BackgroundHome
                    backgroundImg={
                      movieDay[0] ? movieDay[0]?.backdrop_path : ""
                    }
                    home={true}
                  />
                  <MovieOfDays movieOfDays={movieDay} />
                  <UpcomingMovie upcomingMovie={upcomingMovie} />
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
              <Header />
              <div id="begin" className="container-site wrapper-site">
                <MovieDetails />
              </div>
              <Footer />
            </>
          </Route>
          <Route path="/person/:person">
            <>
              <Header />
              <div id="begin" className="container-site wrapper-site">
                <PersonDetail />
              </div>
              <Footer />
            </>
          </Route>
          <Route path="/mylist/:type">
            <>
              <div id="begin" className="container-site wrapper-site">
                <MyList state={state} />
              </div>
              <Footer />
            </>
          </Route>
          <Route path="/profile">
            <>
              <Header />
              <div id="begin" className="container-site wrapper-site">
                <Profile />
              </div>
            </>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
