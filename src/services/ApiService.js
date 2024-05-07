import useSWR from "swr";
import axios from "axios";
import { useCookies } from "react-cookie";
const BASE_URL = "http://localhost:5000";

const fetcher = async (params) => {
  let config = {
    headers: {
      'Authorization': `Bearer ${params.token}`,
    }
  }
  if (params.type === "get"){
    return axios.get(BASE_URL + "/" + params.url, config).then((res) => res);
  }
  return axios.post(BASE_URL + "/" + params.url, {}, config).then((res) => res);
};

// function MakeRequest (url,cookies) {
//   const {data, error, isLoading} = useSWR({ url: BASE_URL + url, token: cookies.token }, fetcher);  
//   return {"data": data, error: error, "loading": isLoading};
//   // if (error ||) {
//   //   return { data: null, error: null, loading: true};
//   // }
//   // console.log(data)
//   // return { data: error, error: error, loading: false};
// };

export { fetcher };
