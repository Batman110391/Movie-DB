import React from "react";
import emailjs from "emailjs-com";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

function Footer() {
  const HandlerEmail = () => {
    document.querySelector(".container-form-email").style.display = "block";
    document.addEventListener("mouseup", function (e) {
      if (document.querySelector(".container-form-email").contains(e.target)) {
        document.querySelector(".container-form-email").style.display = "block";
      } else {
        document.querySelector(".container-form-email").style.display = "none";
      }
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_b0lspdc",
        "template_wnyrbrb",
        e.target,
        "user_zC2vdQW4en6zyi9JUNybi"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    e.target.reset();
    document.querySelector(".container-form-email").style.display = "none";
  };

  return (
    <footer>
      <div className="info-footer">
        <div className="info-footer__content">
          <h2>React App per info sui Film</h2>
          <h5>
            Attraverso l'utilizzo di react ho creato questo progetto, che vuole
            essere un semplice sito per appassionati di film. Utilizzo di
            Firebase per memorizzare i dati.
          </h5>
        </div>
      </div>
      <div className="social-footer">
        <h2>Seguimi</h2>
        <div className="link-social">
          <a
            href="https://www.instagram.com/simone.gattinara/"
            className="link-social__cover instagram"
            target="_blank"
            rel="noreferrer"
          ></a>
          <a
            href="https://www.facebook.com/simoneprince.gattinara"
            className="link-social__cover facebook"
            target="_blank"
            rel="noreferrer"
          ></a>
          <a
            href="https://www.linkedin.com/in/simone-gattinara-69b719202/"
            className="link-social__cover linkedin"
            target="_blank"
            rel="noreferrer"
          ></a>
        </div>
        <h5>Copyright © 2021 Reserved by Simone Gattinara.</h5>
      </div>
    </footer>
  );
}

export default Footer;
