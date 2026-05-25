
import { AuthProvider } from "./Contexts/AuthContext"
import { CartProvider } from "./Contexts/CartContext"
import { WishlistProvider } from "./Contexts/WishlistContext"
import AppRoutes from "./Routes/AppRoutes"


function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App