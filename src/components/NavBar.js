import { React, useState } from 'react'
import { useAuth } from "../contexts/AuthContexts"
import { useNavigate } from "react-router-dom";
import DropdownButton from './DropdownButton';
const NavBar = () => {
    const { logout } = useAuth()
    const { role } = useAuth()

    const adminOptions = ['Кімнати', 'Додати куратора', 'Завантажити звіт','Очистити звіт', 'Вийти'];
    const userOptions = ['Кімнати', 'Вийти'];
    const nullOptions = ['Увійти'];

    const handleMenuOptionSelect = (selectedOption) => {
        console.log('Selected option:', selectedOption);
        // You can perform any desired actions with the selected option here
      };
    
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate("/"+path);
    }
    const LogOut = async function () {
          await logout();
          navigate("/")
          if (role === null) {
            alert('Success! No user is logged in anymore!');
          }
          return true;
      };
    return (
        <div className="header">
            <div onClick={()=>navigate("/")} className="logo"><strong>RooMy</strong></div>
            <div>
                {role === "USER" ? <>
                    <DropdownButton options={userOptions} onSelect={handleMenuOptionSelect} />
                </> : <></>}
                {role === "ADMIN" ? <>
                    <DropdownButton options={adminOptions} onSelect={handleMenuOptionSelect} />
                </> : <></>}
                {!role ? <>
                    <DropdownButton options={nullOptions} onSelect={handleMenuOptionSelect} />
                </> : <></>}
            </div>
        </div>
    )
}

export default NavBar