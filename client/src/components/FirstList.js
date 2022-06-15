import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {destroy, Init} from "../game/TrainGame";

export const FirstList = ({first}) => {

    const {token}= useContext(AuthContext)
    const navigate = useNavigate()
    const {request} = useHttp()
    const [ans, setAns] = useState({})
    const [task, setTask] = useState({})
    const taskId = useParams().id


    const getTask = useCallback(async () => {
        try {
            const fetched = await request(`/api/first/${taskId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setTask(fetched)
        } catch (e) {}
    }, [token, taskId, request])


    const createAns = async () => {
        try {
            setAns(destroy());
            await request('/api/first/ans', 'POST', {...task, answer: ans.text, attempt: ans.attempt}, {
                Authorization: `Bearer ${token}`
            })

            navigate(`/first/result/${first._id}`)

        } catch (e) {}
    }

    useEffect(() => {
        getTask()
        Init();
        return () => {
            createAns()
        };
    }, [setAns, ans, getTask]);


    return (
        <div className="row">
            <form className="col s12" onSubmit={e => e.preventDefault()}>
                <div className="row">
                    <button id="trainBut" className="waves-effect waves-light btn green lighten-1"
                            onClick={createAns}
                    >Продолжить</button>

                </div>
            </form>
        </div>
    )
}