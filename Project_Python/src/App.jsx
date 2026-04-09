import AdminLayout from "./Admin/Layout/AdminLayout"
import Dashboard from "./Admin/Pages/Dashboard/Dashboard"
import { AuthProvider } from "./Website/Contexts/AuthContext"
import { CartProvider } from "./Website/Contexts/CartContext"
import AppRoutes from "./Website/Routes/AppRoutes"


function App() {
  return (
    // <AdminLayout>
    //   <Dashboard />
    // </AdminLayout>
    <AuthProvider>
      <CartProvider>
        <AppRoutes/>
      </CartProvider>
    </AuthProvider>
  )
}

export default App