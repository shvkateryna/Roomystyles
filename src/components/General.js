import "../styles/Form_reg.css";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import path from "../path";
// import logo_copy from "../assets/upload-image-icon.png"
import trash_logo from "../assets/trash.png";
import arrow_image from "../assets/arrow.png";
import tick_icon from "../assets/tick-icon.png";
import Slider from "react-slick";
function General(props) {
  const id_coded = props.id_coded;
  const [room, setRoom] = useState(props.room);
  const [ruleAccepted, setRuleAccepted] = useState(false);
  const [errorFurniture, setErrorFurniture] = useState("");
  const [sendingForm, setSendingForm] = useState(false);
  const [stageCounter, setStageCounter] = useState(0);

  const rooms = [
    room.furniture_list[0],
    room.furniture_list[1],
    room.furniture_list[2],
  ];
  const settings = {
    lazyLoad: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1
  };
  const room_type = ["Передпокій", "Спальня", "Вбиральня"];
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  const handleClick = (index) => {
    const element = document.getElementById(`element_${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
  });
  async function upload_google_drive(file) {
    let url =
      "https://script.google.com/macros/s/AKfycbzzUASeCpfNN5Z9nv4H21rq3p3KcH8lSm5-HDBxay0EpJIeZ18T_XF1s090Ki_o9Ga2hg/exec";
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      let responce = "test";
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        var base64data = reader.result;
        // console.log(base64data)

        // This line sets the "src" attribute of the "img" element to the value of "res"
        // This line splits the "res" variable into an array, using the string "base64," as the separator, and assigns the second element to a variable called "spt"
        let spt = base64data.split("base64,")[1];
        // This line creates an object called "obj" with three properties: "base64", "type", and "name"
        let obj = {
          base64: spt,
          type: file.type,
          name: file.name,
        };
        // console.log(obj)
        // This line sends a POST request to the URL specified in the "url" variable, with the "obj" object as the request body
        fetch(url, {
          method: "POST",
          body: JSON.stringify(obj),
        })
          // This line waits for the response from the server and converts it to text
          .then((r) => r.text())
          // This line logs the response data to the console
          .then((data) => {
            resolve(data);
          });
      };
    });
  }
  const handleChangeFilled = (index) => {
    let filled = room.filled_form;
    filled[index] = true;
    setRoom((prev) => ({ ...prev, filled_form: filled }));
  };

  function extractValue(input) {
    const startIndex = input.indexOf("=") + 1; // Find the index of the first "="
    if (startIndex === 0) return null; // If "=" is not found, return null
    const endIndex = input.indexOf("&", startIndex); // Find the index of the first "&" after the "="
    if (endIndex === -1) return input.substring(startIndex); // If "&" is not found, return the substring from "=" to the end
    return input.substring(startIndex, endIndex); // Return the substring between "=" and "&"
  }


  async function shrinkImage(image) {
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(image, options);
    return compressedFile;
  }
  const handleChangeRoomFile = async (index_block, index, option, value) => {
    let compressedFiles = [];
    for (var i = 0; i < value.length; i++) {
      compressedFiles.push(await shrinkImage(value[i]));
    }
    let new_list = room.furniture_list;
    let obj = room.furniture_list[index_block];
    obj[index][option] = compressedFiles;
    new_list[index_block] = obj;

    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
  };
  const handleChangeRoom = async (index_block, index, option, value) => {
    let new_list = room.furniture_list;
    let obj = room.furniture_list[index_block];
    obj[index][option] = value;
    new_list[index_block] = obj;

    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
  };

  const next_stage = (e) => {
    e.preventDefault();

    for (let elem of room.furniture_list[stageCounter]) {
      if ((elem.description === null) | (elem.description === "")) {
        setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'.");
        handleClick(4);
        setSendingForm(false);
        return null;
      }
    }
    document.documentElement.scrollIntoView({behavior: "smooth" });

    setStageCounter(stageCounter + 1);
  };
  const handle_post = async (e) => {
    e.preventDefault();
    for (let i = 0; i < 3; i++) {
      for (let elem of room.furniture_list[i]) {
        if ((elem.description === null) | (elem.description === "")) {
          setErrorFurniture(
            "Немає опису об'єкту '" + elem.type_expanded + "'."
          );
          handleClick(4);
          setSendingForm(false);
          return null;
        }
      }
    }
    setSendingForm(true);
    handleChangeFilled(0);
    let new_furniture_list = [];
    for (let j = 0; j < 3; j++) {
      for (let furnit of room.furniture_list[j]) {
        if (furnit.images !== null) {
          // console.log("images here")
          console.log(furnit.images);
          let links = [];
          for (let file of furnit.images) {
            // console.log(file)
            if (typeof file != "string") {
              const link = await upload_google_drive(file);
              // console.log(link)
              // const res = await uploadFile(file, room.number);
              console.log(links);
              links.push(link);
              // links.push(link)
            } else {
              links.push(file);
            }
          }
          console.log(links);
          furnit.images = links;
          new_furniture_list.push(furnit);
        } else {
          new_furniture_list.push(furnit);
        }
      }
    }

    setRoom((prev) => ({ ...prev, furniture_list: new_furniture_list }));
    console.log(room);
    axios.post(path + `/room/${id_coded}/submit/0`, room).then((res) => {
      routeChange("/rooms/" + id_coded);
    });
  };
  function check_url(slideImage) {
    if (typeof slideImage != "string") {
      return URL.createObjectURL(slideImage);
    } else {
      return "https://drive.google.com/thumbnail?id=" + extractValue(slideImage) + "&sz=w1000"
      // return slideImage;
    }
  }
  return (
    <div>
      {sendingForm ? (
        <>
          <div className="sending_form">
            Зачекайте, ми обробляємо Вашу відповідь...
          </div>
        </>
      ) : (
        <>
          {stageCounter === 0 ? (
            <>
              <div className="greet_big">
                <p>Слава Ісусу Христу!</p>
              </div>

              <div className="greet">
                Ця форма призначена для того, щоб відстежувати стан кімнати. Ви
                повинні детально перевірити й описати недоліки кожного з
                обʼєктів та за потреби сфотографувати їх. Відтак перевірте
                заповнене та натисніть кнопку «Відправити». Зробіть це лише
                тоді, коли ознайомитеся з правилами. Ви матимете змогу
                редагувати форму до того моменту, як її затвердить куратор /
                -ка. Опісля вона стане недоступною.
              </div>

              <div>
                <p className="greet_big">Бажаємо успіху!</p>
              </div>
            </>
          ) : (
            <>
              <div class="main">
                <ul className="stage_wrapper">
                  <li>
                    <i class="icons awesome fa-solid fa-house"></i>
                    <div
                      className={
                        stageCounter >= 1 ? "step second active" : "step first"
                      }
                    >
                      <p>1</p>
                      <i class="awesome fa-solid fa-check"></i>
                    </div>
                    <p class="label">{room_type[0]}</p>
                  </li>
                  <li>
                    <i class="icons awesome fa-solid fa-house"></i>
                    <div
                      className={
                        stageCounter >= 2 ? "step second active" : "step second"
                      }
                    >
                      <p>2</p>
                      <i class="awesome fa-solid fa-check"></i>
                    </div>
                    <p class="label">{room_type[1]}</p>
                  </li>
                  <li>
                    <i class="icons awesome fa-solid fa-house"></i>
                    <div
                      className={
                        stageCounter >= 3 ? "step third active" : "step third"
                      }
                    >
                      <p>3</p>
                      <i class="awesome fa-solid fa-check"></i>
                    </div>
                    <p class="label">{room_type[2]}</p>
                  </li>
                  <li>
                    <i class="icons awesome fa-regular fa-star-half-stroke"></i>
                    <div class="step fourth">
                      <p>4</p>
                      <i class="awesome fa-solid fa-check"></i>
                    </div>
                    <p class="label">Підтвердження</p>
                  </li>
                  {/* <li>
                <i class="icons awesome fa-solid fa-thumbs-up"></i>
                <div class="step fifth">
                  <p>5</p>
                  <i class="awesome fa-solid fa-check"></i>
                </div>
                <p class="label">Approval</p>
              </li> */}
                </ul>
              </div>
            </>
          )}

          {/* <div key={"div_room_info"} className='info'><strong>Навігація</strong></div> */}
          {/* <div className="form_nav_back">
            <div>
              <button
                className="form_button_nav"
                onClick={() => handleClick(0)}
              >
                Передпокій
              </button>
            </div>
            <div>
              <button
                className="form_button_nav"
                onClick={() => handleClick(1)}
              >
                Спальня
              </button>
            </div>
            <div>
              <button
                className="form_button_nav"
                onClick={() => handleClick(2)}
              >
                Вбиральня
              </button>
            </div>
            <div>
              <button
                className="form_button_nav"
                onClick={() => handleClick(3)}
              >
                Відправити
              </button>
            </div>
          </div> */}

          <div className="main_div" key={"main_form_div"}>
            <form id={`element_${4}`} className="main_form" key="submit_form">
              <div className="furniture_list" key="furniture_div">
                {errorFurniture ? (
                  <>
                    <div className="error_block">{errorFurniture}</div>
                  </>
                ) : (
                  <></>
                )}
                {rooms.map((my_room, index_room) => (
                  <>
                    {index_room === stageCounter ? (
                      <>
                        <div id={`element_${index_room}`} className="room_type">
                          <strong>{room_type[index_room]}</strong>
                        </div>
                        {my_room.map((ele, index) => (
                          <>
                            <div
                              key={`div_${index_room}_${index}_${ele.type_expanded}`}
                              className="furniture_block"
                            >
                              <div className="horizontal_line_separator"> </div>
                              <div
                                key={`div_header_${index_room}_${index}_${ele.type_expanded}`}
                                className="header_furniture"
                              >
                                <div
                                  key={`div_body_${index_room}_${index}_${ele.type_expanded}`}
                                  className="text_header"
                                >
                                  <div
                                    key={`div_strong_${index_room}_${index}_${ele.type_expanded}`}
                                  >
                                    {index + 1 + ")    "} {ele.type_expanded}
                                    <br />
                                  </div>
                                </div>
                                <div
                                  style={{
                                    fontSize: "16px",
                                  }}
                                >
                                  {ele.questions}
                                </div>
                              </div>
                              {/* <div
                                key={`div_text_image_${index_room}_${index}_${ele.type_expanded}`}
                                className="obj_input"
                              > */}
                              <textarea
                                className="obj_description"
                                onChange={(e) =>
                                  handleChangeRoom(
                                    index_room,
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                value={my_room[index].description}
                                key={`div_inp_${index_room}_${index}_${ele.type_expanded}`}
                                type="text"
                                placeholder={"Опишіть стан"}
                              />
                              {/* </div> */}
                              <div
                                key={`div_image_${index_room}_${index}_${ele.type_expanded}`}
                                className="file_div"
                              >
                                <input
                                  key={`div_input_image_${index_room}_${index}_${ele.type_expanded}`}
                                  className="file_input"
                                  type="file"
                                  multiple
                                  onChange={(event) => {
                                    handleChangeRoomFile(
                                      index_room,
                                      index,
                                      "images",
                                      Array.from(event.target.files)
                                    );
                                  }}
                                ></input>

                                {/* <img className = "image_upload_logo" src={logo_copy}/> */}
                                <div
                                  className="clear_images"
                                  onClick={() => {
                                    handleChangeRoomFile(
                                      index_room,
                                      index,
                                      "images",
                                      []
                                    );
                                  }}
                                >
                                  <img
                                    className="trash_logo"
                                    src={trash_logo}
                                  />
                                </div>
                              </div>
                              {ele.images.length != 0 ? (
                                <>
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
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ))}

                <br />

                {3 === stageCounter ? (
                  <>
                    <div style={{ fontSize: "16px" }}>
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

                      <div class = "results_wrapper">
                      <p style={{ fontSize: "16px" }}>
                        Я ознайомився / -лася з правилами та <br /> підтверджую, що вся
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
                        id={`element_3`}
                        disabled={!ruleAccepted}
                        className="submit_form"
                        value="Відправити"
                        onClick={handle_post}
                        key="submit_button"
                        type={"submit"}
                      />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="next_stage_wrapper">
                      <p>
                        Перейти до наступного блоку:{" "}
                        <strong>{room_type[stageCounter + 1]}</strong>
                      </p>
                      <button
                        // id={`element_3`}
                        // disabled={!ruleAccepted}
                        className="form_button_next_step"
                        onClick={next_stage}
                      >
                        Перейти <img className="arrow" src={arrow_image} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </>
      )}
      <a
        className="link_author"
        href="https://www.flaticon.com/free-icons/trash-can"
        title="trash can icons"
      >
        Trash can icons created by kliwir art - Flaticon
      </a>
    </div>
  );
}
export default General;
