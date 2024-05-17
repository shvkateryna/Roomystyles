import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import path from "../path";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Roomsnew.css";
import NavBar from "./navbarnew";
import { fetcher } from "../services/ApiService";
import { useCookies } from "react-cookie";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import copy_logo from '../assets/copy.png'

const Rooms = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [cookies] = useCookies(["user"]);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    console.log(className);
    return (
      <div
        className={className}
        style={{ ...style, color: "red" }}
        onClick={onClick}
      />
    );
  }
  const SumbitionTitles = ["Ліж1 (1)", "Ліж1 (2)", "Ліж2", "Заг"];
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", color: "green" }}
        onClick={onClick}
      />
    );
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
          in place of 'smooth' */
    });
  };
  window.addEventListener("scroll", toggleVisible);

  const handleClick = (room_number) => {
    const element = document.getElementById(`element_${room_number}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyPress = (event, room_number) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed. Value:", inputValue);
    }
    const roomNumber = parseInt(inputValue - 1, 10);
    if (!isNaN(roomNumber)) {
      handleClick(roomNumber);
    }
  };

  // const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loadinRoute, setLoadingRoute] = useState([false, -1]);
  const [justcopied, setJustCopied] = useState(-1);
  const navigate = useNavigate();

  function wings(number) {
    if (number === 201) {
      return "2 поверх, ліве крило";
    }
    if (number == 219) {
      return "2 поверх, праве крило";
    }
    if (number === 301) {
      return "3 поверх, ліве крило";
    }
    if (number == 319) {
      return "3 поверх, праве крило";
    }
    if (number === 401) {
      return "4 поверх, ліве крило";
    }
    if (number === 419) {
      return "4 поверх, праве крило";
    }
    if (number === 501) {
      return "5 поверх, ліве крило";
    }
    if (number === 519) {
      return "5 поверх, праве крило";
    }
  }

  function checker(filled_forms) {
    let counter = 0;
    for (let i = 0; i < filled_forms.length; i++) {
      if (filled_forms[i] === true) {
        counter = counter + 1;
      }
    }
    return counter;
  }

  function checker_verified(verified_list) {
    let counter_verified = 0;
    console.log(verified_list.size);
    for (let i = 0; i < verified_list.length; i++) {
      if (verified_list[i] === true) {
        console.log(i);
        counter_verified = counter_verified + 1;
      }
    }
    return counter_verified;
  }

  async function get_route(number) {
    setLoadingRoute([true, number]);
    setJustCopied(number);
    return new Promise(function (resolve, reject) {
      axios
        .post(path + "/get_route", { room_n: number })
        .then((res) => {
          setLoadingRoute([false, -1]);
          resolve(res.data);
        })
        .catch((err) => {
          setLoadingRoute([false, -1]);
        });
    });
  }

  useEffect(() => {
    setLoading(true);
    fetcher({ url: "curator_rooms", token: cookies.token, type: "get" })
      .then((res) => {
        console.log(res.data);
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);
  return (
    <div key={"main_div_rooms"} className="main" style={{ minHeight: "100vh" }}>
      {
        loading ? (
          <div className="loader_div">
            <span key={"loader"} className="loader"></span>
          </div>
        ) : (
          <>
            {" "}
            <div className="roomsbody">
              <NavBar></NavBar>
              <div className="roomsmain">
                <div className="roomscards">
                  {response.map((ele, index) => (
                    <Card
                      className="card_room">
                      <Card.Body className = "card_header_wrapper">
                        <Card.Title>{ele.number}</Card.Title>

                        <button
                          key={"button_room_link" + index}
                          disabled={loadinRoute[0]}
                          className={
                            justcopied === ele.number ? "link-copied" : "link"
                          }
                          onClick={async () => {
                            navigator.clipboard.writeText(
                              "http://localhost:3000" +
                                "/rooms/" +
                                (await get_route(ele.number))
                            );
                          }}
                        >
                          <img class = "copy_logo" src={copy_logo}/>
                        </button>
                      </Card.Body>
                      
                      <ListGroup onClick={() => navigate(String(ele.number))} className="list-group-flush">
                        {ele.names.map((name, index) => (
                          <ListGroup.Item>
                            {name ? name : "Мешканця немає"}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      <div className="submition_wrapper">
                        <div className="heading_submition">
                          <span>Підтвердження:</span>
                        </div>

                        <div className="roomscardfooter2">
                          {ele.verified.map((el_verified, index) => (
                            <div className="spec_submition_wrapper">
                              {SumbitionTitles[index]}
                              <div
                                className={
                                  el_verified ? "roomaccepted" : "roomrejected"
                                }
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default Rooms;
