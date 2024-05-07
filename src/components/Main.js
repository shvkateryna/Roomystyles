import "../styles/Main.css"
import logo from '../assets/collegium.jpg'
import Map from "../components/Map"
// import NavBar from "./NavBar";

import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContexts";
import { Link, useNavigate } from "react-router-dom";
import  { MapComponent } from './Map.js';
import NavBar from "./NavBar";


function Main_Page() {
    return (
        <div className="new_main"
            style={{ minHeight: '100vh' }}>
           <div class = "image_aside"><img class = "aside_image" src={logo}/></div>
           <div class = "login_wrapper">
            
                <h1 class = "heading_login"> Roommy </h1>
                
           </div>

           <img/>
           {/*<NavBar />
            <div style = {{marginTop: "60px"}}>
                <img className="image" src={logo}></img>
            </div>
            <hr width="100%" size="30" color="#E6C797" ></hr>
            <div className="heading">
                <strong>Як зареєструвати кімнату?</strong>
            </div>
            <div className="numbers">
                <p><strong className="heading1">1.</strong> Скануйте QR-код на дверях, який відповідає вашій кімнаті.</p>
                <p><strong className="heading1">2.</strong> Заповніть детально форми: загальна для всіх мешканців та індивідуальна для кожного.</p>
                <p><strong className="heading1">3.</strong> Опишіть стан кімнати. За потреби сфотографуйте пошкодження.</p>
                <p><strong className="heading1">4.</strong> Збережіть кожну форму та чекайте підтвердження від куратора.</p>
            </div>
            <hr width="100%" size="30" color="#E6C797" ></hr>
            <div className="footer">
                <div className="heading">
                    <strong>Контакти</strong>
                </div>
                <div className="numbers1">
                    <strong className="heading1"><p>Зателефонувати</p></strong>
                    <p>+38 (032) 240 99 44</p>
                    <p>+38 (068) 076 29 74</p>
                    <strong className="heading1"><p>Пошта</p></strong>
                    <p>collegium@ucu.edu.ua</p>
                    <strong className="heading1"><p>Соціальні мережі</p></strong>
                    <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <a href="https://www.instagram.com/collegium.ucu/?hl=en" target="_blank" className="fa fa-instagram"></a>
                    <a href="https://www.youtube.com/channel/UCL0HwqYxLxL_l35FNE24kQw" target="_blank" className="fa fa-youtube"></a>
                    <a href="https://collegium.ucu.edu.ua/" target="_blank" className="fa fa-dribbble"></a>
                </div>
                </div>
                <hr width="100%" size="30" color="#E6C797" ></hr>
                <div className="greeting">
                    <strong><p>Вітаємо вдома!</p></strong>
                    <Map />
                </div>

            </div> */}
        </div>

    )
}
export default Main_Page
