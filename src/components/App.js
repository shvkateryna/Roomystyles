import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from "./Login"
import ForgotPassword from './ForgotPassword'
import Main from './Main'
import Main_Page from './Main';
import Main_Form from "./Main_Form"
import Rooms from './Rooms';
import Curator_menager from './Curator_menager';
import Main_General from './Main_General';
import Main_One from './Main_One';
import Main_Two from './Main_Two';
import Main_Two2 from './Main_Two2';
import { Room } from './Room';
import Roomsnew from './Roomsnew';
import Roomnew from './Roomnew';
import { useCookies } from "react-cookie";  
import { MakeRequest, fetcher, makeRequest } from "../services/ApiService";
import "../styles/app.css"

function App() {
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)
  const [cookies] = useCookies(["user"]);
  useEffect(()=>{
      console.log(cookies)
      if (cookies.token) {
          fetcher({ url: "validate_token", token: cookies.token }).then(()=>{
          setAuth(true)
          setLoading(false)
        }).catch(()=>{
          setAuth(false)
          setLoading(false)
        })
      } else {
        setAuth(false)
        setLoading(false)
      }
  },[cookies])

  return (
    <div>
      <div className='w-100 h-100 outer'>
        <Routes>
        <Route path="/login" element={<Login />} />
        
        {loading?
        <>
        <Route path="/" element={<span class="loader"></span>} />
        </>:<>
        {auth?<>
          <Route >
          <Route path="/rooms_curator/:number" element={<Room user_id={1} />} />
          <Route exact path="/manager" element={<Curator_menager />}/>
          <Route exact path="/rooms_curator" element={<Rooms user_id={1} />} />
        
          {/* <div>test<div/> */}
          {/* <Route exact path="/manager" element={<Curator_menager />} /> */}
          <Route exact path="/" element={<Roomsnew />} />
          <Route exact path="/room" element={<Roomnew />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Main_Page />} />
          
          <Route path="/rooms/:id_coded" element={<Main_Form />} />
          <Route path="/rooms/:id_coded/general" element={<Main_General/>} />
          <Route path="/rooms/:id_coded/one" element={<Main_One/>} />
          <Route path="/rooms/:id_coded/two" element={<Main_Two/>} />
          <Route path="/rooms/:id_coded/two2" element={<Main_Two2/>} />
          </Route>
        </>:<>
        <Route path="/" element={ <Navigate to="/login" />} />
        </>}
        </>}
        
        </Routes>
      </div>
    </div>
  )
}

export default App;
