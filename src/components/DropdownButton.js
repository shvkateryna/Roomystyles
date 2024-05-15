import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts"
import axios from 'axios';
import "../styles/DropdownButton.css" // You can create your own styles or use inline styles
import path from "../path"
const DropdownButton = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth()
  const { role } = useAuth()
  const [showModal, setShowModal] = useState(false);
  const [showModalСlear, setShowModalСlear] = useState(false);
  const handleClose = () => {
    setShowModal(false);
    setShowModalСlear(false)
  }
  const clearReport = () =>{
    // axios.post(path+"/clear_report")
  }
  const handleShow = () => {
    setShowModal(true)
  };
  const combinedFunctions = () => {
    handleShow();
  }
  const combinedFunctionClear = () => {
    setShowModalСlear(true)
  }
  const routeChange = (path) => {
    navigate("/" + path);
  }
  let navigate = useNavigate();
  const handleOptionSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };
  const download = function (data) {

    // Creating a Blob for having a csv file format 
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv' });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)

    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a')

    // Passing the blob downloading url 
    a.setAttribute('href', url)

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'download.csv');

    // Performing a download with click
    a.click()
  }
  const downladReport = (e) => {

    axios.post(path+"/download_report").then(data => {

      const columns = ["Номер кімнати", "Дата заселення", "Дата виселення", "Ім'я", 'Вхідні двері', 'Плінтус', 'Шафа', 'Холодильник', 'Стіни передпокою', "Стеля передпокою", "Підлога передпокою", 'Шухляди під ліжками', 'Шафи біля ліжок', 'Вікна', 'Столи та шухляди', 'Лампи', 'Стільці', 'Шафи для одягу', "Стіни спальні",
        "Стеля спальні", "Підлога спальні","Батарея","Вимикачі та розетки", "Двері до вбиральні", "Умивальник", "Дзеркало", "Душова кабінка (ванна)", "Рушникосушка", "Смітник", "Унітаз", "Шафа над унітазом", "Плитка", "Одноповерхове ліжко", "Матрац одн. ліжка (верх)", "Матрац одн. ліжка (низ)", "Наматрацник одн. ліжка (верх)", "Наматрасник одн. ліжка (низ)", "Cтіни одн. ліжка", "Двоповерхове ліжко (1 поверх)", "Матрац двоповерх. ліжка (верх 1 поверх)", "Матрац двоповерх. ліжка (низ 1 поверх)", "Наматрацник двоповерх. ліжка (верх 1 поверх)", "Наматрацник двоповерх. ліжка (низ 1 поверх)", "Cтіни двоповерх. ліжка (1 поверх)", "Двоповерхове ліжко (2 поверх)",
        "Матрац двоповерх. ліжка (верх 2 поверх)", "Матрац двоповерх. ліжка (низ 2 поверх)", "Наматрацник двоповерх. ліжка (верх 2 поверх)", "Наматрацник двоповерх. ліжка (низ 2 поверх)", "Cтіни двоповерх. ліжка (2 поверх)"]
      // console.log(columns.length)
      // console.log("test test test")

      // columns_data = columns 


      // const test = data["data"]["rows"]
      // console.log(data["data"]["rows"])
      let data_lines = ""
      // console.log("yest")

      // console.log(data["data"]["rows"])
      for (let row of data["data"]["rows"]) {
        let dict_col = {
            'Вхідні двері': "-", 'Плінтус': "-", 'Шафа': "-", 'Холодильник': "-", 'Стіни передпокою': "-", "Стеля передпокою": "-", "Підлога передпокою": "-", 'Шухляди під ліжками': "-", 'Шафи біля ліжок': "-", 'Вікна': "-", 'Столи та шухляди': "-", 'Лампи': "-", 'Стільці': "-", 'Шафи для одягу': "-", "Стіни спальні": "-",
          "Стеля спальні": "-", "Підлога спальні": "-","Батарея": "-","Вимикачі та розетки": "-", "Двері до вбиральні": "-", "Умивальник": "-", "Дзеркало": "-", "Душова кабінка (ванна)": "-", "Рушникосушка": "-", "Смітник": "-", "Унітаз": "-", "Шафа над унітазом": "-", "Плитка": "-", "Одноповерхове ліжко": "-", "Матрац одн. ліжка (верх)": "-", "Матрац одн. ліжка (низ)": "-", "Наматрацник одн. ліжка (верх)": "-", "Наматрасник одн. ліжка (низ)": "-", "Cтіни одн. ліжка": "-", "Двоповерхове ліжко (1 поверх)": "-", "Матрац двоповерх. ліжка (верх, 1 поверх)": "-", "Матрац двоповерх. ліжка (низ, 1 поверх)": "-", "Наматрацник двоповерх. ліжка (верх, 1 поверх)": "-", "Наматрацник двоповерх. ліжка (низ, 1 поверх)": "-", "Cтіни двоповерх. ліжка (1 поверх)": "-", "Двоповерхове ліжко (2 поверх)": "-",
          "Матрац двоповерх. ліжка (верх, 2 поверх)": "-", "Матрац двоповерх. ліжка (низ, 2 поверх)": "-", "Наматрацник двоповерх. ліжка (верх, 2 поверх)": "-", "Наматрацник двоповерх. ліжка (низ, 2 поверх)": "-", "Cтіни двоповерх. ліжка (2 поверх)": "-"
        }

          // console.log(line)
          // console.log(row)

          for (let property of row) {
            // console.log("test")
            // console.log(property)

            if (typeof property === "object") {
              // сonsole.log("test")
              // console.log(property.type_expanded)
              // console.log("test")
              // console.log(line.length)
              // console.log(property.type_expanded)

            // console.log(columns.indexOf(property.type_expanded))
            if (property.description === undefined) {
              dict_col[property.type_expanded] = "-"
            } else {
              // console.log(property.type_expanded)
              // console.log(property.images)
              let images = ""
              for (let i = 0; i < property.images.length; i++) {
                images += '' + property.images[i].slice(0, -16) + '     '
              }

              dict_col[property.type_expanded] = property.description.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") + ' ' + images
            }


          }
        }
        // console.log(data_lines)
        // console.log("data_lines")

        let own_data = row.slice(0, 4).join(",")
        let values = Object.values(dict_col).join(",")
        data_lines = data_lines + own_data + "," + values + "\n"
      }
      // let csv_data = data["data"]["rows"].map(e => e.join(",")).join("\n");
      // console.log(csv_data)
      // csv_data = columns.join(",").concat("\n").concat(csv_data)
      download(columns.join(",") + "\n" + data_lines)

    })
      .catch(err => console.log(err))
  }

  const LogOut = async function () {
    await logout();
    navigate("/")
    if (role === null) {
      alert('Success! No user is logged in anymore!');
    }
    return true;
  };

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        Меню для куратора
      </button>
      <div
        className={`modal ${showModal ? 'show' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 style={{ fontFamily: 'Montserrat Medium 500', fontSize: '18px' }}>Завантажити звіт</h5>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Завантажити звіт?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="discard_button" onClick={handleClose}>
                Скасувати
              </button>
              <button type="button" className="confirm_button" onClick={() => { downladReport(); handleClose() }}>
                Завантажити
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal ${showModalСlear ? 'show' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModalСlear ? 'block' : 'none' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 style={{ fontFamily: 'Montserrat Medium 500', fontSize: '18px' }}>Очистити звіт</h5>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Очистити звіт?</p>
              <p>Рекомендуємо завантажити копію перед тим як очищати.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="discard_button" onClick={handleClose}>
                Скасувати
              </button>
              <button type="button" className="confirm_button" onClick={() => { 
                // clearReport();
                 handleClose() }}>
                Очистити
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {role === 'ADMIN' ? (
            <div>
              <label className='role'><strong>Адміністратор</strong></label>
              <hr></hr>
            </div>
          ) : <></>}
          {role === 'USER' ? (
            <div>
              <label className='role'><strong>Куратор</strong></label>
              <hr></hr>
            </div>
          ) : <></>}
          {role === null ? (
            <></>
          ) : <></>}
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionSelect(option)}
            >
              {option === 'Увійти' ? (
                <li onClick={() => routeChange("login")}>{option}</li>
              ) : (
                <></>
              )}
              {option === 'Кімнати' ? (
                <li onClick={() => routeChange("rooms_curator")}>{option}</li>
              ) : (
                <></>
              )}
              {option === 'Додати куратора' ? (
                <li onClick={() => routeChange("manager")}>{option}</li>
              ) : (
                <></>
              )}
              {option === 'Завантажити звіт' ? (
                <li onClick={combinedFunctions}>{option}</li>
              ) : (
                <></>
              )}
              {option === 'Очистити звіт' ? (
                <li onClick={combinedFunctionClear}>{option}</li>
              ) : (
                <></>
              )}
              {option === 'Вийти' ? (
                <li onClick={LogOut}>{option}</li>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
