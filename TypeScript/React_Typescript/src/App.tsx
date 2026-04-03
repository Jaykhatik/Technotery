
import ChaiList from "./Basics/ChaiList"
import { images } from "./assets/images"
import ChaiCart from "./Basics/ChaiCart"
import Counter from "./Basics/Counter"
import OrderForm from "./Basics/OrderForm"
import type { Chai } from "./types/Chai"
import InputForm from "./Basics/InputForm"
import MyButton from "./Basics/ButtonProps"



const menu: Chai[] = [
  { id: 1, name: "Masala-Tea", price: 80, desc: "hello i am masala", imgUrl: images.Img_1 },
  { id: 2, name: "Ginger-Tea", price: 40, desc: "hello i ama Ginger Tea", imgUrl: images.Img_2 },
]
function App() {
  return (
    <>
      <ChaiCart
        name="Masala Tea"
        price={40}
        desc="Masala chai is a popular beverage originating in the Indian subcontinent. It is made by adding aromatic herbs and spices to chai, which is made from brewing black tea in milk and water, and sweetening with sugar."
        isSpecial={true}
        imgUrl={images.Img_1}
      />
      <br /><br /><br /><br /><br />
      <Counter />
      <br /><br /><br /><br /><br />
      <ChaiList items={menu} />
      <br /><br /><br /><br /><br />
      <OrderForm onSubmit={(order) => { console.log("placed : ", order.name, order.cups) }} />
      <br /><br /><br /><br /><br />
      <InputForm />
      <br /><br /><br /><br /><br />
      <MyButton onClick={() => alert("hello i am button props")} />
    </>
  )
}

export default App