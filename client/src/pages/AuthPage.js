import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {NavLink, useLocation} from "react-router-dom";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const location = useLocation()
    console.log(location)
    const [form, setForm] = useState({
        forename: '', surname: '', email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error,  message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value })
    }

    const signUpHandler = async () => {
        try {
            const data = await request('/api/auth/signUp', 'POST', {...form})
            message(data.message)
            if(data.message === "Регистрация прошла успешно") {
                signInHandler()
            }
        } catch (e) {}
    }

    const signInHandler = async () => {
        try {
            const data = await request('/api/auth/signIn', 'POST', {...form})
            auth.login(data.token, data.userId, data.mail, data.fore, data.sur)
        } catch (e) {}
    }

    return (

        <div className="row">
            <div className="col s6 offset-s3">
                <h3>Занимательная информатика</h3>
                { location.pathname === '/' ?
                <div className="card pink darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <div className="input-field">
                                    <input className="pink-input" id="email" name="email" type="email" onChange={changeHandler}/>
                                    <label htmlFor="email">Введите почту</label>
                                </div>
                                <div className="input-field">
                                    <input className="pink-input" id="password" name="password" type="password" onChange={changeHandler}/>
                                    <label htmlFor="password">Введите пароль</label>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button className="waves-effect waves-light btn pink lighten-3" onClick={signInHandler} style={{marginRight: 20}} disabled={loading}>Войти</button>
                        <NavLink to="/signup" className="btn-outline btn-red">Нет аккаунта?</NavLink>
                    </div>
                </div>

                :
                    <div className="card pink darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Регистрация</span>
                            <div>
                                <div className="input-field">
                                    <div className="input-field">
                                        <input className="pink-input" id="email" name="email" type="email" onChange={changeHandler}/>
                                        <label htmlFor="email">Введите почту</label>
                                    </div>
                                    <div className="input-field">
                                        <input className="pink-input" id="password" name="password" type="password" onChange={changeHandler}/>
                                        <label htmlFor="password">Введите пароль</label>
                                    </div>
                                    <div className="input-field">
                                        <input className="pink-input" id="forename" name="forename" type="text" onChange={changeHandler}/>
                                        <label htmlFor="forename">Введите имя</label>
                                    </div>
                                    <div className="input-field">
                                        <input className="pink-input" id="surname" name="surname" type="text" onChange={changeHandler}/>
                                        <label htmlFor="surname">Введите фамилию</label>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="card-action">
                            <button className="waves-effect waves-light btn pink lighten-3" onClick={signUpHandler} style={{marginRight: 20}} disabled={loading}>Регистрация</button>
                            <NavLink to="/" className="btn-outline btn-red">Уже есть аккаунт?</NavLink>
                        </div>
                    </div>
                }
            </div>
        </div>

    )
}