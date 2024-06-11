import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Main.css";
import path from "../path";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Login() {
  const [role, setRole] = useState(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login(email, password) {
    axios
      .post(path + "/login", {
        email: email,
        password: password,
      })
      .then(function (response) {
        setCookie("token", response.data.token);
        window.location.href = "/";

        setRole(response.data.user_type);
      })
      .catch(function (error) {});
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("Не вдалося увійти");
    }
    setLoading(false);
  }

  return (
    <CookiesProvider>
    <div>
    <div className="background-image">
        <div className="login_wrapper">
          <div className="aside_login_container">
          <h1 className="heading_login">Roo<span className="red_letter">M</span>y</h1>
            <Card>
              <Card.Body className="card-body-login">
                <h2 className="login_header">
                 Увійти
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="form_login">
                  <Form.Group id="email" className="input_group">
                    <Form.Label className="form_label">
                      Корпоративна пошта
                    </Form.Label>
                    <Form.Control
                      className="input_login"
                      placeholder="ucu@ucu.edu.ua"
                      type="email"
                      ref={emailRef}
                      required
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group id="password" className="input_group">
                    <Form.Label className="form_label">Пароль</Form.Label>
                    <Form.Control
                      className="input_login"
                      placeholder="Пароль"
                      type="password"
                      ref={passwordRef}
                      required
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    disabled={loading}
                    className="button_submit"
                    type="submit"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="login_button">Увійти</span>
                  </Button>
                  <img src={logo} className="logo-collegium" />
                </Form>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  </CookiesProvider>
);
}
