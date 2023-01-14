import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { ButtonBase, Divider, ListItemAvatar } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { historySearch } from "../features/utent";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function SearchPage() {
  const [typeQuery, setTypeQuery] = React.useState("film");
  const [searchInput, setSearchInput] = React.useState("");
  const [listQuery, setListQuery] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.utent);
  const db = firebase.firestore();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect for API call
  React.useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        searchCharacters(debouncedSearchTerm, typeQuery).then((results) => {
          setIsSearching(false);
          setListQuery(results);
        });
      } else {
        setListQuery([]);
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const handleClickChip = (type) => {
    if (typeQuery !== type) {
      setSearchInput("");
      setTypeQuery(type);
    }
  };

  const redirectMovie = (movieId, type) => {
    if (movieId) {
      if (state.isSignedIn) {
        const currStory = {
          title: searchInput,
          type: typeQuery,
          dateSearch: new Date().toString(),
        };

        const unionStory = [currStory, ...state.historySearch];

        db.collection("Utenti")
          .doc(state.email)
          .update({
            historySearch: unionStory.filter((_, i) => i <= 50),
          });

        dispatch(historySearch(unionStory));
      }

      history.push(`/${type}/${movieId}`);
    }
  };

  const handleSearchStory = (key, type) => {
    setTypeQuery(type);
    setSearchInput(key);
  };

  console.log("listQuery", listQuery);

  return (
    <Box sx={{ color: "white" }}>
      <Box sx={{ p: 2 }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Cerca film, cast..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Search>
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1}>
          <ButtonBase onClick={() => handleClickChip("film")}>
            <Chip
              label="Films"
              color={typeQuery === "film" ? "success" : "default"}
              sx={{ color: "white" }}
              variant={typeQuery === "film" ? "filled" : "outlined"}
            />
          </ButtonBase>
          <ButtonBase onClick={() => handleClickChip("cast")}>
            <Chip
              label="Cast"
              color={typeQuery === "cast" ? "success" : "default"}
              variant={typeQuery === "cast" ? "filled" : "outlined"}
              sx={{ color: "white" }}
            />
          </ButtonBase>
        </Stack>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
          bgcolor: "#4a4354b8",
          p: 2,
          color: "#aeaeae",
        }}
      >
        {listQuery.length > 0 ? (
          <List>
            {listQuery?.map((curMovie, i) => (
              <>
                {typeQuery === "film" ? (
                  <ListItem
                    alignItems="flex-start"
                    sx={{ p: 0 }}
                    onClick={() => redirectMovie(curMovie?.id, "movie")}
                    key={i + "movieSearch"}
                  >
                    <ListItemAvatar>
                      <img
                        style={{
                          width: "95px",
                          height: "125px",
                          border: "1px solid gray",
                          objectFit: "cover",
                          marginRight: "20px",
                        }}
                        src={
                          curMovie?.poster_path
                            ? "http://image.tmdb.org/t/p/w500" +
                              curMovie?.poster_path
                            : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
                        }
                        alt={curMovie?.title}
                        loading="lazy"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="bold">
                          {curMovie?.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          style={{ color: "#767676" }}
                        >
                          {curMovie?.release_date}
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  <ListItem
                    alignItems="flex-start"
                    sx={{ p: 0 }}
                    onClick={() => redirectMovie(curMovie?.id, "person")}
                    key={i + "moviePerson"}
                  >
                    <ListItemAvatar>
                      <img
                        style={{
                          width: "95px",
                          height: "125px",
                          border: "1px solid gray",
                          objectFit: "cover",
                          marginRight: "20px",
                        }}
                        src={
                          curMovie?.profile_path
                            ? "http://image.tmdb.org/t/p/w500" +
                              curMovie?.profile_path
                            : "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
                        }
                        alt={curMovie?.name}
                        loading="lazy"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="bold">
                          {curMovie?.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          style={{ color: "#767676" }}
                        >
                          {curMovie?.known_for_department}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}

                <Divider
                  component={"div"}
                  sx={{
                    width: "100%",
                    background: "#9999994f",
                    my: 1.5,
                    px: 30,
                  }}
                />
              </>
            ))}
          </List>
        ) : (
          <>
            <Typography variant="button" fontWeight={"bold"}>
              Ricerche recenti
            </Typography>
            <Divider
              component={"div"}
              sx={{
                width: "100%",
                background: "#9999994f",
                my: 1.5,
                px: 30,
                ml: -5,
              }}
            />
            <List>
              {state.historySearch?.map((hist, i) => (
                <>
                  <ListItemButton
                    key={i + "histoy"}
                    sx={{ width: "100%" }}
                    onClick={() => handleSearchStory(hist.title, hist.type)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <ListItemText primary={hist.title} />
                      <Chip
                        label={hist.type}
                        color={"default"}
                        variant={"filled"}
                        sx={{ color: "#e5e5e5", backgroundColor: "#717298" }}
                      />
                    </Stack>
                  </ListItemButton>
                  <Divider
                    component={"div"}
                    sx={{
                      width: "100%",
                      background: "#9999994f",
                      my: 1.5,
                      px: 30,
                    }}
                  />
                </>
              ))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );
}

// API search function
function searchCharacters(keywords, type, page = 1) {
  const querySearchType = type === "film" ? "movie" : "person";

  return fetch(
    `https://api.themoviedb.org/3/search/${querySearchType}?api_key=${process.env.REACT_APP_SECRET_CODE}&language=it-IT&query=${keywords}&page=${page}`
  )
    .then((r) => r.json())
    .then((data) => {
      data?.results?.sort(function (a, b) {
        return b.popularity - a.popularity;
      });
      return data.results;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}
// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
