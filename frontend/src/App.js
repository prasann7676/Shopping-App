// It will have all the routes.
import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import React, { useEffect, useState } from "react"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import webfont from 'webfontloader'
import Home from "./component/Home/Home.js"
import Loader from './component/layout/Loader/Loader';
import ProductDetails from './component/Product/ProductDetails';
import Products from "./component/Product/Products.js"
import Search from './component/Product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions';
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/forgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import axios from 'axios'
import PaymentVia from './component/Cart/PaymentVia.js';
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/admin/Dashboard';
import ProductList from './component/admin/ProductList';
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from './component/admin/UpdateProduct';
import OrderList from './component/admin/OrderList';
import ProcessOrder from './component/admin/ProcessOrder';
import UsersList from './component/admin/UsersList';
import UpdateUser from './component/admin/UpdateUser';
import ProductReviews from './component/admin/ProductReviews';
import Contact from './component/layout/Contact/Contact';
import About from './component/layout/About/About';
import NotFound from './component/layout/Not Found/NotFound'


//We use {} during import when we have to import only certain function from the component. For ex BrowserRouter
//whereas when we have to import the complete/whole component we write is without {}. for ex Loader

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user)
  //For payment 
  const [stripeApiKey, setStripeApiKey] = useState("")

  async function getStripeApiKey() {
    const { data } = await axios.get("api/v1/stripeapikey")

    console.log("data", data)
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto","Droid Sans","Chilanka"]
      },
    })

    //To retrieve user data after reloading the page.
    store.dispatch(loadUser())

    getStripeApiKey()
  },[])

  //******
  //Not body can right click on our website to inspect, to see the source html or css codes
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user}/>}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/products/:id" element={<Products />}/>
        <Route path="/search" element={<Search />}/>
        <Route path="/account" element={isAuthenticated?<Profile />:<LoginSignUp />}/>
        <Route path="/me/update" element={isAuthenticated?<UpdateProfile />:<LoginSignUp />}/>
        <Route path="/password/update" element={isAuthenticated?<UpdatePassword />:<LoginSignUp />}/>
        <Route path="/password/forgot" element={<ForgotPassword />}/>
        <Route path="/password/reset/:token" element={<ResetPassword />}/>
        <Route path="/login" element={<LoginSignUp />}/>
        <Route path="/cart" element={isAuthenticated?<Cart />:<LoginSignUp />}/>
        <Route path="/shipping" element={isAuthenticated?<Shipping />:<LoginSignUp />}/>
        <Route path="/process/payment" element={isAuthenticated?<PaymentVia stripeApiKey={stripeApiKey}/>:<LoginSignUp />} />
        <Route path="/success" element={isAuthenticated?<OrderSuccess />:<LoginSignUp />}/>
        <Route path="/orders" element={isAuthenticated?<MyOrders />:<LoginSignUp />}/>
        <Route path="/order/:id" element={isAuthenticated?<OrderDetails />:<LoginSignUp />}/>
        <Route path="/order/confirm" element={isAuthenticated?<ConfirmOrder />:<LoginSignUp />}/>
        <Route path="/admin/dashboard" element={(isAuthenticated && user.role === "admin")?<Dashboard />:<LoginSignUp />}/>
        <Route path="/admin/products" element={(isAuthenticated && user.role === "admin")?<ProductList />:<LoginSignUp />}/>
        <Route path="/admin/product" element={(isAuthenticated && user.role === "admin")?<NewProduct />:<LoginSignUp />}/>
        <Route path="/admin/product/:id" element={(isAuthenticated && user.role === "admin")?<UpdateProduct />:<LoginSignUp />}/>
        <Route path="/admin/orders" element={(isAuthenticated && user.role === "admin")?<OrderList />:<LoginSignUp />}/>
        <Route path="/admin/order/:id" element={(isAuthenticated && user.role === "admin")?<ProcessOrder />:<LoginSignUp />}/>
        <Route path="/admin/users" element={(isAuthenticated && user.role === "admin")?<UsersList />:<LoginSignUp />}/>
        <Route path="/admin/user/:id" element={(isAuthenticated && user.role === "admin")?<UpdateUser />:<LoginSignUp />}/>
        <Route path="/admin/reviews" element={(isAuthenticated && user.role === "admin")?<ProductReviews />:<LoginSignUp />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/about" element={<About />}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
