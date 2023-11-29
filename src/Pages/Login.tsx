import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorPage from '../components/ErrorPage'
import Header from '../components/Header'
import './pagestyles.css'
import jwt_decode from 'jwt-decode'
import { JwTokenData } from '../models/Model'

interface Props {
    checkTokenValidation: () => Promise<boolean>
}

const Login: React.FC<Props> = ({ checkTokenValidation }) => {
    var navigation = useNavigate();

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [authorized, setAuthorized] = useState<boolean>(false)
    const [user, setUser] = useState<JwTokenData>({ nameid: "", email: "", exp: 0, iat: 0, nbf: 0, unique_name: "", role: ""})


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        var params = {
            email: username,
            password: password
        }

        var result = await axios.post(`apiUser/SignIn/login`, {
                email: username,
                password: password
            })
            .then(response => {return response});
        var endCookie = new Date();

        console.log(result.data);

        var jwt = result.data.split(".")
        var base64 = jwt[1].replace('-', '+').replace('_', '/');
        localStorage.setItem('jwtPayload', base64)
        document.cookie = `jwtoken=${result.data}; expires=${new Date().setHours(endCookie.getHours() + 1)}; path=/`
        setUser(JSON.parse(window.atob(base64)));
    }

    useEffect(() => {
        const checkValid = async () => {
            setAuthorized(await checkTokenValidation());
        }

        checkValid();
    }, [])

    useEffect(() => {
        if(user.role === "") {
            return;
        }
        if(user.role === "Administrator") {
            window.location.href = 'https://localhost:7068';
        } else {
        navigation(-1);
        }
    }, [user])
    
    if(authorized) {
        return <ErrorPage />
    }

    return (
        <div>
        <Header />
        <form className='login-form' onSubmit={onSubmit}>
            <input type="text" onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button>Login</button>
        </form>
        <Link to={'/register'} >Register an account</Link>
        </div>
    )
}

export default Login