
import type { Chai } from '../types/Chai';
import ChaiCart from './ChaiCart';


interface ChaiListProps {
    items: Chai[]
}
function ChaiList({ items }: ChaiListProps) {
    return (
        <div style={{display:'flex',gap:'20px',margin:'50px auto'}}>
            {items.map((cl) => (
                <ChaiCart
                    key={cl.id}
                    name={cl.name}
                    price={cl.price}
                    isSpecial={cl.price > 30}
                    imgUrl={cl.imgUrl}
                    desc={cl.desc}
                />
            ))}
        </div>
    )
}

export default ChaiList