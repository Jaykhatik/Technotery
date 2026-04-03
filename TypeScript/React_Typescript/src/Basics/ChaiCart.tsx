interface ChaiCartProps{
    name:string;
    price:number;
    desc:string;
    isSpecial:boolean;
    imgUrl:string;
}


function ChaiCart({name,price,desc,isSpecial=false,imgUrl}:ChaiCartProps){
    return(
        <>
        <div className="chaicart" style={{padding:'20px',border:'1px solid black',width:'100%',maxWidth:'350px'}}>
            <div className="chaicart-header" style={{textAlign:'center'}}>
                <h2>{name}</h2>
            </div>
            <div className="chaicart-body" style={{textAlign:'center'}}>
                <img src={imgUrl} alt={name} style={{width:'100%' ,borderRadius:"10px",maxWidth:'300px'}} />
                <div className="chaicart-body-content" style={{width:'100%' ,borderRadius:"10px",maxWidth:'300px'}}>
                    <h4>{price}</h4>
                    <p>{desc}</p>
                </div>
            </div>
            <div className="chaicart-footer">
                <span>special: {isSpecial && <span>⭐</span>}</span>
            </div>
        </div>
        </>
    );
}

export default ChaiCart;