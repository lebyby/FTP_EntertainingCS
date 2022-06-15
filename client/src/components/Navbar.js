import React, {useContext} from "react";
import {NavLink, useNavigate} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        navigate("/")
    }
    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
                <a href="/" className="brand-logo"><img alt="Занимательная информатика" width="170" height="65" className="img-responsive" src={"../images/logo_ZI.png"}/></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>{auth.fore} {auth.sur}</li>
                    <li><NavLink to="/create">Выбрать задание</NavLink></li>
                    <li><NavLink to="/profile">Профиль</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}