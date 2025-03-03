import "../styles/Form_reg.css";
import "react-slideshow-image/dist/styles.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import path from "../path";
import trash_logo from "../assets/trash.png";
import arrow_image from "../assets/arrow.png";
import Slider from "react-slick";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
function General(props) {
  const id_coded = props.id_coded;
  const [room, setRoom] = useState(props.room);
  const [ruleAccepted, setRuleAccepted] = useState(false);
  const [errorFurniture, setErrorFurniture] = useState("");
  const [showError, setShowError] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);
  const [stageCounter, setStageCounter] = useState(0);
  const [imageCounter, setImageCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

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
    initialSlide: 1,
  };
  const room_type = ["Передпокій", "Спальня", "Вбиральня", "Підтвердження"];
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
      maxSizeMB: 0.03,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(image, options);
    return compressedFile;
  }
  const handleChangeRoomFile = async (index_block, index, option, value) => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
    let compressedFiles = [];
    for (var i = 0; i < value.length; i++) {
      compressedFiles.push(await shrinkImage(value[i]));
    }
    let new_list = room.furniture_list;
    let obj = room.furniture_list[index_block];
    obj[index][option] = compressedFiles;
    new_list[index_block] = obj;

    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
    setLoadingStates(prev => ({ ...prev, [index]: false }));
  };
  const handleChangeRoom = async (index_block, index, option, value) => {
    let new_list = room.furniture_list;
    let obj = room.furniture_list[index_block];
    obj[index][option] = value;
    new_list[index_block] = obj;

    setRoom((prev) => ({ ...prev, furniture_list: new_list }));
  };


  const previous_stage = (e) => {
    e.preventDefault();
    if (stageCounter > 0) {
      setStageCounter(stageCounter - 1);
    }
    document.documentElement.scrollIntoView({ behavior: "smooth" });
  };

  const next_stage = (e) => {
    e.preventDefault();
    for (let elem of room.furniture_list[stageCounter]) {
      if ((elem.description === null) | (elem.description === "")) {
        setAlertVisible(true)
        setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'")
        setSendingForm(false);
        return null;
      }
    }
    if (stageCounter < 3) {
      setStageCounter(stageCounter + 1);
    }
    document.documentElement.scrollIntoView({ behavior: "smooth" });
  };
  const handle_post = async (e) => {
    e.preventDefault();
  
    setSendingForm(true);
    
    handleChangeFilled(0);
    let new_furniture_list = [];
    let totalImages = 0;

    // Count total images for progress calculation
    for (let i = 0; i < 3; i++) {
      for (let furnit of room.furniture_list[i]) {
        if (furnit.images !== null) {
          totalImages += furnit.images.length;
        }
      }
    }

    let uploadedImages = 0;
    for (let j = 0; j < 3; j++) {
      for (let furnit of room.furniture_list[j]) {
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
    }

    setRoom((prev) => ({ ...prev, furniture_list: new_furniture_list }));
    axios.post(path + `/room/${id_coded}/submit/0`, room).then((res) => {
      setSuccessVisible(true); // Show success alert
      setTimeout(() => {
        routeChange("/rooms/" + id_coded);
      }, 3000); // Redirect after 2 seconds to allow user to see the success alert
    });
  };
  function check_url(slideImage) {
    if (typeof slideImage != "string") {
      return URL.createObjectURL(slideImage);
    } else {
      return (
        "https://drive.google.com/thumbnail?id=" +
        extractValue(slideImage) +
        "&sz=w1000"
      );
      // return slideImage;
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
            <>
              <div class="main">
                <ul className="stage_wrapper">
                  <li>
                    <i class="icons awesome fa-solid fa-house"></i>
                    <div
                      className={
                        stageCounter >= 1 ? "step first active" : "step first"
                      }
                    >
                      <p>1</p>
                      <i class="awesome fa-solid fa-check"></i>
                    </div>
                    <p class="label">{room_type[0]}</p>
                  </li>
                  <li>
                    <i class="icons awesome fa-solid fa-bed"></i>
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
                    <i class="icons awesome fa-solid fa-bath"></i>
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
                    <i class="icons awesome fa-regular fa-check-square"></i>
                    <div class="step fourth">
                      <p>4</p>
                      <i class="awesome fa-solid fa-check"></i>
                    </div>
                    <p class="label">Підтвердження</p>
                  </li>
                </ul>
              </div>
            </>
          

          <div className="main_div" key={"main_form_div"}>
            <form id={`element_${4}`} className="main_form" key="submit_form">
              <div className="furniture_list" key="furniture_div">
                
                {alertVisible && (
                  <div className="alert" style={alertStyle}>
                    <span>{errorFurniture}</span>
                    <button style={closeButtonStyle} onClick={() => setAlertVisible(false)}>×</button>
                  </div>
                )}
                 
                {rooms.map((my_room, index_room) => (
                  <>
                    {index_room === stageCounter ? (
                      <>
                        <div id={`element_${index_room}`} className="room_type">
                          {room_type[index_room]}
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
                                  className="questions-text"
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
                                onChange={(e) => handleChangeRoom(index_room, index, "description", e.target.value)}
                                value={my_room[index].description}
                                key={`div_inp_${index_room}_${index}_${ele.type_expanded}`}
                                type="text"
                                placeholder={"Опишіть стан (до 150 символів)"}
                                maxLength={150}
                              />

                          <div
                            key={`div_image_${index_room}_${index}_${ele.type_expanded}`}
                            className="file_div"
                          >
                            <label htmlFor={`file-input-${index_room}-${index}-${ele.type_expanded}`} className="images-button">
                              {loadingStates[index] ? "Зачекайте..." : "Додати фото"}
                            </label>
                            <input
                              id={`file-input-${index_room}-${index}-${ele.type_expanded}`}
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
                              style={{display: 'none'}}
                            />
                            <div
                              className="clear_images"
                              onClick={() => {
                                handleChangeRoomFile(index_room, index, "images", []);
                              }}
                            >
                              <img className="trash_logo" src={trash_logo} alt="Clear images" />
                            </div>
                          </div>
                              {/* </div> */}
                              
                              
                              {ele.images.length != 0 ? (
                                <>
                                {loading ? (
                                  <div className="loader_block">
                                    <div className="loader"></div>
                                  </div>
                                ) : (
                                <></>)}
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

                      <div class="results_wrapper">
                        <p className="send-text">
                          Я ознайомився / -лася з правилами та <br />{" "}
                          підтверджую, що вся надана інформація достовірна.
                          <input
                            style={{
                              height: "16px",
                              width: "16px",
                              marginLeft: "10px",
                            }}
                            key="check_rules"
                            type="checkbox"
                            checked={ruleAccepted}
                            onChange={() => setRuleAccepted(!ruleAccepted)}
                          />
                        </p>
                        
                      </div>
                    </div>
                  </div>
                  <div className="next_stage_wrapper">
                        <button
                        className="form_button_next_step"
                        onClick={previous_stage}
                      >
                        <img className="arrow_back" src={arrow_image} /> {room_type[stageCounter - 1]}
                      </button>
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
                  </>
                ) : (
                  <>
                    <div className="next_stage_wrapper">
                    {stageCounter > 0 ? (
                      <>
                        <button
                        className="form_button_next_step"
                        onClick={previous_stage}
                      >
                        <img className="arrow_back" src={arrow_image} /> {room_type[stageCounter - 1]}
                      </button>
                      </>
                    ) : (
                    <></>)}
                    <div className="current-room">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    {room_type[stageCounter]}
                    </div>
                      <button
                        className="form_button_next_step"
                        onClick={next_stage}
                      >
                        {room_type[stageCounter + 1]} <img className="arrow" src={arrow_image} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
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
