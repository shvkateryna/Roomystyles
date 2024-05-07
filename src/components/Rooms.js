import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import "../styles/Curator.css"
import "../styles/Form.css"
import { useAuth } from "../contexts/AuthContexts"
import { useNavigate } from "react-router-dom";
import {FaArrowCircleUp} from 'react-icons/fa';
import styled from 'styled-components';
import path from "../path"
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/Roomsnew.css"
import NavBar from './navbarnew';

const Rooms = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = useState(false)
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300){
      setVisible(true)
      } 
      else if (scrolled <= 300){
      setVisible(false)
      }
  };
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    console.log(className);
    return (
       <div
        className={className}
        style={{  ...style, color: "red" }}
        onClick={onClick}/>
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", color: "green" }}
        onClick={onClick}
      />
    );
  }
  const scrollToTop = () =>{
      window.scrollTo({
      top: 0, 
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
          in place of 'smooth' */
      });
  }; 
  window.addEventListener('scroll', toggleVisible);

  const handleClick = (room_number) => {
    const element = document.getElementById(`element_${room_number}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (event, room_number) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed. Value:', inputValue);
    }
    const roomNumber = parseInt(inputValue -1, 10); // Assuming inputValue is a number
      if (!isNaN(roomNumber)) {
        handleClick(roomNumber);
      }
  };

  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const [loadinRoute, setLoadingRoute] = useState([false, -1])
  const [justcopied, setJustCopied] = useState(-1)
  const navigate = useNavigate();

  function wings(number) {
    if (number === 201) {
      return "2 поверх, ліве крило"
    } if (number == 219) {
      return "2 поверх, праве крило"
    } if (number === 301) {
      return "3 поверх, ліве крило"
    } if (number == 319) {
      return "3 поверх, праве крило"
    } if (number === 401) {
      return "4 поверх, ліве крило"
    } if (number === 419) {
      return "4 поверх, праве крило"
    } if (number === 501) {
      return "5 поверх, ліве крило"
    } if (number === 519) {
      return "5 поверх, праве крило"
    }
  }

  function checker(filled_forms) {
    let counter = 0
    for (let i = 0; i < filled_forms.length; i++) {
      if (filled_forms[i] === true) {
        counter = counter + 1
      }
    }
    return counter
  }

  function checker_verified(verified_list) {
    let counter_verified = 0
    console.log(verified_list.size)
    for (let i = 0; i < verified_list.length; i++) {
      if (verified_list[i] === true) {
        console.log(i)
        counter_verified = counter_verified + 1
      }
    }
    return counter_verified
  }

  async function get_route(number) {
    setLoadingRoute([true, number])
    setJustCopied(number)
    return new Promise(function (resolve, reject) {

      axios.post(path + '/get_route', { room_n: number }).then((res) => {
        setLoadingRoute([false, -1])
        resolve(res.data)
      }).catch(err => {
        setLoadingRoute([false, -1])
      })
    })
  }
  var settings = {
    infinite: false,
    speed: 200,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
     prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    setLoading(true)
    axios.get(path + `/curator_rooms/${props.user_id}`)
      .then(res => {
        console.log(res.data)
        setResponse(res.data)
        setLoading(false)
      }).catch(err =>
        setLoading(false))
  }, []);
  return (
    <div key={"main_div_rooms"} className="main"
      style={{ minHeight: '100vh' }}>
      {loading ? <>
        <span key={"loader"} className="loader"></span>
      </> :
      <> <div className="roomsbody">
      <NavBar></NavBar>
       <div className="roomsmain">
          <div className='roomsslider'>
           {/* <Slider {...settings}>
           <div className='roomsroom' >
              <div className='roomsroominside'> <span>Крило імені Прими (419 - 436)</span> </div>
           </div>
           <div className='roomsroom' >
              <div className='roomsroominside'> <span>Крило імені Прими (419 - 436)</span> </div>
           </div>
           <div className='roomsroom' >
              <div className='roomsroominside'> <span>Крило імені Прими (419 - 436)</span> </div>
           </div>
           <div className='roomsroom' >
              <div className='roomsroominside'> <span>Крило імені Прими (419 - 436)</span> </div>
           </div>
           <div className='roomsroom' >
              <div className='roomsroominside'> <span>Крило імені Прими (419 - 436)</span> </div>
           </div>
           <div className='roomsroom' >
              <div className='roomsroominside'> <span>Крило імені Прими (419 - 436)</span> </div>
           </div>
           </Slider> */}
           </div>
           <div className='roomscards'>
           {response.map((ele, index) => (

              <div className='roomscard'>
              <div className='roomnumber'><span>{ele.number}</span></div>
              <div className='roomscardfooter'>
              <span> Мешканці: </span>
              <span>1) Булешний Михайло</span>
              <span>2) Ільницький Давид</span>
              <span>3) Пельчарський Артур</span>

              </div>
              <span>Підтвердження:</span>
              <div className='roomscardfooter2'>
              <div><span>Ліж1.(1)</span></div>
              <div><span>Ліж1.(2)</span></div>
              <div><span>Ліж2.</span></div>
              <div><span>Заг.</span></div>
              </div>
              <div className='roomscardfooter2'>
              <div className='roomaccepted'></div>
              <div className='roomrejected'></div>
              <div className='roomaccepted'></div>
              <div className='roomaccepted'></div>
              </div>
              </div>
           ))}
              
           </div>
       </div>
   </div></>
      // <>
      //   <NavBar />
      //   <div className='rooms_list_back'>
      //   <div key={"main_text_div"} className="rooms_list">
      //     <div key={"strong"}><strong>Список кімнат</strong></div>
      //   </div>
      //   </div>
      //   <div className='circle'>
      //     <FaArrowCircleUp onClick={scrollToTop} 
      //     style={{display: visible ? 'inline' : 'none'}} />
      //   </div>
      //   <div className='body_search'>
      //       <div class="search-container">
      //           <input 
      //             type="text" 
      //             class="search-input" 
      //             placeholder="Введіть номер кімнати"
      //             value={inputValue}
      //             onChange={handleInputChange}
      //             onKeyDown={handleKeyPress}/>
      //           <button class="search-button" onClick={handleKeyPress}>
      //               Пошук
      //           </button>
      //       </div>
      //   </div>
      //   <div key={"rooms_div"} className="rooms">
        //   {response.map((ele, index) => (
        //     <div>
        //       <label className='wings'>{wings(ele.number)}</label>
        //       <div key={"div_room_main" + index} className='block_room'>
        //         <div id={`element_${ele.number}`} key={'div_room_validate' + index} className="header_button-room"
        //           onClick={() => navigate(String(ele.number))}>
        //           {ele.number} <span className='check_and_verify'>{checker(ele.filled_form)} заповнено | {checker_verified(ele.verified)} підтверджено</span>
        //         </div>
        //         <button key={'button_room_link' + index}
        //           disabled={loadinRoute[0]}
        //           className={justcopied === ele.number ? 'link-copied' : 'link'}
        //           onClick={async () => {
        //             navigator.clipboard.writeText("https://roommy.netlify.app"+'/rooms/' + await get_route(ele.number))
        //           }} >Посилання</button>
        //         {loadinRoute[0] & loadinRoute[1] === ele.number ? "": <></>}
        //       </div>
        //     </div>
        //   ))}
        // </div></>
        
        }


    </div>
  )
}

export default Rooms