import React from 'react'
import Collapsible from "react-collapsible";
import {Link} from 'react-router-dom'


export const FirstResultList = ({first} ) => {
    return (
        <div>
            {
                !first.length ? <></> :
                    <Collapsible className="collapsible" trigger="Задача о разъездах">
                        <table>
                            <thead>
                            <tr>
                                <th>№ попытки</th>
                                <th>Оценка</th>
                                <th>Ответ</th>
                                <th>Просмотр</th>
                            </tr>
                            </thead>
                            <tbody>
                            {first.map((first, index) => {
                                return (
                                    <tr key={first._id}>
                                        <td>{index + 1}</td>
                                        <td>{first.score}</td>
                                        <td>{first.answer}</td>
                                        <td>
                                            <Link to={`/first/result/${first._id}`}>Посмотреть результат</Link>
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
