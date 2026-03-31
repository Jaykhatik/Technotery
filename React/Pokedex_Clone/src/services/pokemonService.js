import API from "./api"


 const getPokemon=()=>{
    return API.get("/pokemon")
    .then((res)=>res.data.results)
    .catch((err)=>{console.log(err)})
};
export default getPokemon;