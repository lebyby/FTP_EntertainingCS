import React from 'react'
import {NavLink} from "react-router-dom";


export const ResultCard = ({ task }) => {

    return (
        <div id="resultCardPanel" className="card-panel light-blue lighten-3">
            <div id="resultCardText">
                <h4>{task.problem}</h4>
                <p>Оценка: <strong style={{fontSize: 25}}>{task.score} % </strong></p>

                {(task.problem === 'Головоломки со спичками') ? <p>Уровень: <strong>{(task.input === 1) ? 'Легкий' : (task.input === 2) ? 'Средний' : 'Сложный'}</strong></p> : ''}

                <p>Ваш результат: <strong>{task.answer}</strong></p>

                <p>Дата: <strong>{new Date(task.date).toLocaleDateString()}</strong></p>
                <NavLink to="/create"><button className="waves-effect waves-light btn amber" id="resultCardButton"> Вернуться к выбору заданий</button></NavLink>
            </div>
        </div>
    )
}


