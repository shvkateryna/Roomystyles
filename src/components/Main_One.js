import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import "../styles/Main_form.css"
import axios from 'axios';
import One from './One';
import path from "../path"
function Main_One() {
    const { id_coded } = useParams();
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios.get(path + `/room/${id_coded}`)
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
                        <div className='register' ><strong>Реєстрація кімнати №{response.number}</strong></div>
                        <One room={response} id_coded={id_coded} />
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
export default Main_One