import "../styles/Form_reg.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { Slide } from "react-slideshow-image";
import path from "../path";
import Slider from "react-slick";
import trash_logo from "../assets/trash.png";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

function Two(props) {
  const id_coded = props.id_coded;
  const [room, setRoom] = useState(props.room);
  const [ruleAccepted, setRuleAccepted] = useState(false);
  const [errorFurniture, setErrorFurniture] = useState("");
  const [sendingForm, setSendingForm] = useState(false);
  const [imageCounter, setImageCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const new_block = room.furniture_list[4];
  const [alertVisible, setAlertVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const baseAlertStyle = {
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#8D0709',
    backgroundColor: '#fdd',
    border: '1px solid #8D0709',
    padding: '2%',
    width: '70%',
    marginBottom: '10px',
    zIndex: 1000,
    fontFamily: "Roboto Flex",
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  
  const mobileAlertStyle = {
    ...baseAlertStyle,
    fontSize: '12px',
  };
  
  const isMobile = window.innerWidth < 768;
  
  const alertStyle = {
    ...baseAlertStyle,
    ...(isMobile ? mobileAlertStyle : {}),
  };

  const successStyle = {
    display: successVisible ? 'block' : 'none', // Show or hide based on successVisible state
    position: 'fixed',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'solid 1px',
    borderColor: '#8D0709',
    color: '#8D0709',
    backgroundColor: '#ffffff',
    border: '1px solid #c3e6cb',
    padding: '2%',
    width: '70%',
    marginBottom: '10px',
    zIndex: 1000,
    fontFamily: 'Roboto Flex, sans-serif',
    fontSize: '16px',
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

  const settings = {
    lazyLoad: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
  };

  async function shrinkImage(image) {
    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(image, options);
    return compressedFile;
  }
  async function upload_google_drive(file) {
    let url =
      "https://script.google.com/macros/s/AKfycbzzUASeCpfNN5Z9nv4H21rq3p3KcH8lSm5-HDBxay0EpJIeZ18T_XF1s090Ki_o9Ga2hg/exec";
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        var base64data = reader.result;
        let spt = base64data.split("base64,")[1];
        let obj = {
          base64: spt,
          type: file.type,
          name: file.name,
        };
        fetch(url, {
          method: "POST",
          body: JSON.stringify(obj),
        })
          .then((r) => r.text())
          .then((data) => {
            resolve(data);
          });
      };
    });
  }
  const handleChangeUser = (index, value) => {
    let users = room.names;
    users[index] = value;
    setRoom((prev) => ({ ...prev, names: users }));
  };
  const handleChangeRoom = (index_block, index, option, value) => {
    let obj = room.furniture_list[index_block];
    obj[index][option] = value;
    let new_list = room.furniture_list;
    new_list[index_block] = obj;
    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
  };
  const handleChangeRoomFile = async (index_block, index, option, value) => {
    let compressedFiles = [];
    for (var i = 0; i < value.length; i++) {
      compressedFiles.push(await shrinkImage(value[i]));
    }

    let obj = room.furniture_list[index_block];
    obj[index][option] = compressedFiles;
    let new_list = room.furniture_list;
    new_list[index_block] = obj;

    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
  };
  const handleChangeFilled = (index) => {
    let filled = room.filled_form;
    filled[index] = true;
    setRoom((prev) => ({ ...prev, filled_form: filled }));
  };
  const handleChangeStartDate = (index, value) => {
    let users_dates = room.start_dates;
    users_dates[index] = value;
    setRoom((prev) => ({ ...prev, start_dates: users_dates }));
  };
  const handle_post = async (e) => {
    e.preventDefault();
    if (room.names[1] === "") {
      setAlertVisible(true)
      setErrorFurniture("Немає імені мешканця");
      setSendingForm(false);
      return;
    }
    if (room.start_dates[1] === "") {
      setAlertVisible(true)
      setErrorFurniture("Немає дати");
      setSendingForm(false);
      return;
    }
    for (let elem of room.furniture_list[4]) {
      if ((elem.description === null) | (elem.description === "")) {
        setAlertVisible(true)
        setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'");
        setSendingForm(false);
        return;
      }
    }
    setSendingForm(true);
    handleChangeFilled(2);
    let new_furniture_list = [];
    let totalImages = 0;

    // Count total images for progress calculation
    for (let furnit of room.furniture_list[4]) {
      if (furnit.images !== null) {
        totalImages += furnit.images.length;
      }
    }

    let uploadedImages = 0;
    for (let furnit of room.furniture_list[4]) {
      if (furnit.images !== null) {
        let links = [];
        for (let file of furnit.images) {
          if (typeof file != "string") {
            const link = await upload_google_drive(file);
            uploadedImages++;
            setImageCounter(imageCounter + 1);
            // Update progress
            setProgress(Math.round((uploadedImages / totalImages) * 100));
            links.push(link);
          } else {
            links.push(file);
          }
        }
        furnit.images = links;
        new_furniture_list.push(furnit);
      } else {
        new_furniture_list.push(furnit);
      }
    }

    setRoom((prev) => ({ ...prev, furniture_list: new_furniture_list }));
    axios.post(path + `/room/${id_coded}/submit/4`, room).then((res) => {
      setSuccessVisible(true); // Show success alert
      setTimeout(() => {
        routeChange("/rooms/" + id_coded);
      }, 3000); // Redirect after 2 seconds to allow user to see the success alert
    });
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
  return (
    <div>
      {sendingForm ? (
        <>
         <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <CircularProgressWithLabel value={progress} />
        </div>
        </>
      ) : (
        <>
          <div>
            <div className="room_type_header">
              Двоповерхове ліжко (1 поверх)
            </div>
            <div className="main_div" key={"main_form_div"}>
              <form className="main_form">
                <div className="furniture_list" key="furniture_div">
                  {alertVisible ? (
                    <>
                    <div className="alert" style={alertStyle}>
                    <span>{errorFurniture}</span>
                    <button style={closeButtonStyle} onClick={() => setAlertVisible(false)}>×</button>
                  </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <label className="text_header2" key={"user_"}>
                    <div>Ім'я та прізвище мешканця</div>
                  </label>
                  <input
                    placeholder="Введіть ім'я та прізвище"
                    className="user_input"
                    type="text"
                    key={"inp_user" + 1}
                    onChange={(e) => handleChangeUser(1, e.target.value)}
                    value={room.names[1]}
                  />
                  <label className="text_header2" key={"user_"}>
                    <div>Дата поселення</div>
                  </label>
                  <input
                    placeholder="ДД/ММ/PP"
                    className="user_input"
                    type="date"
                    key={"inp_user" + 1}
                    onChange={(e) => handleChangeStartDate(1, e.target.value)}
                    value={room.start_dates[1]}
                  />
                  <br></br>
                  {new_block.map((ele, index) => (
                    <>
                      <div
                        key={"div_" + index + "" + 4}
                        className="furniture_block"
                      >
                        <div className="horizontal_line_separator"></div>
                        <div
                          key={"div_header_" + index + "" + 4}
                          className="header_furniture"
                        >
                          <div
                            key={"que_body_" + index + "" + 4}
                            className="text_header"
                          >{index + 1 + ")    "} {ele.type_expanded}
                              <br /> </div>
                          <div
                            className="questions-text"
                          >
                            {ele.questions}
                          </div>
                        </div>
                        </div>
                        <div
                          key={"div_body_" + index + "" + 4}
                          className="body_furniture"
                        >
                          {ele.type === "bed" ? (
                            <div key={"div_select_" + index + "" + 4}></div>
                          ) : (
                            <></>
                          )}
                          <textarea
                            className="obj_description"
                            onChange={(e) =>
                              handleChangeRoom(
                                4,
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            value={room.furniture_list[4][index].description}
                            key={"inp_" + index + "" + 4}
                            type="text"
                            placeholder={"Опишіть стан (до 150 символів)"}
                            maxLength={150}
                          />
                          <div
                            key={"div_image" + index + "" + 4}
                            className="file_div"
                          >
                            <input
                              key={"input_image" + index + "" + 4}
                              className="file_input"
                              type="file"
                              multiple
                              onChange={(event) => {
                                handleChangeRoomFile(
                                  4,
                                  index,
                                  "images",
                                  Array.from(event.target.files)
                                );
                              }}
                            ></input>
                            <div
                              className="clear_images"
                              onClick={() => {
                                handleChangeRoomFile(4, index, "images", []);
                              }}
                            >
                              <img className="trash_logo" src={trash_logo} />
                            </div>
                          </div>
                          {ele.images.length != 0 ? (
                            <div className="slider_wrapper">
                              <Slider {...settings}>
                                {ele.images.map((slideImage, index) => (
                                  <div>
                                    <div className="image_wrapper">
                                      <img
                                        className="slider_image"
                                        src={check_url(slideImage)}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </Slider>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                    </>
                  ))}
                  <div className="submit_align_wrapper">
                    <br />
                    <div className="send-text-main">
                    <div className="send-text">
                      <p>
                        Перед підтвердженням форми уважно перегляньте правила
                        Колегіуму за посиланням.
                      </p>
                      <p>
                        <a
                          target="_blank"
                          href="https://collegium.ucu.edu.ua/dlia-vstupnika/dokumenty/pravila-vnutrishnogo-rozporiadku-v-kolegiumi"
                        >
                          Правила колегіуму
                        </a>
                      </p>
                    </div>
                    <div className="results_wrapper">
                      <p className="send-text">
                        Я ознайомився / -лася з правилами та підтверджую, що вся
                        надана інформація достовірна.
                        <input
                          style={{
                            height: "15px",
                            width: "15px",
                            marginLeft: "10px",
                          }}
                          key="check_rules"
                          type="checkbox"
                          checked={ruleAccepted}
                          onChange={() => setRuleAccepted(!ruleAccepted)}
                        />
                      </p>
                      <input
                        disabled={!ruleAccepted}
                        className="submit_form"
                        value="Відправити"
                        onClick={handle_post}
                        key="submit_button"
                        type={"submit"}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    {successVisible ? (
      <>
        <div className="alert" style={successStyle}>
            <span>Форму успішно відправлено!</span>
            <button style={closeButtonStyle} onClick={() => setSuccessVisible(false)}>×</button>
        </div>
      </>
    ) : null}
    </div>
  );
}
export default Two;
