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
        </div>

    )
}
export default Main_Page
