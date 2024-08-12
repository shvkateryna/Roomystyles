import "../styles/Form_reg.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import path from "../path";
import Slider from "react-slick";
import trash_logo from "../assets/trash.png";
function One(props) {
  const id_coded = props.id_coded;
  const [room, setRoom] = useState(props.room);
  const [ruleAccepted, setRuleAccepted] = useState(false);
  const [errorFurniture, setErrorFurniture] = useState("");
  const [sendingForm, setSendingForm] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const new_block = room.furniture_list[3];
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
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
    padding: '2%',
    width: '70%',
    marginBottom: '10px',
    zIndex: 1000,
    fontFamily: 'Lexend, sans-serif',
    fontSize: '12px',
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
  const settings = {
    lazyLoad: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
  };
  async function upload_google_drive(file) {
    let url =
      "https://script.google.com/macros/s/AKfycbxZ3S11M9zGUvVYxdwql8bu5JYgP9JwDT4H1n5J-526IpDVZblaRAqj04BWQdIzGUhe/exec";
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
  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
  });
  const handleChangeUser = (index, value) => {
    let users = room.names;
    users[index] = value;
    setRoom((prev) => ({ ...prev, names: users }));
  };
  const handleChangeStartDate = (index, value) => {
    let users_dates = room.start_dates;
    users_dates[index] = value;
    setRoom((prev) => ({ ...prev, start_dates: users_dates }));
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
  const handleChangeRoom = (index_block, index, option, value) => {
    let obj = room.furniture_list[index_block];
    obj[index][option] = value;
    let new_list = room.furniture_list;
    new_list[index_block] = obj;
    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
  };
  const handleChangeFilled = (index) => {
    let filled = room.filled_form;
    filled[index] = true;
    setRoom((prev) => ({ ...prev, filled_form: filled }));
  };
  async function shrinkImage(image) {
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(image, options);
    return compressedFile;
  }
  function extractValue(input) {
    const startIndex = input.indexOf("=") + 1; // Find the index of the first "="
    if (startIndex === 0) return null; // If "=" is not found, return null
    const endIndex = input.indexOf("&", startIndex); // Find the index of the first "&" after the "="
    if (endIndex === -1) return input.substring(startIndex); // If "&" is not found, return the substring from "=" to the end
    return input.substring(startIndex, endIndex); // Return the substring between "=" and "&"
  }
  const handle_post = async (e) => {
    e.preventDefault();
    if (room.names[0] === "") {
      setAlertVisible(true)
      setErrorFurniture("Немає імені мешканця");
      setSendingForm(false);
      return;
    }
    if (room.start_dates[0] === "") {
      setAlertVisible(true)
      setErrorFurniture("Немає дати");
      setSendingForm(false);
      return;
    }
    for (let elem of room.furniture_list[3]) {
      if ((elem.description === null) | (elem.description === "")) {
        setAlertVisible(true)
        setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'");
        setSendingForm(false);
        return;
      }
    }
    setSendingForm(true);
    handleChangeFilled(1);
    let new_furniture_list = [];
    for (let furnit of room.furniture_list[3]) {
      if (furnit.images !== null) {
        let links = [];
        for (let file of furnit.images) {
          if (typeof file != "string") {
            console.log(file)
            const link = await upload_google_drive(file);

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
    axios.post(path + `/room/${id_coded}/submit/3`, room).then((res) => {
      routeChange("/rooms/" + id_coded);
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
          <div className="sending_form">
            <span>Зачекайте, ми обробляємо Вашу відповідь...</span>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="room_type_header">
              <strong>Одноповерхове ліжко</strong>
            </div>
            <div className="main_div" key={"main_form_div"}>
              <form className="main_form" key="submit_form">
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

                  <label className="text_header" key={"user_label_1"}>
                    <div>Ім'я та прізвище мешканця </div>
                  </label>
                  <input
                    placeholder="Введіть ім'я та прізвище"
                    className="user_input"
                    type="text"
                    key={"inp_user_" + 0}
                    onChange={(e) => handleChangeUser(0, e.target.value)}
                    value={room.names[0]}
                  />
                  <label className="text_header" key={"user_label_2"}>
                    <div>Дата поселення</div>
                  </label>
                  <input
                    placeholder="ДД/ММ/PP"
                    className="user_input"
                    type="date"
                    key={"inp_user_" + 0}
                    onChange={(e) => handleChangeStartDate(0, e.target.value)}
                    value={room.start_dates[0]}
                  />
                  <br></br>
                  {new_block.map((ele, index) => (
                    <>
                      <div
                        key={"div_" + index + "" + 3}
                        className="furniture_block"
                      >
                        <div className="horizontal_line_separator"></div>

                        <div
                          key={"div_header_" + index + "" + 3}
                          className="header_furniture"
                        >
                          <div
                            key={"que_body_" + index + "" + 3}
                            className="text_header"
                          >
                            <div key={"strong_" + index + "" + 3}>
                              {index + 1 + ")    "} {ele.type_expanded}
                              <br />
                            </div>
                          </div>
                          <div
                            className="questions-text"
                          >
                            {ele.questions}
                          </div>
                        </div>
                        <div
                          key={"div_body_" + index + "" + 3}
                          className="body_furniture"
                        >
                          {ele.type === "bed" ? (
                            <div key={"div_select_" + index + "" + 3}></div>
                          ) : (
                            <></>
                          )}
                          <textarea
                            className="obj_description"
                            onChange={(e) =>
                              handleChangeRoom(
                                3,
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            value={room.furniture_list[3][index].description}
                            key={"inp_" + index + "" + 3}
                            type="text"
                            placeholder={"Опишіть стан (до 150 символів)"}
                            maxLength={150}
                          />
                          <div
                            key={"div_image" + index + "" + 3}
                            className="file_div"
                          >
                            <input
                              key={"input_image" + index + "" + 3}
                              className="file_input"
                              type="file"
                              multiple
                              onChange={(event) => {
                                handleChangeRoomFile(
                                  3,
                                  index,
                                  "images",
                                  Array.from(event.target.files)
                                );
                              }}
                            ></input>
                            <div
                              className="clear_images"
                              onClick={() => {
                                handleChangeRoomFile(3, index, "images", []);
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
                      </div>
                    </>
                  ))}

                  <div className="submit_align_wrapper">
                    <br />
                    <div style={{paddingLeft: "20px", fontSize: "16px" }}>
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
                      <p style={{ paddingLeft: "20px", fontSize: "16px" }}>
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
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default One;
