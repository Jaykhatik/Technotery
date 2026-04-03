import axios from "axios";

const getAxiosInstance=(baseURL)=>{
    if(!baseURL){
        throw new Error("Basic Url is missing .check the .env file");
    }
    return axios.create({
        baseURL:baseURL,
        headers:{
            "Content-Type":"application/json",
        },
    });
}

export default getAxiosInstance;