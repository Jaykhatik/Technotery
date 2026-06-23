const LogicalError=()=>{
let num=8;
if(num=10){//because here we use the assign operator,not the comparison == so thats why it is logical error
    console.log("10 is number")
}else{
    console.log("8 is number")
}
}

module.exports=LogicalError;


/*
this is logical error page

*/ 