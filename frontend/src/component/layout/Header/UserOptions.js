import React, { Fragment, useState } from 'react'
import { SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import "./Header.css"
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';

const UserOptions = ({ user }) => {

    const { cartItems } = useSelector((state) => state.cart)
    const [open, setOpen] = useState(false) 

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        {
            icon: (
            <ShoppingCartIcon
                style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
            />
            ),
            name: `Cart(${cartItems.length})`,
            func: cart,
        },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];  

    //Adding Dashboard icon in options array(at 0th position) on user avatar(as hover) only if user is an admin
    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }

    function dashboard() {
        navigate("/admin/dashboard");
    }
    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function cart() {
        navigate("/cart");
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
    }

  return (
    <Fragment>
        {/* This backDrop is used to make the complete backgroud grey when hovered on the profile icon on top-right corner */}
        <Backdrop open={open} style={{zIndex: "10"}}/>
        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            // zIndex is used to not show the profile icon on top right corner, if we go to the navbar(by clicking ham on top-left corner)
            style={{ zIndex: "11" }}
            open={open}
            direction="down"
            className="speedDial"
            icon={
            <img
                className="speedDialIcon"
                src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                alt="Profile"
            />
            }
        >
            {/* when hover effect on avatar, 3 or 4 options will be shown like dashboard, account, orders, logout, cart etc */}
            {options.map((item) => (
            <SpeedDialAction
                key={item.name}
                icon={item.icon}
                tooltipTitle={item.name}
                onClick={item.func}
                // If window.innerwidth <= 600 essentially means if it is a mobile
                //Then without tooltipOpen there will be no hover effect on cart icon(as shown in pc or laptop)
                //SO this property labels all the icons, fulfilling the purpose
                tooltipOpen={window.innerWidth <= 600 ? true : false}
            />
            ))}
        </SpeedDial>
    </Fragment>
  )
}

export default UserOptions