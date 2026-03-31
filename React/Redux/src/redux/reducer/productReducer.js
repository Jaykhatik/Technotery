
const initialState={
    products:[],
}


export const productReducer=(state=initialState,action)=>{
if(action.type==="ADD_TO_PRODUCT"){
    console.log("add to produst reducer",action.payload)
    return state;//compulsory to return state
}
else{
    return state;
}
}