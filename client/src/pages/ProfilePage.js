import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {FirstResultList} from '../components/FirstResultList'
import {SecondResultList} from "../components/SecondResultList";

export const ProfilePage = () => {
    const [first, setFirst] = useState([])
    const [second, setSecond] = useState([])
    const {loading, request} = useHttp()
    const {mail, fore, sur, token} = useContext(AuthContext)

    const getAns = useCallback(async () => {
        try {
            const data1 = await request('/api/first', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            const data2 = await request('/api/second', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setFirst(data1)
            setSecond(data2)
        } catch (e) {
        }
    }, [token, request])

    useEffect(() => {
        getAns()
    }, [getAns])


    if (loading) {
        return <Loader/>
    }

    return (
        <>
            {!loading}
            <div className="row">
                <div className="col s12 m55" style={{marginTop: 60}}>
                    <div className="card blue lighten-5">
                        <div className="card-content black-text">
                            <span className="card-title">{fore} {sur}</span>
                            <p>{mail}</p>
                        </div>

                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col s12 m55">
                    <div className="card blue lighten-5">
                        <div className="card-content black-text">
                            <span className="card-title">Результаты</span>
                            {(!first.length && !second.length) ? <p className="left"> Вы не решили ни одной задачи
                            </p> :
                                <>
                                    <FirstResultList first={first}/>
                                    <SecondResultList second={second}/>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



