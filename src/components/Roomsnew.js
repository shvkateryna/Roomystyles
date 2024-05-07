import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/Roomsnew.css"
import NavBar from './navbarnew';

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


export default function Roomsnew() {
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


    return (
        <div className="roomsbody">
           <NavBar></NavBar>
            <div className="roomsmain">
               <div className='roomsslider'>
                <Slider {...settings}>
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
                </Slider>
                </div>
                <div className='roomscards'>
                <div className='roomscard'>
                        <div className='roomnumber'><span>321</span></div>
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
                    <div className='roomscard'>
                        <div className='roomnumber'><span>321</span></div>
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
                    <div className='roomscard'>
                        <div className='roomnumber'><span>321</span></div>
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
                    <div className='roomscard'>
                        <div className='roomnumber'><span>321</span></div>
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
                </div>
            </div>
        </div>
    )
}

