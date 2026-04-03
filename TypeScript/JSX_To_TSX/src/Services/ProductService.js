import API from "./api"
import { API_ROUTES } from "./api/routes";

const fetchProducts=()=>{
    return API.get(API_ROUTES.Product)
    .then((res)=>res.data)
    .catch((err)=>{console.log(err)})
};

export default fetchProducts;