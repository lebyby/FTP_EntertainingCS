import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    fore: null,
    sur: null,
    mail: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})
