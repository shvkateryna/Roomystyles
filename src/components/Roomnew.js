import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/Roomnew.css"
export default function roomnew() {
    var settings = {
        infinite: false,
        speed: 200,
        slidesToShow: 8,
        slidesToScroll: 8,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 5,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          }
        ]
      };


      return (
        <div className="roombody">
            <div className="roomheader">
                <div className="roomlogo">Roommy</div>
            </div>
            <div className="roommain">
                <div className="roomwings">
                    <div className="roomwing"> 
                       <span> Крило ім. Прими (419 - 435)</span>    
                    </div>
                    <div className="roomwing"> 
                       <span> Крило ім. Прими</span>    
                    </div>
                    <div className="roomwing"> 
                       <span> Крило ім. Прими</span>    
                    </div>
                    <div className="roomwing"> 
                       <span> Крило ім. Прими</span>    
                    </div>
                    <div className="roomwing"> 
                       <span> Крило ім. Прими</span>    
                    </div>
                </div>
                
                <div className="roomcards">
                <Slider {...settings}>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Усе</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Ліжко 1 поверх</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Вбиральня</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Ліжко 1 поверх</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Вбиральня</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Ліжко 1 поверх</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Вбиральня</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Ліжко 1 поверх</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Вбиральня</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Ліжко 1 поверх</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Вбиральня</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Ліжко 1 поверх</span> </div>
                    </div>
                    <div className='roomroom' >
                    <div className='roomroomfur'> <span>Вбиральня</span> </div>
                    </div>
                
                </Slider>

                </div>
            </div>
        </div>
    )
}

