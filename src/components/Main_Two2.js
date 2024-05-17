import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import "../styles/Main_form.css"
import axios from 'axios';
import Two2 from './Two2'
import path from "../path"
function Main_Two2() {
    const { id_coded } = useParams();
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(
        
    );
    useEffect(() => {
        axios.get(path+`/room/${id_coded}`)
            .then(res => {
                setResponse(res.data)
                setLoading(false)
            }).catch(err => {
                setError(err)
                setLoading(false)
            }
            )
    }, []);
    return (
        <div className='main_form'>
            {loading ? <div className="loader_block"><div className="loader"></div></div> :
                <>
                    {(response) ? <>
                        {/* <NavBar /> */}
                        <div className='register' ><strong>Реєстрація кімнати №{response.number}</strong></div>
                        <Two2 room={response} id_coded={id_coded} />
                        {/* <div className="greeting">
                            <strong><p>Вітаємо вдома!</p></strong>
                        </div> */}
                    </> : <></>}
                    {error ? <>
                        {error.response.data === "Wrong code" ? <div className='notions'>
                            Ваш код не правильний
                        </div> : <div className='notions'>
                            Ваша форма вже підтверджена куратором, ви не можете робити зміни
                        </div>}
                    </> : <></>}
                </>}

        </div>
    )
}
export default Main_Two2
