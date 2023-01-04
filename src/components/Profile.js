import { Typography } from "@material-ui/core";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setImgUser,
  setName,
  setSigned,
  setList,
} from "../features/utent";
import { removeItemCookie, setItemCookie } from "../utils/util";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import BackLine from "./BackLine";
import { Skeleton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";

export default function Profile() {
  const state = useSelector((state) => state.utent);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabValue, setTabValue] = React.useState("watchlist");
  const [loading, setLoading] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const uiConfig = {
    signInFlow: "popup",

    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        fullLabel: "Accedi con Google",
        customParameters: {
          prompt: "select_account",
        },
      },
    ],

    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        const { user } = authResult;

        if (user) {
          createSessionUser(user);
        }

        window.location.assign(`/profile`);

        return false;
      },
    },
  };

  const createSessionUser = async (user) => {
    const userCookie = {
      name: user.displayName,
      email: user.email,
      userImage: user?.photoURL ? user.photoURL : "",
      isSignedIn: true,
    };

    setItemCookie("movie_db_user", JSON.stringify(userCookie));

    dispatch(setName(user.displayName));
    dispatch(setEmail(user.email));
    if (user.photoURL) dispatch(setImgUser(user.photoURL));
    dispatch(setSigned(true));
  };

  useEffect(() => {
    (async () => {
      if ((tabValue, state)) {
        await getMovieDb(tabValue);
      }
    })();
  }, [tabValue, state]);

  const logIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          createSessionUser(user);
        }
      })
      .catch((err) => alert(err));
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        removeItemCookie("movie_db_user");
        dispatch(logout());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getMovieDb = async (type) => {
    setLoading(true);

    let promises = [];
    let ids = [];
    if (type == "favorite") {
      ids = [...state?.favorite];
    } else if (type == "watchlist") {
      ids = [...state?.watchlist];
    } else {
      ids = [...state?.watch];
    }

    let idsUnique = ids ? [...new Set(ids)] : [];

    if (
      idsUnique.length > 0 &&
      idsUnique.length > (state.myList?.[type]?.length || 0)
    ) {
      idsUnique?.forEach((id) => {
        promises.push(
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT`
          ).then((resp) => resp.json())
        );
      });
    } else {
      setLoading(false);
    }

    if (promises.length > 0) {
      await getMyList(promises);
    }
  };

  const getMyList = async (promises) => {
    Promise.all(promises).then(function (result) {
      const newList = { ...state.myList, [tabValue]: result };

      dispatch(setList(newList));

      setLoading(false);
    });
  };

  if (state.isSignedIn) {
    return (
      <Box sx={{ m: "0 -10px", position: "relative" }} color={"white"}>
        <Box
          component={"span"}
          sx={{ position: "absolute", top: 1, right: 20 }}
        >
          <LogoutIcon color="secondary" onClick={signOut} />
        </Box>
        <Stack
          direction="column"
          justifyContent={"center"}
          alignItems={"center"}
          spacing={3}
          sx={{ my: 3, p: 2 }}
        >
          {state?.userImage && (
            <Avatar
              alt={state.name}
              src={state?.userImage}
              sx={{ width: 64, height: 64 }}
            />
          )}

          <Typography variant="button">{state.name}</Typography>
        </Stack>
        <Box sx={{ width: "100%" }}>
          <TabContext value={tabValue}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                width: "100%",
                bgcolor: "#333",
              }}
            >
              <TabList
                onChange={handleChangeTab}
                centered
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab label="Da Vedere" value="watchlist" />
                <Tab label="Favoriti" value="favorite" />
                <Tab label="Visti" value="watch" />
              </TabList>
            </Box>
            <TabPanel value="watchlist">
              <CustomList loading={loading} list={state.myList?.watchlist} />
            </TabPanel>
            <TabPanel value="favorite">
              <CustomList loading={loading} list={state.myList?.favorite} />
            </TabPanel>
            <TabPanel value="watch">
              <CustomList loading={loading} list={state.myList?.watch} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    );
  } else {
    return (
      <div className="profile-login">
        <div className="container">
          <div className="container-login">
            <div className="wrap-login">
              <form className="login-form" autoComplete="off">
                <input type="hidden" />
                <input type="hidden" />

                <span className="login-form-title">
                  <div className="logo">
                    <img
                      src="https://i.ibb.co/dtZt04w/Movie-Db-logos-transparent.png"
                      alt="logo"
                    ></img>
                  </div>
                </span>

                <div className="login-google">
                  <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                  />
                </div>

                <div className="wrap-input">
                  <input
                    className={email !== "" ? "has-val input" : "input"}
                    type="email"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="focus-input" data-placeholder="Email"></span>
                </div>

                <div className="wrap-input">
                  <input
                    className={password !== "" ? "has-val input" : "input"}
                    autoComplete="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="focus-input"
                    data-placeholder="Password"
                  ></span>
                </div>

                <div className="container-login-form-btn">
                  <button className="login-form-btn" onClick={() => logIn()}>
                    Accedi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function CustomList({ list = [], loading }) {
  return (
    <div className="container-person-detail">
      {!loading ? (
        <>
          {/* <div className="person-work">
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
          </div> */}
          <div className="person-work">
            <Grid
              container
              spacing={{ xs: 1 }}
              columns={{ xs: 3, sm: 5, md: 7 }}
              alignItems="center"
            >
              {list.length > 0 ? (
                list?.map((curMovie, i) => (
                  <Grid item xs={1} key={i} justifyContent="center">
                    <Stack justifyContent={"center"} direction="row">
                      <Link
                        to={`/movie/${curMovie.id}`}
                        key={i + "personcredit"}
                      >
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
                    </Stack>
                  </Grid>
                ))
              ) : (
                <div>Nessun film presente</div>
              )}
            </Grid>
          </div>
        </>
      ) : (
        <>
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
