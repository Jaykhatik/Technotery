import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Product from "../pages/Product";
import Users from "../pages/Users";
import Carts from "../pages/Carts";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Product />} />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/carts"
                    element={
                        <ProtectedRoute>
                            <Carts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;