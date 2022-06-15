import React from 'react'
import Collapsible from "react-collapsible";
import {Link} from 'react-router-dom'

export const SecondResultList = ( {second} ) => {
    return (
        <div>
            {
                !second.length ? <></> :
                    <Collapsible className="collapsible" trigger="Головоломки со спичками">
                        <table>
                            <thead>
                            <tr>
                                <th>№ попытки</th>
                                <th>Уровень</th>
                                <th>Оценка</th>
                                <th>Ответ</th>
                                <th>Просмотр</th>
                            </tr>
                            </thead>
                            <tbody>
                            {second.map((second, index) => {
                                return (
                                    <tr key={second._id}>
                                        <td>{index + 1}</td>
                                        <td>{(second.input === 1) ? 'Легкий' : (second.input === 2) ? 'Средний' : 'Сложный'}</td>
                                        <td>{second.score}</td>
                                        <td>{second.answer}</td>
                                        <td>
                                            <Link to={`/second/result/${second._id}`}>Посмотреть результат</Link>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </Collapsible>
            }
        </div>
    )
}
