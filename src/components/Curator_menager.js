import React from "react";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

import { Form, Button, Card, Alert, Container, Navbar } from "react-bootstrap";
import { useCookies } from "react-cookie";
import NavBar  from "./navbarnew";
import { fetcher } from "../services/ApiService";
import "../styles/Curator_manager.css";
const Curator_menager = (props) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [role_new, setRole_new] = useState("");
  const [login_new, setLogin_new] = useState([]);
  const [password_new, setPassword_new] = useState([]);
  const [cookies] = useCookies(["user"]);
  // const { signup } = useAuth()
  const options = [
    { value: "201-218", label: "201-218" },
    { value: "219-234", label: "219-234" },
    { value: "301-318", label: "301-318" },
    { value: "319-334", label: "319-334" },
    { value: "401-418", label: "401-418" },
    { value: "419-434", label: "419-434" },
    { value: "501-518", label: "501-518" },
    { value: "519-534", label: "519-534" },
  ];
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetcher({ url: "curators", token: cookies.token, type: "get" })
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
  }
  const create_new_user = (e) => {
    e.preventDefault();
    if (login_new === "") {
      setError("Логін не може бути пустим.");
      return;
    } else if (password_new === "") {
      setError("Пароль не може бути пустим.");
      return;
    } else if (!checkPassword(password_new)) {
      setError(
        "Пароль в неправильному форматі, він мусить містити принаймні одну маленьку та велику літери, цифру, знак(!@#$%^&*) а довжина повинна бути не менше 8 символів."
      );
      return;
    }
    let rooms = "";
    for (let elem of selected) {
      rooms += elem.value + ",";
    }
    setLoading(true);
    fetcher({
      url: "create_user",
      body: {
        email: login_new,
        role: "USER",
        password: password_new,
        rooms: rooms,
      },
      token: cookies.token,
      type: "post",
    })
      .then(() => {
        window.location.href = '/manager';
      })
      .catch(() => setLoading(false));
  };
  return (
    <>
        <NavBar role = {props.role}></NavBar>
      <Container
        className=" align-items-center justify-content-center"
        style={{
          justifyContent: "center",
          minHeight: "60vh",
          maxWidth: "550px",
        }}
      >
        <div>
          {loading ? (
              <span className="loader"></span>
          ) : (
            <>
              <Card style={{ position: "unset" }}>
                <Card.Body
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    borderColor: "#f3e8c9",
                    marginTop: "100px",

                  }}
                >
                  <h2
                    className="text-center mb-4"
                    style={{
                      color: "black",
                      fontFamily: "Montserrat Medium 500",
                      fontSize: "18px",
                      textTransform: "uppercase",
                      letterSpacing: "5px",
                    }}
                  >
                    <strong>Додати куратора</strong>
                  </h2>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form
                    onSubmit={(e) => create_new_user(e)}
                    style={{ height: "300px" }}
                  >
                    <Form.Group id="email">
                      <Form.Label
                        style={{
                          color: "black",
                          fontFamily: "Montserrat Medium 500",
                          fontSize: "16px",
                        }}
                      >
                        Корпоративна пошта
                      </Form.Label>
                      <Form.Control
                        style={{
                          color: "black",
                          fontFamily: "Verdana",
                          fontSize: "16px",
                        }}
                        type="email"
                        onChange={(e) => setLogin_new(e.target.value)}
                        required
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group id="password">
                      <Form.Label
                        style={{
                          color: "black",
                          fontFamily: "Montserrat Medium 500",
                          fontSize: "16px",
                        }}
                      >
                        Пароль
                      </Form.Label>
                      <Form.Control
                        style={{
                          color: "black",
                          fontFamily: "Verdana",
                          fontSize: "16px",
                        }}
                        type="password"
                        onChange={(e) => setPassword_new(e.target.value)}
                        required
                      ></Form.Control>
                    </Form.Group>
                    <Form.Label
                      style={{
                        color: "black",
                        fontFamily: "Montserrat Medium 500",
                        fontSize: "16px",
                      }}
                    >
                      Крило
                    </Form.Label>
                    <MultiSelect
                      style={{ color: "black", fontFamily: "Verdana" }}
                      options={options}
                      value={selected}
                      className="mutiselect_align"
                      onChange={setSelected}
                    />
                    <button
                      disabled={loading}
                      className="button_add_curators"
                      type="submit"
                    >
                      Додати
                    </button>
                    <div></div>
                  </Form>
                </Card.Body>
              </Card>
              <br></br>
              Список кураторів:
              <br></br>
              <br></br>
              {response.length === 0 ? (
                <>Немає кураторів</>
              ) : (
                <>
                  {response.map((ele, index) => (
                    <ol class="list-group" style={{ paddingRight: "-50px" }}>
                      <li
                        class="list-group-item"
                        style={{
                          fontFamily: "Montserrat Medium 500",
                          color: "black",
                          fontSize: "16px",
                        }}
                      >
                        {index + 1}. {ele.email}{" "}
                        <strong>
                          <label style={{ color: "black" }}>
                            {"  " +
                              ele.rooms[0] +
                              "-" +
                              ele.rooms[ele.rooms.length - 1]}
                          </label>
                        </strong>
                      </li>
                    </ol>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Curator_menager;
