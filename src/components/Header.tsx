import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Route, Link, useNavigate } from 'react-router-dom';
import './header.css'
import Cookies from 'js-cookie';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const [burger_class, setBurgerClass] = useState<string>("burger-bar unclicked");
    const [menu_class, setMenuClass] = useState<string>("menu hidden");
    const [isMenuClicked, setIsMenuClicked] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<string>("header-link");
    const [isProfileVisible, setIsProfileVisible] = useState<string>("header-link hidden");


    const updateMenu = () => {
        if(!isMenuClicked) {
            setBurgerClass("burger-bar clicked");
            setMenuClass("menu visible");
        } else {
            setBurgerClass("burger-bar unclicked");
            setMenuClass("menu hidden");
        }
        setIsMenuClicked(!isMenuClicked);
    }

    const checkLoggedIn = () => {
        if(localStorage.getItem("jwtPayload") !== null) {
            setIsLoggedIn("header-link hidden");
            setIsProfileVisible("header-link");
        } else {
            setIsLoggedIn("header-link");
            setIsProfileVisible("header-link hidden");
        }
    }

    const onSignoutClicked = async () => {
        Cookies.remove('jwtoken');
        navigate(0);
    }

    useEffect(() => {
      checkLoggedIn();
      
    }, [localStorage.getItem('jwtPayload')])

    return (
        <div className='headermain'>
            <Link className="header-image" to={'/'}>
                <img className='header-image__img' src="/albumauclogo.png" alt="AlbumAuc Logo" />
            </Link>
            <nav className='header' >
                <div className="burger-menu" onClick={updateMenu}>
                    <div className={burger_class}></div>
                    <div className={burger_class}></div>
                    <div className={burger_class}></div>
                </div>
            </nav>

            <div className={menu_class}>
                <hr className='menu-hr'/>
                <Link to={'/'} className='header-link'>Home</Link>
                <hr className='menu-hr'/>
                <Link to={'/profile'} className={isProfileVisible}>Profile</Link>
                <hr className='menu-hr' />
                <Link to={'/'} className={isProfileVisible} onClick={onSignoutClicked}>Sign out</Link>
                <Link to={'/login'} className={isLoggedIn}>Login</Link>
                <hr className='menu-hr' />
                <Link to={'/register'} className={isLoggedIn}>Register</Link>
                <hr className='menu-hr' />
            </div>
        </div>
    )
}

export default Header
