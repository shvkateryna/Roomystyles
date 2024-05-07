import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { MakeRequest, makeRequest } from "../services/ApiService";
import { ApiService } from "../services/ApiService";
import { useEffect, useState } from 'react';

const PrivateRoutes = async () => {
  const [cookies] = useCookies(["user"]);
  const [loading, setLoading] = useState(true)
  console.log(cookies)
  const isAuthorized = async () => {
    if (cookies.token) {
      // console.log("asdasdasd")
      // const {data, error, isLoading} = useSWR({ url: BASE_URL + url, token: cookies.token }, fetcher); 
      // const { data } = MakeRequest(
      //   "validate_token"
      // );
      return false
      // if (loading) {
      //   return false;
      // } else if (data) {
      //   return true;
      // }
      // return false;
    } else {
      return false;
    }
  };
  if(!loading){

  }
  return  res ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
