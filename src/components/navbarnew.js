import React, { useEffect ,useState} from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/navnew.css"
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
export default function NavBar() {
    const [isActive, setActive] = useState(false);
    let navigate = useNavigate();
    let handleClick = () =>{
      navigate("/")
    }
    return (
        <nav className="navbar_m">
          <div className="navbarbrand-title" onClick={handleClick}>Roomy</div>
          <div  className={isActive?"navbaroptions active":"navbaroptions"} >
          <div id="navoption">
              <span> Home </span>
          </div>
          <div id="navoption">
              <span> Rooms </span>
          </div>
          <div id="navoption">
              <span> Curator </span>
          </div>
          </div>
          <div id = "mobile"  onClick={()=> setActive(!isActive)}>
            {isActive?<>
              <i class="fa-solid fa-xmark"></i>
            </>:<>
            <i className='fas fa-bars' ></i>
            </>}
           
          </div>
        
      </nav>
    )
    
}

