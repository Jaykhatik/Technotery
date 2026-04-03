import type React from "react"
import { useState } from "react"


const InputForm: React.FC = () => {
    const [name, setName] = useState<string>("");

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=> {
    setName(e.target.value);
};
return (
    <div>
        <input type="text" onChange={handleChange} value={name} />
        <p>Hello , {name}</p>
    </div>
)
}

export default InputForm;