import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {ProfilePage} from "./pages/ProfilePage"
import {TaskPage} from "./pages/TaskPage"
import {FirstPage} from "./pages/FirstPage"
import {SecondPage} from "./pages/SecondPage"
import {AuthPage} from "./pages/AuthPage"
import {FirstResultPage} from "./pages/FirstResultPage";
import {SecondResultPage} from "./pages/SecondResultPage";



export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return (
            <Routes>
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="/create" element={<TaskPage />} />
                <Route path="/first/:id" element={<FirstPage />} />
                <Route path="/first/result/:id" element={<FirstResultPage />} />
                <Route path="/second/:id" element={<SecondPage />} />
                <Route path="/second/result/:id" element={<SecondResultPage />} />
                <Route path="*" element={<Navigate to="/create" replace />} />
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} exact/>
            <Route path="/signup" element={<AuthPage />} exact/>
            <Route path="*" element={<Navigate to="/"  replace />} />
        </Routes>

    )
}


