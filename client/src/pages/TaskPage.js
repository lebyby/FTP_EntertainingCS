import React, {useContext, useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import Collapsible from "react-collapsible";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const TaskPage = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const {request} = useHttp()
    const [inp, setInput] = useState([])
    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const FirstHandler = async () => {
        try {
            const data = await request('/api/first/generate', 'POST', {...inp}, {
                Authorization: `Bearer ${auth.token}`
            })
            setInput(data)
            navigate(`/first/${data.ans._id}`)
        } catch (e) {
        }
    }

    const Second_1_Handler = async () => {
        try {
            const data = await request('/api/second/generate/1', 'POST', {...inp}, {
                Authorization: `Bearer ${auth.token}`
            })
            setInput(data)
            navigate(`/second/${data.ans._id}`)
        } catch (e) {}
    }

    const Second_2_Handler = async () => {
        try {
            const data = await request('/api/second/generate/2', 'POST', {...inp}, {
                Authorization: `Bearer ${auth.token}`
            })
            setInput(data)
            navigate(`/second/${data.ans._id}`)
        } catch (e) {}
    }

    const Second_3_Handler = async () => {
        try {
            const data = await request('/api/second/generate/3', 'POST', {...inp}, {
                Authorization: `Bearer ${auth.token}`
            })
            setInput(data)
            navigate(`/second/${data.ans._id}`)
        } catch (e) {}
    }

    return (
        <div>
            <h2 style={{marginTop: 110}}> Список задач </h2>
            <Collapsible className="collapsible" trigger="Задача о разъездах">
                <p className="blockquote"> В этом разделе представлена задача о разъездах. Управление происходит с помощью клавиатуры.
                    Внитри задачи выскакивают подсказки по нажатию доступных клавиш.
                    Каждый поезд может перемещаться в левую и правую стороны путем нажатия соответствующих стрелок на клавиатуре.</p>
                <p className="blockquote"> Нажмите кнопку, чтобы начать</p>
                <div className="input-field" onSubmit={e => e.preventDefault()}>
                    <button className="waves-effect waves-light btn pink lighten-3"
                           onClick={FirstHandler}
                    >Начать</button>
                </div>

            </Collapsible>
            <Collapsible className="collapsible" trigger="Головоломки со спичками">
                <p className="blockquote"> В этом разделе представлен набор головоломок со спичками разных уровней сложности.
                    Простыми махинациями компьтерной мыши вы можете удалять или перемещать спички, чтобы решить задания.</p>
                <p className="blockquote"> Выберите уровень сложности, чтобы начать</p>
                    <div className="input-field">

                    <button className="waves-effect waves-light btn pink lighten-3" style={{marginRight: 20}}
                            onClick={Second_1_Handler}
                    >Легкий</button>

                    <button className="waves-effect waves-light btn pink lighten-3" style={{marginRight: 20}}
                            onClick={Second_2_Handler}
                    >Средний</button>

                    <button className="waves-effect waves-light btn pink lighten-3" style={{marginRight: 20}}
                            onClick={Second_3_Handler}
                    >Сложный</button>
                </div>

            </Collapsible>
        </div>
    )
}
