import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import path from "../path";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Roomsnew.css";
import NavBar from "./navbarnew";
import { fetcher } from "../services/ApiService";
import { useCookies } from "react-cookie";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const Rooms = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [cookies] = useCookies(["user"]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertVisible, setAlertVisible] = useState(false); // State for alert visibility

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const alertStyle = {
    display: alertVisible ? 'block' : 'none', // Show or hide based on alertVisible state
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#8D0709',
    backgroundColor: '#fdd',
    border: '1px solid #8D0709',
    padding: '1.3%',
    marginBottom: '10px',
    zIndex: 1000,
    fontFamily: 'Lexend, sans-serif',
    fontSize: '16px',
    letterSpacing: '2px',
    fontWeight: 300,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#8D0709',
    fontSize: '18px',
    cursor: 'pointer',
    position: 'absolute',
    top: '0%',
    right: '1%',
  };

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 300);
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style, color: "red" }} onClick={onClick} />
    );
  }

  const SumbitionTitles = ["Ліж1 (1)", "Ліж1 (2)", "Ліж2", "Заг"];

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style, display: "block", color: "green" }} onClick={onClick} />
    );
  }

  window.addEventListener("scroll", toggleVisible);

  const handleClick = (room_number) => {
    const element = document.getElementById(`element_${room_number}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [loadinRoute, setLoadingRoute] = useState([false, -1]);
  const [justcopied, setJustCopied] = useState(-1);
  const navigate = useNavigate();

  const handleSearch = () => {
    const element = document.getElementById(`room${searchTerm}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setAlertVisible(false); // Hide alert if room is found
    } else {
      setAlertVisible(true); // Show alert if room is not found
    }
  };

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
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, [cookies.token]);

  return (
    <div key={"main_div_rooms"} className="main" style={{ minHeight: "130vh" }}>
      <div><NavBar role={props.role}></NavBar></div>
      {loading ? (
        <div className="loader_div">
          <span key={"loader"} className="loader"></span>
        </div>
      ) : (
        <>
          <div className="roomsbody">
            <div className="roomsmain">
              <div className="search">
                <div className="my-rooms">Мої кімнати</div>
                <div className="search-input">
                  <input className="input-room"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Введіть номер кімнати"
                  />
                  <button className="search-button" onClick={handleSearch}>Шукати</button>
                </div>
                {alertVisible && (
                  <div className="alert" style={alertStyle}>
                    <span>Кімнату не знайдено</span>
                    <button style={closeButtonStyle} onClick={() => setAlertVisible(false)}>×</button>
                  </div>
                )}
              </div>
              <div className="roomscards">
                {response.map((ele, index) => (
                  <Card key={index} className="card_room">
                    <Card.Body className="card_header_wrapper">
                      <Card.Title id={`room${ele.number}`}>{ele.number}</Card.Title>
                      <i
                        className={justcopied === ele.number ? "fa-regular fa-copy link-copied" : "fa-regular fa-copy link"}
                        onClick={async () => {
                          navigator.clipboard.writeText(
                            "http://localhost:3000" + "/rooms/" + (await get_route(ele.number))
                          );
                        }}
                      ></i>
                    </Card.Body>
                    <ListGroup onClick={() => navigate(String(ele.number))} className="list-group-flush">
                      {ele.verified.map((el_verified, index) => (
                        <ListGroup.Item key={index}>
                          <div className="name-container">
                            <span>{index === 0 ? "Загальне" : (ele.names[index - 1] || "Мешканця немає")}</span>
                            <div className={`circle ${el_verified ? "roomaccepted" : "roomrejected"}`}></div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Rooms;
