import React from "react";
import { useEffect, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    // Logic to find the room number and scroll to it
    const element = document.getElementById(`room${searchTerm}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
    } else {
      console.log("Room number not found");
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
  }, []);
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
            </div>
              <div className="roomscards">
                {response.map((ele, index) => (
                  <Card className="card_room">
                    <Card.Body className="card_header_wrapper">
                      <Card.Title id={`room${ele.number}`}>{ele.number}</Card.Title>
                      <i
                        class="fa-regular fa-copy"
                        disabled={loadinRoute[0]}
                        className={
                          justcopied === ele.number
                            ? "fa-regular fa-copy link-copied"
                            : " fa-regular fa-copy link"
                        }
                        onClick={async () => {
                          navigator.clipboard.writeText(
                            "http://localhost:3000" +
                              "/rooms/" +
                              (await get_route(ele.number))
                          );
                        }}
                      ></i>
                    </Card.Body>

                    <ListGroup onClick={() => navigate(String(ele.number))} className="list-group-flush">
                    {ele.verified.map((el_verified, index) => (
                      <ListGroup.Item key={index}>
                        <div className="name-container">
                          <span>{index === 3 ? "Загальне" : (ele.names[index] || "Мешканця немає")}</span>
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
