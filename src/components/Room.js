import { React, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import path from "../path";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Roomnew.css";
import { fetcher } from "../services/ApiService";
import NavBar from "./navbarnew";
import { useCookies } from "react-cookie";

export const Room = (props) => {
  const [visible, setVisible] = useState(false);
  const [cookies] = useCookies(["user"]);

  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  window.addEventListener("scroll", toggleVisible);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [showModal1, setShowModal1] = useState(false);
  const handleClose1 = () => setShowModal1(false);
  const handleShow1 = () => setShowModal1(true);

  const [showModal2, setShowModal2] = useState(false);
  const handleClose2 = () => setShowModal2(false);
  const handleShow2 = () => setShowModal2(true);

  const { number } = useParams();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal3, setShowModal3] = useState(false);
  const handleClose3 = () => setShowModal3(false);
  const handleShow3 = () => setShowModal3(true);

  const [available, setAvailable] = useState(true);
  const headers = [
    "Передпокій",
    "Спальня",
    "Вбиральня",
    "Одноповерхове ліжко",
    "Двоповерхове ліжко (1 п.)",
    "Двоповерхове ліжко (2 п.)",
  ];
  async function get_route(number) {
    return new Promise(function (resolve, reject) {
      axios
        .post(path + "/get_route", { room_n: number })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {});
    });
  }
  const verify = (e, room_number, user_id, index) => {
    e.preventDefault();
    let new_room_ls = currentRoom.verified;
    let saved = !new_room_ls[index];
    new_room_ls[index] = null;
    setCurrentRoom((prev) => ({ ...prev, verified: new_room_ls }));
    fetcher({
      url: "verify",
      token: cookies.token,
      type: "post",
      body: {
        room_n: room_number,
        index: index,
      },
    })
      .then((res) => {
        new_room_ls[index] = saved;
        setCurrentRoom((prev) => ({ ...prev, verified: new_room_ls }));
      })
      .catch((err) => {});
  };

  const DeleteRoomUser = (index_block) => {
    if (available === false) {
      return;
    }

    let new_names = currentRoom.names;
    let new_start_dates = currentRoom.start_dates;
    let new_finish_dates = currentRoom.finish_dates;
    let new_verified = currentRoom.verified;
    let new_filled_form = currentRoom.filled_form;
    let new_list = currentRoom.furniture_list;

    let leave_date = new_finish_dates[index_block - 3];

    new_names[index_block - 3] = "";
    new_start_dates[index_block - 3] = "";
    new_finish_dates[index_block - 3] = "";
    new_verified[index_block - 2] = false;
    new_filled_form[index_block - 2] = false;

    let obj = currentRoom.furniture_list[index_block];

    for (var index = 0; index < obj.length; index++) {
      obj[index]["description"] = "";
      obj[index]["images"] = [];
    }

    new_list[index_block] = obj;

    setCurrentRoom((prev) => ({
      ...prev,
      start_dates: new_start_dates,
      verified: new_verified,
      names: new_names,
      furniture_list: new_list,
      filled_form: new_filled_form,
    }));
    get_route(currentRoom.number).then(async (value) => {
      setAvailable(false);
      fetcher({
        url: "room/" + value + "/delete",
        token: cookies.token,
        type: "post",
        body: {
          currentRoom,
          index_block,
          leave_date,
        },
      }).then((res) => {
        setAvailable(true);
      });
    });
  };
  const DeleteRoomGeneral = (index_block) => {
    if (available === false) {
      return;
    }
    let new_names = currentRoom.names;
    let new_verified = currentRoom.verified;
    let new_filled_form = currentRoom.filled_form;
    let new_list = currentRoom.furniture_list;
    let leave_date = false;

    new_verified[0] = false;
    new_filled_form[0] = false;
    let blocks = [0, 1, 2];
    for (let block = 0; block < blocks.length; block++) {
      let obj = currentRoom.furniture_list[blocks[block]];
      for (let index = 0; index < obj.length; index++) {
        obj[index]["description"] = "";
        obj[index]["images"] = [];
      }

      new_list[blocks[block]] = obj;
    }

    setCurrentRoom((prev) => ({
      ...prev,
      verified: new_verified,
      names: new_names,
      furniture_list: new_list,
      filled_form: new_filled_form,
    }));
    get_route(currentRoom.number).then(async (value) => {
      setAvailable(false);

      fetcher({
        url: "room/" + value + "/delete",
        token: cookies.token,
        type: "post",
        body: {
          currentRoom,
          index_block,
          leave_date,
        },
      }).then((res) => {
        setAvailable(true);
      });
    });
  };

  var settings = {
    infinite: false,
    speed: 200,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const settings_image = {
    lazyLoad: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
  };
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  function extractValue(input) {
    const startIndex = input.indexOf("=") + 1; // Find the index of the first "="
    if (startIndex === 0) return null; // If "=" is not found, return null
    const endIndex = input.indexOf("&", startIndex); // Find the index of the first "&" after the "="
    if (endIndex === -1) return input.substring(startIndex); // If "&" is not found, return the substring from "=" to the end
    return input.substring(startIndex, endIndex); // Return the substring between "=" and "&"
  }
  function check_url(slideImage) {
    if (typeof slideImage != "string") {
      return URL.createObjectURL(slideImage);
    } else {
      return (
        "https://drive.google.com/thumbnail?id=" +
        extractValue(slideImage) +
        "&sz=w1000"
      );
    }
  }
  const handleChangeFinishDate = (index, value) => {
    let users_dates = currentRoom.finish_dates;
    users_dates[index] = value;
    setCurrentRoom((prev) => ({ ...prev, finish_dates: users_dates }));
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(path + `/room_n/${number}`)
      .then((res) => {
        setCurrentRoom(res.data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
    setSelectedOption(0);
  }, []);
  return (
    <>
      {loading ? (
        <span className="loader"></span>
      ) : (
        <>
          <div
            className={`modal ${showModal ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: showModal ? "block" : "none" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    style={{
                      fontFamily: "Montserrat Medium 500",
                      fontSize: "18px",
                    }}
                  >
                    Виселення
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Виселити мешканця {currentRoom.names[0]}?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="discard_button"
                    onClick={handleClose}
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    className="confirm_button"
                    onClick={() => {
                      DeleteRoomUser(3);
                      handleClose();
                    }}
                  >
                    Виселити
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`modal ${showModal1 ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: showModal1 ? "block" : "none" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    style={{
                      fontFamily: "Montserrat Medium 500",
                      fontSize: "18px",
                    }}
                  >
                    Виселення
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose1}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Виселити мешканця {currentRoom.names[1]}?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="discard_button"
                    onClick={handleClose1}
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    className="confirm_button"
                    onClick={() => {
                      DeleteRoomUser(4);
                      handleClose1();
                    }}
                  >
                    Виселити
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`modal ${showModal2 ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: showModal2 ? "block" : "none" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    style={{
                      fontFamily: "Montserrat Medium 500",
                      fontSize: "18px",
                    }}
                  >
                    Виселення
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose2}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Виселити мешканця {currentRoom.names[2]}?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="discard_button"
                    onClick={handleClose2}
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    className="confirm_button"
                    onClick={() => {
                      DeleteRoomUser(5);
                      handleClose2();
                    }}
                  >
                    Виселити
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`modal ${showModal3 ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: showModal3 ? "block" : "none" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    style={{
                      fontFamily: "Montserrat Medium 500",
                      fontSize: "18px",
                    }}
                  >
                    Загальна форма
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose3}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Очистити загальну форму?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="discard_button"
                    onClick={handleClose3}
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    className="confirm_button"
                    onClick={() => {
                      DeleteRoomGeneral(0);
                      handleClose3();
                    }}
                  >
                    Очистити
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="roombody">
            <NavBar role={props.role}></NavBar>
            <div className="roommain">
              <div value={selectedOption} className="roomcards">
                <Slider
                  ref={(slider) => {
                    sliderRef = slider;
                  }}
                  {...settings}
                >
                  {currentRoom.furniture_list.map((list_fur, index_fur) => (
                    <div>
                      <div
                        className={
                          index_fur !== selectedOption
                            ? "roomroomfur"
                            : "roomroomfur_active"
                        }
                        onClick={() => handleOptionClick(index_fur)}
                      >
                        <span>{headers[index_fur]}</span>{" "}
                      </div>
                    </div>
                  ))}
                  <div>
                    <div
                      className={
                        6 !== selectedOption
                          ? "roomroomfur_accept"
                          : "roomroomfur_active"
                      }
                      onClick={() => handleOptionClick(6)}
                    >
                      <span>Підтвердження форми</span>
                    </div>
                  </div>
                  <div>
                    <div
                      className={
                        7 !== selectedOption
                          ? "roomroomfur_end"
                          : "roomroomfur_active"
                      }
                      onClick={() => handleOptionClick(7)}
                    >
                      <span>Виселення</span>
                    </div>
                  </div>
                </Slider>
                <div className="furniture_navigation">
                  <div onClick={previous}>
                    <i class="fa-solid fa-arrow-left"></i>
                  </div>
                  <div onClick={next}>
                    <i class="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
                <div className="furniture_wrapper">
                  {selectedOption === 6 ? (
                    <>
                      <div className="furnire_topic">
                        <strong>Підтвердження форм</strong>
                      </div>

                      <div className="verify">
                        <div
                          className="verify_button"
                          onClick={(e) =>
                            verify(e, currentRoom.number, props.user_id, 0)
                          }
                        >
                          Загальне{" "}
                          {currentRoom.verified[0] ? (
                            <label
                              style={{ color: "#4e8533", marginLeft: "5px" }}
                            >
                              <strong>✓</strong>
                            </label>
                          ) : currentRoom.verified[0] === null ? (
                            <span className="loader_accept"></span>
                          ) : (
                            <label
                              style={{ color: "#ee6363", marginLeft: "5px" }}
                            >
                              <strong>✗</strong>
                            </label>
                          )}
                        </div>
                        <div
                          className="verify_button"
                          onClick={(e) =>
                            verify(e, currentRoom.number, props.user_id, 1)
                          }
                        >
                          {currentRoom.names[0] !== "" ? (
                            <label>{currentRoom.names[0]}</label>
                          ) : (
                            <label>Немає мешканця</label>
                          )}{" "}
                          {currentRoom.verified[1] ? (
                            <label
                              style={{ color: "#4e8533", marginLeft: "5px" }}
                            >
                              <strong>✓</strong>
                            </label>
                          ) : currentRoom.verified[1] === null ? (
                            <span className="loader_accept"></span>
                          ) : (
                            <label
                              style={{ color: "#ee6363", marginLeft: "5px" }}
                            >
                              <strong>✗</strong>
                            </label>
                          )}
                        </div>
                        <div
                          className="verify_button"
                          onClick={(e) =>
                            verify(e, currentRoom.number, props.user_id, 2)
                          }
                        >
                          {currentRoom.names[1] !== "" ? (
                            <label>{currentRoom.names[1]}</label>
                          ) : (
                            <label>Немає мешканця</label>
                          )}{" "}
                          {currentRoom.verified[2] ? (
                            <label
                              style={{ color: "#4e8533", marginLeft: "5px" }}
                            >
                              <strong>✓</strong>
                            </label>
                          ) : currentRoom.verified[2] === null ? (
                            <span className="loader_accept"></span>
                          ) : (
                            <label
                              style={{ color: "#ee6363", marginLeft: "5px" }}
                            >
                              <strong>✗</strong>
                            </label>
                          )}
                        </div>
                        <div
                          className="verify_button"
                          onClick={(e) =>
                            verify(e, currentRoom.number, props.user_id, 3)
                          }
                        >
                          {currentRoom.names[2] !== "" ? (
                            <label>{currentRoom.names[2]}</label>
                          ) : (
                            <label>Немає мешканця</label>
                          )}{" "}
                          {currentRoom.verified[3] ? (
                            <label
                              style={{ color: "#4e8533", marginLeft: "5px" }}
                            >
                              <strong>✓</strong>
                            </label>
                          ) : currentRoom.verified[3] === null ? (
                            <span className="loader_accept"></span>
                          ) : (
                            <label
                              style={{ color: "#ee6363", marginLeft: "5px" }}
                            >
                              <strong>✗</strong>
                            </label>
                          )}
                        </div>
                      </div>
                    </>
                  ) : selectedOption === 7 ? (
                    <>
                      <div className="furnire_topic">
                        <strong>Виселення</strong>
                      </div>

                      <div className="verify">
                        <div className="furniture_clear">
                          {currentRoom.names[0] !== "" ? (
                            <label className="finish_date_text">
                              {currentRoom.names[0]}
                            </label>
                          ) : (
                            <label className="finish_date_text" for="myInput">
                              Немає мешканця
                            </label>
                          )}
                          <input
                            placeholder="Введіть дату"
                            className="finish_date_input"
                            type="date"
                            key={"inp_user" + 0}
                            onChange={(e) => {
                              e.preventDefault();
                              handleChangeFinishDate(0, e.target.value);
                            }}
                            value={currentRoom.finish_dates[0]}
                          />
                          <div
                            className="move_out_button"
                            disabled={!available}
                            onClick={handleShow}
                          >
                            Виселити
                          </div>
                        </div>

                        <div className="furniture_clear">
                          {currentRoom.names[1] !== "" ? (
                            <label className="finish_date_text">
                              {currentRoom.names[1]}
                            </label>
                          ) : (
                            <label className="finish_date_text" for="myInput">
                              Немає мешканця
                            </label>
                          )}
                          <input
                            placeholder="Введіть дату"
                            className="finish_date_input"
                            type="date"
                            key={"inp_user" + 1}
                            onChange={(e) => {
                              e.preventDefault();
                              handleChangeFinishDate(1, e.target.value);
                            }}
                            value={currentRoom.finish_dates[1]}
                          />
                          <div
                            className="move_out_button"
                            disabled={!available}
                            onClick={handleShow1}
                          >
                            Виселити
                          </div>
                        </div>

                        <div className="furniture_clear">
                          {currentRoom.names[2] !== "" ? (
                            <label className="finish_date_text">
                              {currentRoom.names[2]}
                            </label>
                          ) : (
                            <label className="finish_date_text" for="myInput">
                              Немає мешканця
                            </label>
                          )}
                          <input
                            placeholder="Введіть дату"
                            className="finish_date_input"
                            type="date"
                            key={"inp_user" + 2}
                            onChange={(e) => {
                              e.preventDefault();
                              handleChangeFinishDate(2, e.target.value);
                            }}
                            value={currentRoom.finish_dates[2]}
                          />
                          <div
                            className="move_out_button"
                            disabled={!available}
                            onClick={handleShow2}
                          >
                            Виселити
                          </div>
                        </div>

                        <div className="general_move_out" onClick={handleShow3}>
                          Очистити загальну форму
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {currentRoom.furniture_list.map((list_fur, index_fur) => (
                        <div>
                          {selectedOption === index_fur && (
                            <>
                              <div className="furnire_topic">
                                <strong>{headers[index_fur]}</strong>
                              </div>
                              {list_fur.map((furniture, index) => (
                                <>
                                  <div className="furniture_info">
                                    <div
                                      key={2 * index + 1}
                                      className="furniture_type"
                                    >
                                      {furniture.type_expanded}
                                    </div>
                                    <div
                                      key={2 * furniture + 2}
                                      className="furniture_description"
                                    >
                                      Опис: {furniture.description}
                                    </div>
                                  </div>
                                  {furniture.owner ? (
                                    <div
                                      key={
                                        "furniture_owner_div" +
                                        index +
                                        index_fur
                                      }
                                    >
                                      {"Власник: " + furniture.owner}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  {furniture.images.length != 0 ? (
                                    <div className="image_div">
                                      <Slider {...settings_image}>
                                        {furniture.images.map(
                                          (slideImage, index) => (
                                            <div>
                                              <div
                                                className="slider_div"
                                                key={index}
                                              >
                                                <img
                                                  className="slider_image"
                                                  src={check_url(slideImage)}
                                                />
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </Slider>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ))}
                            </>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
