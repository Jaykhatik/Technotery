import axios from "axios";

export const getAxiosInstance=(baseURL)=>{
    if(!baseURL){
        throw new Error("Base Url is missing.check your .env file");
    }
    return axios.create({
        baseURL:baseURL,
        headers:{
            "Content-Type":"application/json"
        }
    })
}