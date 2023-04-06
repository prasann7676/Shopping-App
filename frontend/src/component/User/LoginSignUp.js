import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import "./LoginSignUp.css"
import Face6Icon from '@mui/icons-material/Face6';
import {useSelector,useDispatch} from 'react-redux'
import { login, register, clearErrors } from '../../actions/userAction';
import { useAlert } from "react-alert" 
import Loader from '../layout/Loader/Loader';
import { useNavigate, useLocation } from "react-router-dom"

const LoginSignUp = () => {

  const dispatch = useDispatch()  
  const alert = useAlert()
  const navigate = useNavigate()
  const location = useLocation()

  const {error, loading, isAuthenticated} = useSelector((state) => state.user)

  // In react we can access DOM elements directly using querySelectors etc
  // So we use useRef hooks for it.
  // For ex - In below from with className = loginForm, in vanilla javaScript
  // we could access this form element using  document.querySelector(".loginForm")
  // But we can't access the form element here directly using this. 
  const loginTab = useRef(null)  
  const registerTab = useRef(null)
  const switcherTab = useRef(null)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  // This Profile.png exists in public folder, therefore, we dont need to give exact path
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault()
    dispatch(login(loginEmail, loginPassword))
  }

  const registerSubmit = (e) => {
    e.preventDefault()

    //This Formdata will contain all user info for register
    const myForm = new FormData()

    myForm.set("name", name)
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    dispatch(register(myForm))
  }

  const registerDataChange = (e) => {
    if(e.target.name === "avatar"){
        const reader = new FileReader()

        reader.onload = () => {
            //readerr has 3 states, 0->inital, 1->processing, 2->done
            if(reader.readyState === 2){
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])
    }
    else{
        setUser({...user, [e.target.name]: e.target.value})
    }
  }

//   console.log("location.search ", location.search.split("=")[1])
  const redirect = location.search ? location.search.split("=")[1] : "account"

  useEffect(() => {
    if(error) {
        alert.error(error)
        dispatch(clearErrors())
    }

    if(isAuthenticated){
        navigate(`/${redirect}`)
    }
  },[dispatch, error, alert, navigate, isAuthenticated, redirect])

  const switchTabs = (e, tab) => {

    //Arguments in add and remove are actually the css class
    //that would be added or removed according to the condition
    if(tab === "login"){
        switcherTab.current.classList.add("shiftToNeutral")
        switcherTab.current.classList.remove("shiftToRight")

        registerTab.current.classList.remove("shiftToNeutralForm")
        loginTab.current.classList.remove("shiftToLeft")
    }
    if (tab === "register") {
        switcherTab.current.classList.add("shiftToRight");
        switcherTab.current.classList.remove("shiftToNeutral");
  
        registerTab.current.classList.add("shiftToNeutralForm");
        loginTab.current.classList.add("shiftToLeft");
      }
  }

  return (
    <Fragment>
        {loading ? <Loader/> : (
    <Fragment>
        <div className='LoginSignUpContainer'>
            <div className='LoginSignUpBox'>
                <div>
                    {/* Below div for switching from login to signup and vice versa in the same /login url page */}
                    <div className='login_signUp_toggle'>
                        <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                        <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                    <div className='loginEmail'>
                        <EmailIcon />
                        <input 
                            type="email"
                            placeholder='Email'
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </div>
                    <div className='loginPassword'>
                        <LockOpenIcon />
                        <input 
                            type="password"
                            placeholder='password'
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>
                    <Link to="/password/forgot">Forget Password</Link>
                    <input type="submit" value="login" className='loginBtn'/>
                </form>
                <form 
                    className="signUpForm"
                    ref={registerTab}
                    // encType is used for informing that we will not only input string or text, but also need file input(for image)
                    encType="multipart/form-data"
                    onSubmit={registerSubmit}
                >
                    <div className="signUpName">
                    <Face6Icon />
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        name="name"
                        value={name}
                        onChange={registerDataChange}
                    />
                    </div>
                    <div className="signUpEmail">
                    <EmailIcon />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={email}
                        onChange={registerDataChange}
                    />
                    </div>
                    <div className="signUpPassword">
                    <LockOpenIcon />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        name="password"
                        value={password}
                        onChange={registerDataChange}
                    />
                    </div>

                    <div id="registerImage">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={registerDataChange}
                    />
                    </div>
                    <input type="submit" value="Register" className="signUpBtn" />
                </form>
            </div>   
        </div>
    </Fragment>)}
    </Fragment>
  )
}

export default LoginSignUp