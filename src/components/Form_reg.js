import "../styles/Form_reg.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import path from "../path";

function Form_reg(props) {
  const id_coded = props.id_coded;
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [room, setRoom] = useState(props.room);
  const [error, setError] = useState("");
  const [sendingForm, setSendingForm] = useState(false);
  const [info, setInfo] = useState(false);
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios
      .get(path + `/room/${id_coded}`)
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  return (
    <div className="main_div_buttons" key={"main_form_div"}>
      {info ? (
        <>
          <div className="alert_div">
            <span className="closebtn" onClick={() => setInfo(false)}>
              &times;
            </span>
            Для того щоб зареєструвати кімнату потрібно: <br />
            1) Кожному мешканцю заповнити відповідне ліжко.
            <br />
            2) комусь із кімнати (разом з іншими мешканцями) заповнити загальну
            частину.
          </div>
        </>
      ) : (
        <></>
      )}

      {sendingForm ? (
        <>
          <div className="loading_card">
            Зачекайте, ми обробляємо вашу відповідь...
          </div>
        </>
      ) : (
        <>
          <form key="submit_form">
            <button
              disabled={room.verified[0]}
              className="form_button_nav"
              key="button_users_0"
              onClick={() => {
                routeChange("general");
              }}
            >
              Загальне{" "}
              {room.verified[0] ? (
                <label style={{ color: "#4e8533", marginLeft: "5px" }}>
                  <strong>✓</strong>
                </label>
              ) : (
                <label style={{ color: "#ee6363", marginLeft: "5px" }}>
                  <strong>✗</strong>
                </label>
              )}
            </button>
            <button
              disabled={room.verified[1]}
              className="form_button_nav"
              key="button_users_1"
              onClick={() => routeChange("one")}
            >
              Одноповерхове ліжко{" "}
              {room.verified[1] ? (
                <label style={{ color: "#4e8533", marginLeft: "5px" }}>
                  <strong>✓</strong>
                </label>
              ) : (
                <label style={{ color: "#ee6363", marginLeft: "5px" }}>
                  <strong>✗</strong>
                </label>
              )}
            </button>
            <button
              disabled={room.verified[2]}
              className="form_button_nav"
              key="button_users_2"
              onClick={() => routeChange("two")}
            >
              Двоповерхове ліжко (1 поверх){" "}
              {room.verified[2] ? (
                <label style={{ color: "#4e8533", marginLeft: "5px" }}>
                  <strong>✓</strong>
                </label>
              ) : (
                <label style={{ color: "#ee6363", marginLeft: "5px" }}>
                  <strong>✗</strong>
                </label>
              )}
            </button>
            <button
              disabled={room.verified[3]}
              className="form_button_nav"
              key="button_users_3"
              onClick={() => routeChange("two2")}
            >
              Двоповерхове ліжко (2 поверх){" "}
              {room.verified[3] ? (
                <label style={{ color: "#4e8533", marginLeft: "5px" }}>
                  <strong>✓</strong>
                </label>
              ) : (
                <label style={{ color: "#ee6363", marginLeft: "5px" }}>
                  <strong>✗</strong>
                </label>
              )}
            </button>
          </form>
          <div className="w-100 text-center mt-3">
            <Link
              style={{
                color: "black",
                fontFamily: "Montserrat Medium 500",
                marginTop: "40px",
                fontSize: "16px",
              }}
              onClick={() => {
                setInfo(true);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }}
            >
              Що робити?
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
export default Form_reg;
