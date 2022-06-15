import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {destroy, Init} from "../game/MatchGame";

export const SecondList = ({second}) => {

    const {token}= useContext(AuthContext)
    const navigate = useNavigate()
    const {request} = useHttp()
    const [ans, setAns] = useState({})
    const [task, setTask] = useState({})
    const taskId = useParams().id


    const getTask = useCallback(async () => {
        try {
            const fetched = await request(`/api/second/${taskId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setTask(fetched)
        } catch (e) {}
    }, [token, taskId, request])


    const createAns = async () => {
        try {
            setAns(destroy());


            await request('/api/second/ans', 'POST', {...task, answer: ans.text, attempt: ans.attempt}, {
                Authorization: `Bearer ${token}`
            })

            navigate(`/second/result/${second._id}`)

        } catch (e) {}
    }

    useEffect(() => {
        getTask()
        Init(second.input);

        return () => {
            createAns()
        };
    }, [setAns, ans, getTask]);


    return (
        <div className="row">
            <form className="col s12" onSubmit={e => e.preventDefault()}>
                <div className="row">
                    <button id="matchBut" className="waves-effect waves-light btn amber"
                            onClick={createAns}
                    >Продолжить</button>
                </div>
            </form>
        </div>
    )
}