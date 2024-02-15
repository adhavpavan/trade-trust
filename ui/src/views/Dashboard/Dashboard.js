import React, { useEffect } from 'react'
import Header from '../../components/Headers/Header'
import { useHistory } from 'react-router-dom'


export default function Dashboard() {
    let history = useHistory()
    useEffect(() => {
        console.log(`-------------------------------`)
        let token = localStorage.getItem('token')
        console.log(`token is -------------: ${token}`)
        if (!token) {
            console.log(`Triggered`)
            history.push('auth/login')
        }

    }, [])
    return (
        <div>
            <Header />
            <span className="h1">This is Dashboard Component</span>

        </div>
    )
}
