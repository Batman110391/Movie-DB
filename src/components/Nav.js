import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import { ValidateEmail, CheckPassword } from "../utility";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useSelector, useDispatch } from "react-redux";
import { setName, setEmail, setSigned } from "../features/utent";
import AccountMenu from "./AccountMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },

  withoutLabel: {
    marginTop: theme.spacing(3),
  },
}));

function Nav() {
  const state = useSelector((state) => state.utent);
  const dispatch = useDispatch();

  const classes = useStyles();
  const [valuesPass, setValuesPass] = useState({
    password: "",
    showPassword: false,
    correct: true,
  });

  const [valuesEmail, setValuesEmail] = useState({
    email: "",
    correct: true,
  });

  const [imgUser, setImgUser] = useState(null);

  const [upload, setUpload] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setName(user.displayName));
        dispatch(setEmail(user.email));
        if (user.photoURL) setImgUser(user.photoURL);
      }
      dispatch(setSigned(!!user));
    });
  }, []);

  useEffect(() => {
    if (state.isSignedIn) getImgLink();
  }, [imgUser, state.isSignedIn]);

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
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        fullLabel: "Registrati con Email",
      },
    ],

    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
    },
  };

  const logIn = (e) => {
    e.preventDefault();

    var email = valuesEmail.email;
    var password = valuesPass.password;

    if (!ValidateEmail(email))
      setValuesEmail({
        email: "",
        correct: false,
      });
    if (!CheckPassword(password))
      setValuesPass({ password: "", showPassword: false, correct: false });

    if (ValidateEmail(email) && CheckPassword(password)) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          setValuesEmail({
            email: "",
            correct: true,
          });
          setValuesPass({ password: "", showPassword: false, correct: true });
        })
        .catch((err) => {
          setValuesEmail({
            email: "",
            correct: false,
          });
          setValuesPass({ password: "", showPassword: false, correct: false });
        });
    }
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(setSigned(false));
        setImgUser(null);
        window.location.reload();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleChangeEmail = (e) => {
    setValuesEmail({
      email: e.target.value,
      correct: true,
    });
  };

  const handleChangePass = (e) => {
    setValuesPass({
      password: e.target.value,
      showPassword: false,
      correct: true,
    });
  };

  const handleClickShowPassword = () => {
    setValuesPass({
      ...valuesPass,
      showPassword: !valuesPass.showPassword,
      correct: true,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const openPopUp = () => {
    document.querySelector(".pop-up").style.display = "block";
    document.addEventListener("mouseup", function (e) {
      if (document.querySelector(".pop-up").contains(e.target)) {
        document.querySelector(".pop-up").style.display = "block";
      } else {
        document.querySelector(".pop-up").style.display = "none";
      }
    });
  };

  const handleChangeImg = async () => {
    var file = document.getElementById("raised-button-file").files[0];
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(state.email);

    var metadata = {
      contentType: file.type,
    };

    setUpload(true);

    await ref
      .put(file, metadata)
      .then((snapshot) => {
        getImgLink();
        setUpload(false);
      })
      .catch((err) => {
        alert("c'è stato un problema, riprova");
        return false;
      });
  };

  const getImgLink = async () => {
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(state.email);

    await ref
      .getDownloadURL()
      .then((link) => {
        setImgUser(link);
      })
      .catch((error) => {
        return false;
      });
  };

  return (
    <>
      <nav className="nav-bar">
        {imgUser ? (
          <div onClick={openPopUp}>
            <div className="content-user-img">
              <img className="user-img" src={imgUser} alt={state.email} />
            </div>
            <span className="name-login-db">{state.name}</span>
          </div>
        ) : (
          <div onClick={openPopUp}>sign in</div>
        )}
      </nav>
      <div className="pop-up">
        {state.isSignedIn ? (
          <AccountMenu
            name={state.name.split(" ").shift()}
            signOut={signOut}
            handleChangeImg={handleChangeImg}
            upload={upload}
          />
        ) : (
          <div className="content-auth">
            <div className="sign-in">
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </div>

            <div className="log-in">
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel
                  className="label-form"
                  htmlFor="outlined-adornment-email"
                >
                  Email
                </InputLabel>
                <OutlinedInput
                  className="email"
                  id="outlined-adornment-email"
                  type="email"
                  autoComplete="off"
                  onChange={handleChangeEmail}
                  placeholder="example@email.it"
                  labelWidth={70}
                />
                {!valuesEmail.correct ? (
                  <FormHelperText id="component-error-text">
                    Email non corretta
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel
                  className="label-form"
                  htmlFor="outlined-adornment-password"
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  className="password"
                  id="outlined-adornment-password"
                  type={valuesPass.showPassword ? "text" : "password"}
                  value={valuesPass.password}
                  autoComplete="off"
                  onChange={handleChangePass}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {valuesPass.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={50}
                />
                {!valuesPass.correct ? (
                  <FormHelperText id="component-error-text">
                    Password non corretta
                  </FormHelperText>
                ) : null}
              </FormControl>
              <Button onClick={logIn} className="accedi" variant="contained">
                Accedi
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Nav;
