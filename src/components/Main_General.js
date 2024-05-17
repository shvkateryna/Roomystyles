import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/Main_form.css";
import axios from "axios";
import General from "./General";
import { FaArrowCircleUp } from "react-icons/fa";
import styled from "styled-components";
import path from "../path";
function Main_General() {
  const Button = styled.div`
    position: fixed;
    width: 100%;
    left: 45%;
    bottom: 60px;
    height: 20px;
    font-size: 3rem;
    cursor: pointer;
    color: black;
  `;
  const { id_coded } = useParams();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);

  const handleClick = (index) => {
    const element = document.getElementById(`element_${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    axios
      .get(path + `/room/${id_coded}`)
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="main_form">
      {loading ? (
        <div className="loader_block">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {response ? (
            <>
              <div className="circle">
                <FaArrowCircleUp
                  onClick={scrollToTop}
                  style={{ display: visible ? "inline" : "none" }}
                />
              </div>
              <div className="register">
                <strong>Реєстрація кімнати №{response.number}</strong>
              </div>
              <div className="student_form_frame">
                <General room={response} id_coded={id_coded} />
              </div>
            </>
          ) : (
            <></>
          )}
          {error ? (
            <>
              {error.response.data === "Wrong code" ? (
                <div className="notions">Ваш код не правильний</div>
              ) : (
                <div className="notions">
                  Ваша форма вже підтверджена куратором, ви не можете робити
                  зміни
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}
export default Main_General;
