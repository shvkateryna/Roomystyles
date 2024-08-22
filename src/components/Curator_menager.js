import React from "react";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select';
import { Form, Button, Card, Alert, Container, Navbar } from "react-bootstrap";
import { useCookies } from "react-cookie";
import NavBar from "./navbarnew";
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
  const [isFocused, setIsFocused] = useState(false);
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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: 'none',
      borderColor: '#8D0709',
      borderRadius: '16px',
      borderWidth: state.isFocused ? '2px' : '1px',  // Increase border width when focused
      '&:hover': {
        borderColor: '#8D0709',
      },
    }),
  };

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
        window.location.href = "/manager";
      })
      .catch(() => setLoading(false));
  };
  return (
    <>
      <NavBar role={props.role}></NavBar>
        <div>
          {loading ? (
            <span className="loader"></span>
          ) : (
            <>
            <div className="curators">Куратори</div>
            <Container
            style={{
              justifyContent: "center",
            }}>
              <Card className='add-curators-card' style={{ position: "unset" }}>
                <Card.Body
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    borderColor: "#f3e8c9",
                    marginTop: "15%",
                    padding: '7%',
                  }}
                >
                  <h2 className="add-curators-header">
                    Додати куратора
                  </h2>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form
                    onSubmit={(e) => create_new_user(e)}
                    style={{ height: "300px" }}
                  >
                    <Form.Group id="email" className="add-curators-headers">
                      <Form.Label
                      >
                        Корпоративна пошта
                      </Form.Label>
                      <Form.Control
                        type="email"
                        className="form-control"
                        onChange={(e) => setLogin_new(e.target.value)}
                        placeholder="ucu@ucu.edu.ua"
                        required
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group id="password" className="add-curators-headers">
                      <Form.Label
                      >
                        Пароль
                      </Form.Label>
                      <Form.Control
                        type="password"
                        className="form-control"
                        onChange={(e) => setPassword_new(e.target.value)}
                        placeholder="Пароль"
                        required
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group id="wing" className="add-curators-headers">
                    <Form.Label
                    >
                      Крило
                    </Form.Label>
                    <Select
                      isMulti
                      styles={customStyles}
                      options={options}
                      value={selected}
                      className="mutiselect_align"
                      onChange={setSelected}
                      onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
                      placeholder="Вибрати крило"
                    />
                    </Form.Group>
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
            </Container>
            <div className="curators">Список кураторів:</div>
              <br></br>
              <br></br>
              {response.length === 0 ? (
                <div className="no-curators">Немає кураторів</div>
              ) : (
                <>
                  <table className="custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Корпоративна пошта
                      </th>
                      <th>Кімнати
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.map((ele, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ele.email}</td>
                        <td>
                          {ele.rooms[0]} - {ele.rooms[ele.rooms.length - 1]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </>
              )}
            </>
          )}
        </div>
      
    </>
  );
};

export default Curator_menager;
