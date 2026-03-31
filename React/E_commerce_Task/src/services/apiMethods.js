export const getRequest=(API,url)=>{
    return API.get(url)
    .then((res)=>res.data)
    .catch((err)=>{
        console.log("GET ERRORS",err);
        return null;
    })
}