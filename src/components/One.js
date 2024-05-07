import "../styles/Form_reg.css"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import { Slide } from 'react-slideshow-image';
import path from "../path"

function One(props) {
    const id_coded = props.id_coded
    const [room, setRoom] = useState(props.room);
    const [ruleAccepted, setRuleAccepted] = useState(false);
    const [error, setError] = useState("")
    const [errorFurniture, setErrorFurniture] = useState("")
    const [sendingForm, setSendingForm] = useState(false)
    const new_block = room.furniture_list[3]
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }

    async function upload_google_drive(file) {
        let url = "https://script.google.com/macros/s/AKfycbxZ3S11M9zGUvVYxdwql8bu5JYgP9JwDT4H1n5J-526IpDVZblaRAqj04BWQdIzGUhe/exec";
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            let responce = "test"
            console.log(file)
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                var base64data = reader.result;
                // console.log(base64data)

                // This line sets the "src" attribute of the "img" element to the value of "res"
                // This line splits the "res" variable into an array, using the string "base64," as the separator, and assigns the second element to a variable called "spt"
                let spt = base64data.split("base64,")[1];
                // This line creates an object called "obj" with three properties: "base64", "type", and "name"
                let obj = {
                    base64: spt,
                    type: file.type,
                    name: file.name
                }
                // console.log(obj)
                // This line sends a POST request to the URL specified in the "url" variable, with the "obj" object as the request body
                fetch(url, {
                    method: "POST",
                    body: JSON.stringify(obj)
                })
                    // This line waits for the response from the server and converts it to text
                    .then(r => r.text())
                    // This line logs the response data to the console
                    .then(data => {
                        resolve(data)
                    })

            }
        })
    }
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });
    const handleChangeUser = (index, value) => {
        let users = room.names
        users[index] = value
        setRoom((prev) => ({ ...prev, "names": users }))
    }
    const handleChangeStartDate = (index, value) => {
        let users_dates = room.start_dates
        users_dates[index] = value
        setRoom((prev) => ({ ...prev, "start_dates": users_dates }))
    }
    const handleChangeRoomFile = async (index_block, index, option, value) => {
        let compressedFiles = []
        for (var i = 0; i < value.length; i++) {
            compressedFiles.push(await shrinkImage(value[i]))
        }

        let obj = room.furniture_list[index_block]
        obj[index][option] = compressedFiles
        let new_list = room.furniture_list
        new_list[index_block] = obj

        setRoom((prev) => ({ ...prev, "furniture_list": new_list }))
    }
    const handleChangeRoom = (index_block, index, option, value) => {
        let obj = room.furniture_list[index_block]
        obj[index][option] = value
        let new_list = room.furniture_list
        new_list[index_block] = obj
        setRoom((prev) => ({ ...prev, "furniture_list": new_list }))
    }
    const handleChangeFilled = (index) => {
        let filled = room.filled_form
        filled[index] = true
        setRoom((prev) => ({ ...prev, "filled_form": filled }))
    }
    async function shrinkImage(image) {
        const options = {
            maxSizeMB: 0.05,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        const compressedFile = await imageCompression(image, options);
        return compressedFile
    }
    const handle_post = async (e) => {
        e.preventDefault();
        if (room.names[0] === "") {
            setErrorFurniture("Немає імені мешканця")
            window.scrollTo(0, 0)
            setSendingForm(false)
            return
        }
        if (room.start_dates[0] === "") {
            setErrorFurniture("Немає дати")
            window.scrollTo(0, 0)
            setSendingForm(false)
            return
        }
        for (let elem of room.furniture_list[3]) {
            if (elem.description === null | elem.description === "") {
                setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'.")
                window.scrollTo(0, 0)
                setSendingForm(false)
                return
            }
        }
        setSendingForm(true)
        handleChangeFilled(1)
        console.log(room)
        let new_furniture_list = []
        for (let furnit of room.furniture_list[3]) {
            if (furnit.images !== Array(0)) {
                // console.log("images here")
                console.log(furnit.images)
                let links = []
                for (let file of furnit.images) {
                    // console.log(file)
                    if (typeof (file) != 'string') {
                    const link = await upload_google_drive(file)
                    // console.log(link)
                    // const res = await uploadFile(file, room.number);
                    console.log(links)
                    links.push(link)
                } else { links.push(file) }
                    // links.push(link)
                }
                console.log(links)
                furnit.images = links
                new_furniture_list.push(furnit)
            } else {
                new_furniture_list.push(furnit)
            }
        }
        setRoom((prev) => ({ ...prev, "furniture_list": new_furniture_list }))
        axios.post(path + `/room/${id_coded}/submit/3`, room)
            .then(res => {
                routeChange("/rooms/" + id_coded)
            })
    }
    function check_url(slideImage){
        if (typeof slideImage != 'string') {
            return (URL.createObjectURL(slideImage))
        }
        else {
            return (slideImage) }
    }
    return (
        <div>
        {sendingForm ? <>
                <div className="sending_form">Зачекайте, ми обробляємо Вашу відповідь...</div>
        </> : <>
        <div><div className='room_type_header' ><strong>Одноповерхове ліжко</strong></div>
        <div className="main_div" key={"main_form_div"}>
                <form className="main_form" key="submit_form" >
                    <div className='furniture_list' key="furniture_div">
                        {errorFurniture ? <>
                            <div className="error_block">{errorFurniture}</div>
                        </> : <></>}
                        <label className="text_header" key={"user_label_1"}>
                            <div>Ім'я та прізвище мешканця </div>
                        </label>
                        <input placeholder="Введіть ім'я та прізвище" className="user_input" type="text" key={"inp_user_" + 0} onChange={(e) => handleChangeUser(0, e.target.value)} value={room.names[0]} />
                        <label className="text_header" key={"user_label_2"}>
                            <div>Дата поселення</div>
                        </label>
                        <input placeholder="ДД/ММ/PP" className="user_input" type="date" key={"inp_user_" + 0} onChange={(e) => handleChangeStartDate(0, e.target.value)} value={room.start_dates[0]} />
                        <br></br>
                        {new_block.map((ele, index) => (<>
                            <div key={"div_" + index + "" + 3} className='furniture_block'>
                                <div key={"div_header_" + index + "" + 3} className="header_furniture">
                                    <div key={"que_body_" + index + "" + 3} className="text_header">
                                        <div key={"strong_" + index + "" + 3}>{index + 1 + ")    "} {ele.type_expanded}<br /></div>
                                    </div>
                                    <div style={{paddingLeft: '20px', fontSize: '16px'}}>{ele.questions}</div>
                                </div>
                                <div key={"div_body_" + index + "" + 3} className="body_furniture">
                                    {ele.type === "bed" ? <div key={"div_select_" + index + "" + 3}></div> : <></>}
                                    <div key={"text_image" + index + "" + 3} className="obj_input">
                                        <textarea className="obj_description"
                                            onChange={(e) => handleChangeRoom(3, index, "description", e.target.value)}
                                            value={room.furniture_list[3][index].description}
                                            key={"inp_" + index + "" + 3} type="text"
                                            placeholder={"Опишіть стан"} />
                                    </div>
                                    <div key={"div_image" + index + "" + 3} className="file_div">
                                        <input
                                            key={"input_image" + index + "" + 3}
                                            className="file_input"
                                            type="file"
                                            multiple
                                            onChange={(event) => {
                                                handleChangeRoomFile(3, index, "images", Array.from((event.target.files)))
                                            }}>
                                        </input>
                                    <div className="clear_images" onClick={()=>{handleChangeRoomFile(3, index, "images", [])}}>Видалити фото</div>
                                    </div>
                                    {ele.images.length != 0 ? <>
                                            <Slide>
                                                {ele.images.map((slideImage, index) => (
                                                    <div className="slider_div" key={index}>
                                                        <img className="slider_image" src={check_url(slideImage)} />
                                                    </div>
                                                ))}
                                            </Slide>
                                        </> : <></>}
                                </div>
                            </div>

                        </>))}
                    </div>
                    <div>
                        <br />
                        <div style={{paddingLeft: '20px', fontSize: '16px'}}>
                            <p>Перед підтвердженням форми уважно перегляньте правила Колегіуму за посиланням.</p>
                            <p><a target="_blank" href="https://collegium.ucu.edu.ua/dlia-vstupnika/dokumenty/pravila-vnutrishnogo-rozporiadku-v-kolegiumi">Правила колегіуму</a></p>
                        </div>
                        <div>
                            <p style={{paddingLeft: '20px', fontSize: '16px'}}>Я ознайомився / -лася з правилами та підтверджую, що вся надана інформація достовірна.
                            <input style={{height: '15px', width: '15px', marginLeft: '10px'}}
                                key="check_rules"
                                type="checkbox"
                                checked={ruleAccepted}
                                onChange={() => setRuleAccepted(!ruleAccepted)}
                            />
                            </p>
                        </div>
                        <input disabled={!ruleAccepted} className="submit_form" value="Відправити" onClick={handle_post} key="submit_button" type={"submit"} />
                    </div>
                </form>
        </div>
        </div>
        </>}
        </div>
    );
}
export default One
