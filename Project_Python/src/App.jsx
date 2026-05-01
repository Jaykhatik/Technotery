import { AuthProvider } from "./Website/Contexts/AuthContext"
import { CartProvider } from "./Website/Contexts/CartContext"
import AppRoutes from "./Website/Routes/AppRoutes"


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes/>
      </CartProvider>
    </AuthProvider>
  )
}

export default App