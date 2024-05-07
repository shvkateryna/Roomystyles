import React, { useEffect ,useState} from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/navnew.css"


export default function NavBar() {
    const [isActive, setActive] = useState(false)
    return (
        
        <nav className="navbar">
          <div className="navbarbrand-title">Roomy</div>
          <div  className={isActive?"navbaroptions active":"navbaroptions"} >
          <div className='active' id="navoption">
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

