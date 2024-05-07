import React from 'react'
import { useAuth } from "../contexts/AuthContexts";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MultiSelect } from "react-multi-select-component"
import '../styles/Manager.css'
import '../styles/Main.css'
import path from "../path"
import Map from "../components/Map"
import NavBar from './NavBar';
import { Form, Button, Card, Alert, Container } from "react-bootstrap"

const Curator_menager = () => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [create_new, setCreate_new] = useState(false)
    // Form
    const [error, setError] = useState("")
    const [role_new, setRole_new] = useState("")
    const [login_new, setLogin_new] = useState([])
    const [password_new, setPassword_new] = useState([])
    const { signup } = useAuth()
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
    const [isHover, setIsHover] = useState(false)
    const [isHover1, setIsHover1] = useState(false)
    const [isHover2, setIsHover2] = useState(false)
    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };
    const handleMouseEnter1 = () => {
        setIsHover1(true);
    };
    const handleMouseLeave1 = () => {
        setIsHover1(false);
    };
    const handleMouseEnter2 = () => {
        setIsHover2(true);
    };
    const handleMouseLeave2 = () => {
        setIsHover2(false);
    };
    const [selected, setSelected] = useState([]);
    useEffect(() => {
        setLoading(true)
        axios.get(path+`/curators`)
            .then(res => {
                setResponse(res.data)
                setLoading(false)
            }).catch(err => {
                setLoading(false)
            })
    }, []);

    function checkPassword(str) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }
    const create_new_user = (e) => {
        e.preventDefault()
        if (login_new === "") {
            setError("Логін не може бути пустим.")
            return
        } else if (password_new === "") {
            setError("Пароль не може бути пустим.")
            return
        }
        else if (!checkPassword(password_new)) {
            setError("Пароль в неправильному форматі, він мусить містити принаймні одну маленьку та велику літери, цифру, знак(!@#$%^&*) а довжина повинна бути не менше 8 символів.")
            return
        }
        let rooms = ""
        for (let elem of selected) {
            rooms += elem.value + ","
        }
        signup(login_new, password_new, role_new, rooms)
    }
    return (
        <div className='manager_div_main'>
            <NavBar/>
            <Container className='align-items-center justify-content-center' style = {{justifyContent: "center",  minHeight: '60vh', maxWidth: '550px', marginTop:"100px"}}>
            <Card style={{position: "unset"}}>
                <Card.Body style={{backgroundColor: "#FDF2E9", border: 'none', borderRadius: '5px', borderColor: '#E6C797'}}>
                    <h2 className = 'text-center mb-4' style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "18px", textTransform: 'uppercase', letterSpacing: '5px'}}><strong>Додати куратора</strong></h2>
                    {error && <Alert variant = 'danger'>{error}</Alert>}
                    <Form onSubmit={(e) => create_new_user(e)} style={{height: "300px"}}>
                        <Form.Group id = 'email'>
                            <Form.Label style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "16px"}}>Корпоративна пошта</Form.Label>
                            <Form.Control style={{color: "black", fontFamily: 'Verdana', fontSize: "16px"}} type = 'email' onChange={(e) => setLogin_new(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Form.Group id = 'password'>
                            <Form.Label style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "16px"}}>Пароль</Form.Label>
                            <Form.Control style={{color: "black", fontFamily: 'Verdana', fontSize: "16px"}} type = 'password' onChange={(e) => setPassword_new(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Form.Label style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "16px"}}>Крило</Form.Label>
                            <MultiSelect style={{color: "black", fontFamily: 'Verdana'}}
                                options={options}
                                value={selected}
                                onChange={setSelected}
                            />
                        <Button disabled = {loading} className = 'w-100' type = 'submit' style={{backgroundColor: "#f7d474", border: "none", borderRadius: "12px", marginTop: "15px", height: "65px", fontFamily: 'Montserrat Medium 500', fontSize: "16px", backgroundColor: isHover ? '#efd8b5' : '#E6C797', color: isHover ? 'black' : 'black', padding: '15px'}}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                            Додати
                        </Button>
                        <div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <br></br>
            <details>
            <summary style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "16px", marginLeft: "30px"}}>Список кураторів</summary>
            <br></br>
            <div>
                {loading ? <>
                    <span key={"loader"} className="loader"></span>
                </> :
                    <>
                         {response.length === 0 ?
                            <>
                                Немає кураторів
                            </> :
                            <>
                                {response.map((ele, index) => (
                                    <ol class="list-group" style={{paddingRight: "-50px"}}>
                                    <li class="list-group-item" style={{marginRight: "50px", fontFamily: 'Montserrat Medium 500', color: "black", fontSize: '16px'}}>{index+1}. {ele.email}   <strong><label style={{color: "black"}}>{"  " + ele.rooms[0] + "-" + ele.rooms[ele.rooms.length - 1]}</label></strong></li>
                                </ol>
                            ))}
                        </>}
                </>}
            </div>
            </details>
            <br></br>
            <br></br>
            </Container>
            <div className="greeting">
                <strong><p>Вітаємо вдома!</p></strong>
                <Map />
            </div>
        </div>
    )}

export default Curator_menager

