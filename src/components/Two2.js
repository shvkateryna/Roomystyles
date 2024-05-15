import "../styles/Form_reg.css"
import { useState } from 'react';
import axios from 'axios';
import { Slide } from 'react-slideshow-image';
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import path from "../path"
import trash_logo from "../assets/trash.png"
function Two2(props) {
    const id_coded = props.id_coded
    const [room, setRoom] = useState(props.room);
    const [ruleAccepted, setRuleAccepted] = useState(false);
    const [error, setError] = useState("")
    const [errorFurniture, setErrorFurniture] = useState("")
    const [sendingForm, setSendingForm] = useState(false)
    let navigate = useNavigate();
    const new_block = room.furniture_list[5]

    const routeChange = (path) => {
        navigate(path);
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
    async function upload_google_drive(file) {
        let url = "https://script.google.com/macros/s/AKfycbzzUASeCpfNN5Z9nv4H21rq3p3KcH8lSm5-HDBxay0EpJIeZ18T_XF1s090Ki_o9Ga2hg/exec";
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            let responce = "test"
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
    const handleChangeUser = (index, value) => {
        let users = room.names
        users[index] = value
        setRoom((prev) => ({ ...prev, "names": users }))
    }
    const handleChangeRoom = (index_block, index, option, value) => {
        let obj = room.furniture_list[index_block]
        obj[index][option] = value
        let new_list = room.furniture_list
        new_list[index_block] = obj
        setRoom((prev) => ({ ...prev, "furniture_list": new_list }))
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
    const handleChangeFilled = (index) => {
        let filled = room.filled_form
        filled[index] = true
        setRoom((prev) => ({ ...prev, "filled_form": filled }))
    }
    const handleChangeStartDate = (index, value) => {
        let users_dates = room.start_dates
        users_dates[index] = value
        setRoom((prev) => ({ ...prev, "start_dates": users_dates }))
    }
    const handle_post = async (e) => {
        e.preventDefault();
        if (room.names[2] === "") {
            setErrorFurniture("Немає імені мешканця")
            window.scrollTo(0, 0)
            setSendingForm(false)
            return
        }
        if (room.start_dates[2] === "") {
            setErrorFurniture("Немає дати")
            window.scrollTo(0, 0)
            setSendingForm(false)
            return
        }
        for (let elem of room.furniture_list[5]) {
            if (elem.description === null | elem.description === "") {
                setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'.")
                window.scrollTo(0, 0)
                setSendingForm(false)
                return
            }
        }
        setSendingForm(true)
        handleChangeFilled(3)
        let new_furniture_list = []
        for (let furnit of room.furniture_list[5]) {
            if (furnit.images !== null) {
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
        axios.post(path + `/room/${id_coded}/submit/5`, room)
            .then(res => {
                routeChange("/rooms/" + id_coded)
            })
    }
    function check_url(slideImage) {
        if (typeof slideImage != 'string') {
            return (URL.createObjectURL(slideImage))
        }
        else {
            return (slideImage)
        }
    }
    return (
        <div>
            {sendingForm ? <>
                <div className="sending_form">Зачекайте, ми обробляємо Вашу відповідь...</div>
            </> : <>
                <div><div className='room_type_header' ><strong>Двоповерхове ліжко (2 поверх)</strong></div>
                    <div className="main_div" key={"main_form_div"}>
                        <form className="main_form" key="submit_form" >
                            <div className='furniture_list' key="furniture_div">
                                {errorFurniture ? <>
                                    <div className="error_block">{errorFurniture}</div>
                                </> : <></>}
                                <label className="text_header" key={"user_"}>
                                    <div>Ім'я та прізвище мешканця</div>
                                </label>
                                <input placeholder="Введіть ім'я та прізвище" className="user_input" type="text" key={"inp_user" + 2} onChange={(e) => handleChangeUser(2, e.target.value)} value={room.names[2]} />
                                <label className="text_header" key={"user_"}>
                                    <div>Дата поселення</div>
                                </label>
                                <input placeholder="ДД/ММ/PP" className="user_input" type="date" key={"inp_user" + 2} onChange={(e) => handleChangeStartDate(2, e.target.value)} value={room.start_dates[2]} />
                                <br></br>
                                {new_block.map((ele, index) => (<>
                                    <div key={"div_" + index + "" + 5} className='furniture_block'>
                                    <div className="horizontal_line_separator"></div>

                                        <div key={"div_header_" + index + "" + 5} className="header_furniture">
                                            <div key={"que_body_" + index + "" + 5} className="text_header">
                                                <div key={"strong_" + index + "" + 5}>{index + 1 + ")    "} {ele.type_expanded}<br /></div>
                                            </div>
                                            <div style={{ paddingLeft: '20px', fontSize: '16px' }}>{ele.questions}</div>
                                        </div>
                                        <div key={"div_body_" + index + "" + 5} className="body_furniture">
                                            {ele.type === "bed" ? <div key={"div_select_" + index + "" + 5}></div> : <></>}
                                                <textarea className="obj_description"
                                                    onChange={(e) => handleChangeRoom(5, index, "description", e.target.value)}
                                                    value={room.furniture_list[5][index].description}
                                                    key={"inp_" + index + "" + 5} type="text"
                                                    placeholder={"Опишіть стан"} />
                                            <div key={"div_image" + index + "" + 5} className="file_div">
                                                <input
                                                    key={"input_image" + index + "" + 5}
                                                    className="file_input"
                                                    type="file"
                                                    multiple
                                                    onChange={(event) => {
                                                        handleChangeRoomFile(5, index, "images", Array.from((event.target.files)))
                                                    }}>
                                                </input>
                                                <div className="clear_images" onClick={()=>{handleChangeRoomFile(5, index, "images", [])}}>
  
                                                <img
                                                    className="trash_logo"
                                                    src={trash_logo}
                                                />
                                                </div>
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
                           
                            <div className = "submit_align_wrapper">
                                <br />
                                <div style={{ paddingLeft: '20px', fontSize: '16px' }}>
                                    <p>Перед підтвердженням форми уважно перегляньте правила Колегіуму за посиланням.</p>
                                    <p><a target="_blank" href="https://collegium.ucu.edu.ua/dlia-vstupnika/dokumenty/pravila-vnutrishnogo-rozporiadku-v-kolegiumi">Правила колегіуму</a></p>
                                </div>
                                <div className="results_wrapper">
                                    <p style={{ paddingLeft: '20px', fontSize: '16px' }}>Я ознайомився / -лася з правилами та <br/> підтверджую, що вся надана інформація достовірна.
                                        <input style={{ height: '15px', width: '15px', marginLeft: '10px' }}
                                            key="check_rules"
                                            type="checkbox"
                                            checked={ruleAccepted}
                                            onChange={() => setRuleAccepted(!ruleAccepted)}
                                        />
                                    </p>

                                    <input disabled={!ruleAccepted} className="submit_form" value="Відправити" onClick={handle_post} key="submit_button" type={"submit"} />
                                </div>
                               
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>}
        </div>
    );
}
export default Two2
