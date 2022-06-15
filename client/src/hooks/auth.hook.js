import {useCallback, useEffect, useState} from "react";
const storageName = 'userData'

export const useAuth = () => {
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)
    const [token, setToken] = useState(null)
    const [mail, setEmail] = useState(null)
    const [fore, setFore] = useState(null)
    const [sur, setSur] = useState(null)

    const login = useCallback((jwtToken, id, m, f, s) => {
        setToken(jwtToken)
        setUserId(id)
        setEmail(m)
        setFore(f)
        setSur(s)
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, mail: m, fore: f, sur: s
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setEmail(null)
        setFore(null)
        setSur(null)
        localStorage.removeItem(storageName)
    }, [])


    useEffect( () => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.userId, data.mail, data.fore, data.sur)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, mail, fore, sur, ready}
}