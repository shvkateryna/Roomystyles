import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/navnew.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { fetcher } from "../services/ApiService";

export default function NavBar(props) {
  const [isActive, setActive] = useState(false);
  let navigate = useNavigate();

  const [showModal, setShowModal] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const handleClose = () => {
    setShowModal("");
  };

  const download = function (data) {
    const encoding = "UTF-8";

    const blob = new Blob([new TextEncoder(encoding).encode(data)], {
      type: "text/csv;charset=" + encoding,
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "download.csv");

    a.click();
  };
  let handleClick = () => {
    navigate("/");
  };

  const clearReport = (e) => {
    fetcher({ url: "clear_report", token: cookies.token, type: "post" })
      .then((data) => {})
      .catch((err) => {});
  };
  const downladReport = (e) => {
    fetcher({ url: "download_report", token: cookies.token, type: "post" })
      .then((data) => {
        const columns = [
          "Номер кімнати",
          "Дата заселення",
          "Дата виселення",
          "Ім'я",
          "Вхідні двері",
          "Плінтус",
          "Шафа",
          "Холодильник",
          "Стіни передпокою",
          "Стеля передпокою",
          "Підлога передпокою",
          "Шухляди під ліжками",
          "Шафи біля ліжок",
          "Вікна",
          "Столи та шухляди",
          "Лампи",
          "Стільці",
          "Шафи для одягу",
          "Стіни спальні",
          "Стеля спальні",
          "Підлога спальні",
          "Батарея",
          "Вимикачі та розетки",
          "Двері до вбиральні",
          "Умивальник",
          "Дзеркало",
          "Душова кабінка (ванна)",
          "Рушникосушка",
          "Смітник",
          "Унітаз",
          "Шафа над унітазом",
          "Плитка",
          "Одноповерхове ліжко",
          "Матрац одн. ліжка (верх)",
          "Матрац одн. ліжка (низ)",
          "Наматрацник одн. ліжка (верх)",
          "Наматрасник одн. ліжка (низ)",
          "Cтіни одн. ліжка",
          "Двоповерхове ліжко (1 поверх)",
          "Матрац двоповерх. ліжка (верх 1 поверх)",
          "Матрац двоповерх. ліжка (низ 1 поверх)",
          "Наматрацник двоповерх. ліжка (верх 1 поверх)",
          "Наматрацник двоповерх. ліжка (низ 1 поверх)",
          "Cтіни двоповерх. ліжка (1 поверх)",
          "Двоповерхове ліжко (2 поверх)",
          "Матрац двоповерх. ліжка (верх 2 поверх)",
          "Матрац двоповерх. ліжка (низ 2 поверх)",
          "Наматрацник двоповерх. ліжка (верх 2 поверх)",
          "Наматрацник двоповерх. ліжка (низ 2 поверх)",
          "Cтіни двоповерх. ліжка (2 поверх)",
        ];

        let data_lines = "";
        for (let row of data["data"]["rows"]) {
          let dict_col = {
            "Вхідні двері": "-",
            Плінтус: "-",
            Шафа: "-",
            Холодильник: "-",
            "Стіни передпокою": "-",
            "Стеля передпокою": "-",
            "Підлога передпокою": "-",
            "Шухляди під ліжками": "-",
            "Шафи біля ліжок": "-",
            Вікна: "-",
            "Столи та шухляди": "-",
            Лампи: "-",
            Стільці: "-",
            "Шафи для одягу": "-",
            "Стіни спальні": "-",
            "Стеля спальні": "-",
            "Підлога спальні": "-",
            Батарея: "-",
            "Вимикачі та розетки": "-",
            "Двері до вбиральні": "-",
            Умивальник: "-",
            Дзеркало: "-",
            "Душова кабінка (ванна)": "-",
            Рушникосушка: "-",
            Смітник: "-",
            Унітаз: "-",
            "Шафа над унітазом": "-",
            Плитка: "-",
            "Одноповерхове ліжко": "-",
            "Матрац одн. ліжка (верх)": "-",
            "Матрац одн. ліжка (низ)": "-",
            "Наматрацник одн. ліжка (верх)": "-",
            "Наматрасник одн. ліжка (низ)": "-",
            "Cтіни одн. ліжка": "-",
            "Двоповерхове ліжко (1 поверх)": "-",
            "Матрац двоповерх. ліжка (верх, 1 поверх)": "-",
            "Матрац двоповерх. ліжка (низ, 1 поверх)": "-",
            "Наматрацник двоповерх. ліжка (верх, 1 поверх)": "-",
            "Наматрацник двоповерх. ліжка (низ, 1 поверх)": "-",
            "Cтіни двоповерх. ліжка (1 поверх)": "-",
            "Двоповерхове ліжко (2 поверх)": "-",
            "Матрац двоповерх. ліжка (верх, 2 поверх)": "-",
            "Матрац двоповерх. ліжка (низ, 2 поверх)": "-",
            "Наматрацник двоповерх. ліжка (верх, 2 поверх)": "-",
            "Наматрацник двоповерх. ліжка (низ, 2 поверх)": "-",
            "Cтіни двоповерх. ліжка (2 поверх)": "-",
          };
          for (let property of row) {
            if (typeof property === "object") {
              if (property.description === undefined) {
                dict_col[property.type_expanded] = "-";
              } else {
                let images = "";
                for (let i = 0; i < property.images.length; i++) {
                  images += "" + property.images[i].slice(0, -16) + "     ";
                }

                dict_col[property.type_expanded] =
                  property.description.replace(
                    /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
                    ""
                  ) +
                  " " +
                  images;
              }
            }
          }

          let own_data = row.slice(0, 4).join(",");
          let values = Object.values(dict_col).join(",");
          data_lines = data_lines + own_data + "," + values + "\n";
        }
        download(columns.join(",") + "\n" + data_lines);
      })
      .catch((err) => {});
  };

  const handleShow = () => {
    setShowModal("download");
  };

  const handleShow1 = () => {
    setShowModal("clear");
  };

  const navigateAdmin = () => {
    window.location.href = "/manager";
  };

  const navigateRooms = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div
        className={`modal ${showModal == "download" ? "show" : ""}`}
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
                Завантажити звіт
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Завантажити звіт?</p>
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
                  downladReport();
                  handleClose();
                }}
              >
                Завантажити
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal ${showModal == "clear" ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal == "clear" ? "block" : "none" }}
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
                Очистити звіт
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Очистити звіт?</p>
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
                  clearReport();
                  handleClose();
                }}
              >
                Очистити
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar_m">
        <div className="navbarbrand-title" onClick={handleClick}>
          RooMy
        </div>
        <div className={isActive ? "navbaroptions active" : "navbaroptions"}>
          {props.role === "ADMIN" ? (
            <>
            <div id="navoption">
                <span
                  onClick={() => {
                    handleShow1();
                  }}
                >
                  {" "}
                  Очистити звіт{" "}
                </span>
              </div>
            
              <div id="navoption" className="download_nav">
                <span
                  onClick={() => {
                    handleShow();
                  }}
                >
                  Завантажити звіт
                </span>
              </div>

              <div id="navoption">
                <span
                  onClick={() => {
                    navigateAdmin();
                  }}
                >
                  {" "}
                  Додати куратора{" "}
                </span>
              </div>

              <div id="navoption">
                <span
                  onClick={() => {
                    navigateRooms();
                  }}
                >
                  {" "}
                  Кімнати{" "}
                </span>
              </div>
              
            </>
          ) : (
            <></>
          )}

          <div styles={"margin-left: 100px"} id="navoption">
            <span
              onClick={() => {
                removeCookie("token");
                window.location.href = "/login";
              }}
            >
              {" "}
              Вийти{" "}
            </span>
          </div>
        </div>
        <div id="mobile" onClick={() => setActive(!isActive)}>
          {isActive ? (
            <>
              <i class="fa-solid fa-xmark"></i>
            </>
          ) : (
            <>
              <i className="fas fa-bars"></i>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
