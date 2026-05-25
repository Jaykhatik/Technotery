import AllRequests from "../../Admin/Pages/Requests/AllRequests/Allrequest"

export const Login_API_ROUTES = {
    signup: "/signup",
    login: "/login"
}
export const ADMIN_API_ROUTES = {
    Allcategories: "/categories",
    addCategory: "/category",
    AllNotiCatRequests: "/category-requests",
    App_DisApp: "/category-request",
    AllRequests: "/category-requests/all",
    orderStatus:"/order"
}

export const SELLER_API_ROUTES={
    AllProducts:"/products",
    CatReq:"/category-request",
    AddProduct:"/product",
    SellerAllReq:"/category-requests"
}

export const USER_API_ROUTES={
    UserProfile:"/profile",
    AddToCart:"/cart",
    CreateAddress:"/address",
    Checkout:"/checkout",
    Payment:"/payment",
    ViewOrder:"/order"
}